import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { ButtonComponent } from '../button/button.component';
import { ErrorComponent } from '../error/error.component';
import { Interactable } from '../interactable.component';
import { Modal, ModalFooterPortal, ModalProps, ModalTitlePortal } from './modal';

type AllowedData = object;

export type StepComponentProps<T extends AllowedData, LocalState = unknown> = {
  data: Partial<T>;
  patch: (v: Partial<T>) => void;
  localState: LocalState;
  patchLocalState: (v: Partial<LocalState>) => void;
};

export type SteppedModalStep<T extends AllowedData, LocalState = unknown> = {
  title: string;
  Component: React.ComponentType<StepComponentProps<T, LocalState>>;
  isValid: (v: Partial<T>, localState: LocalState) => true | unknown[];
  defaultValues: Partial<T>;
  applyLocalState?: (v: Partial<T>, localState: LocalState) => Partial<T>;
  deriveLocalState?: (v: Partial<T>) => Partial<LocalState>;
  enabled?: (v: Partial<T>) => boolean;
};

export type SteppedModalProps<T extends AllowedData> = {
  steps: SteppedModalStep<T>[];
  mutate(data: T): any;
  error?: unknown;
  isPending?: boolean;
  reset?(): void;
  submitLabel?: ReactNode;
  initialStep?: number;
  initialData?: Partial<T>;
} & Pick<ModalProps, 'open' | 'onClose'>;

export function SteppedModalComponent<T extends AllowedData, LocalState = unknown>({
  steps: propsSteps,
  mutate,
  error,
  isPending,
  reset,
  open,
  onClose,
  initialStep = 0,
  submitLabel = "Create",
  initialData = {},
}: SteppedModalProps<T>) {
  const [value, setValue] = useState<Partial<T>>(
    propsSteps.reduce((acc, { defaultValues }) => ({ ...acc, ...defaultValues, ...initialData }), {}),
  );

  const steps = useMemo((): SteppedModalStep<T>[] => propsSteps.filter(v => !v.enabled || v.enabled(value)), [propsSteps, value]);

  const [step, setStep] = useState(initialStep);

  useEffect(() => {
    if (!reset) return;
    reset();
  }, [step]);

  const [validationErrors, setValidationErrors] = useState<{ [step: number]: unknown[] }>({});

  const { Component, isValid, applyLocalState, title, deriveLocalState } = useMemo(() => steps[step], [step]);

  const [localState, setLocalState] = useState<Partial<LocalState>>(deriveLocalState ? deriveLocalState(value) : {});

  const Steppers = useMemo(
    () =>
      steps
        .map((_, i) => {
          const disabled = i > step;
          return (
            <Interactable
              onClick={!disabled && step !== i ? () => setStep(i) : undefined}
              key={i}
              className={classNames(
                "w-[24px] lg:w-[42px] h-1 rounded-full",
                disabled ? "bg-material-main-1" :
                  validationErrors[i] && validationErrors[i]?.length > 0 ? "bg-purple-500" : "bg-white",
              )}
            />
          );
        }),
    [step, validationErrors],
  );

  const err = useMemo(() => (
    <>
      <ErrorComponent translucent key="error" error={error} />
      <ErrorComponent translucent
        key="validation"
        error={validationErrors[step]}
        isUserError
      />
    </>
  ), [error, validationErrors, step]);

  return (
    <Modal
      onClose={onClose}
      open={open}
      contentGap=""
    >
      <ModalTitlePortal>
        <div className="flex flex-row justify-center items-center gap-2">
          {Steppers}
        </div>
      </ModalTitlePortal>
      <AnimatePresence>
        {!!(error || validationErrors[step]) && (
          <>
            <motion.div
              key="size preview"
              variants={{
                hidden: { opacity: 0, height: 0 },
                visible: { opacity: 0, height: "auto" },
              }}
              className='opacity-0'
            >
              {err}
            </motion.div>
            <motion.div
              key="real"
              variants={{
                hidden: { opacity: 0, height: 0 },
                visible: { opacity: 1, height: "auto" },
              }}
              className='absolute top-14 w-full left-0 px-4 lg:px-8'
            >
              {err}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className='flex flex-col gap-8'>
        <div className="flex flex-col text-center justify-center items-center gap-2">
          <p className="type-medior text-material-medium-1">
            Step {step + 1}
          </p>
          <p className="type-top text-white">{title}</p>
        </div>
        <Component
          data={value}
          patch={(p) => setValue((v) => ({ ...v, ...p }))}
          localState={localState}
          patchLocalState={(p) => setLocalState((v) => ({ ...v, ...p }))}
        />
      </div>
      <ModalFooterPortal>
        <ButtonComponent
          variant="naked"
          onClick={step === 0 ? onClose : () => setStep(step - 1)}
        >
          {step === 0 ? "Cancel" : "Back"}
        </ButtonComponent>
        <ButtonComponent
          onClick={() => {
            const result = isValid(value, localState);
            if (result !== true) {
              setValidationErrors(v => ({ ...v, [step]: result }));
              return;
            }
            setValidationErrors({ ...validationErrors, [step]: [] });
            if (step < steps.length - 1) {
              if (applyLocalState)
                setValue(applyLocalState(value, localState) as T);
              setStep(step + 1);
              return;
            }
            if (applyLocalState) {
              mutate(applyLocalState(value, localState) as T);
            } else {
              mutate(value as T);
            }
          }}
          isLoading={isPending}
        >
          {step === steps.length - 1
            ? submitLabel
            : "Next"}
        </ButtonComponent>
      </ModalFooterPortal>

    </Modal>
  );
};
