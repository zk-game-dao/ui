import { ERROR_USER_INTERRUPT } from '@dfinity/auth-client';
import { AxiosError } from 'axios';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, ReactNode, useEffect, useMemo } from 'react';

import { InlineMarkdownComponent } from '../markdown/markdown.component';

// import { useFeedbackContext } from "@/src/lib/feedback/feedback.context";

type ParsedErrorMessage = {
  title?: string;
  message: string;
  isUserError?: boolean;
};

export type PokerError = { [key: string]: any };

const titleLiFy = (input: string) =>
  input
    .split(/(?=[A-Z])/)
    .map((s, i) =>
      i === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s.toLowerCase(),
    )
    .join(" ");

const ParsedErrorMessageComponent = memo<ParsedErrorMessage>(
  ({ title, message }) => (
    <>
      {title && <p className="whitespace-nowrap font-bold w-full">{title}</p>}
      {message && (
        <div className={classNames({ "text-opacity-75": title }, "w-full")}>
          <InlineMarkdownComponent>
            {message.trim()}
          </InlineMarkdownComponent>
        </div>
      )}
    </>
  ),
);

export class UserError extends Error {
  public readonly isUserError = true;
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}

export class WalletTypeNotInstalledError extends UserError {
  constructor(public readonly walletType: any) {
    super("Wallet not found");
    this.name = "WalletTypeNotInstalledError";
  }
}

export const ErrorComponent = memo<{
  error?: unknown;
  title?: ReactNode;
  className?: string;
  isUserError?: boolean;
  translucent?: boolean;
}>(({ error: _error, title, className, isUserError = false, translucent = false }) => {
  // const { openFeedback } = useFeedbackContext();

  const parsed = useMemo((): ParsedErrorMessage[] | undefined => {
    let error = _error;

    if (!error) return [];
    if (error instanceof AxiosError)
      return [{ message: error.response?.data?.description || error.message }];
    if (error instanceof WalletTypeNotInstalledError)
      switch (error.walletType) {
        case 'bitfinityWallet':
          return [{
            title: "Bitfinity Wallet not installed",
            message: `Please [install Bitfinity Wallet](https://wallet.bitfinity.network/) to continue.`,
            isUserError: true
          }];
        case 'plug':
          return [{
            title: "Plug Wallet not installed",
            message: `Please [install Plug Wallet](https://www.plugwallet.ooo/) to continue.`, isUserError: true
          }];
      }
    if (error instanceof UserError)
      return [{ message: error.message, isUserError: true }];
    if (error instanceof Error) return [{ message: error.message }];
    if (typeof error === "string") {
      try {
        error = JSON.parse(error);
      } catch {
        error = _error;
      }
    }
    if (typeof error === "string") {
      switch (error) {
        case ERROR_USER_INTERRUPT:
          return [{ message: "Interrupted", isUserError: true }];
        default:
          return [{ message: error, isUserError: true }];
      }
    }
    if (Array.isArray(error)) return error.map((e) => ({ message: "" + e }));

    if (!(error instanceof Object)) return [{ message: "" + error }];

    if ("message" in error) return [{ message: "" + error["message"] }];

    const pokerError = error as PokerError;
    if ("Game" in pokerError) {
      if ("ActionNotAllowed" in pokerError.Game)
        return [
          {
            title: "Action not allowed",
            message: titleLiFy(pokerError.Game.ActionNotAllowed.reason),
            isUserError: true,
          },
        ];

      if ("BlindInsufficientFunds" in pokerError.Game)
        return [
          {
            title: "Insufficient funds",
            message: `User with id ${pokerError.Game.BlindInsufficientFunds.user_id} has insufficient funds to place blinds`,
            isUserError: true,
          },
        ];

      if ("InvalidCardValue" in pokerError.Game)
        return [{ message: "Invalid card value", isUserError: false }];

      if ("Other" in pokerError.Game)
        return [
          { message: 'error' + JSON.stringify(pokerError.Game.Other), isUserError: true },
        ];

      return Object.entries(pokerError.Game).map(([key, error]) => ({
        title: (error || undefined) && titleLiFy(key),
        message: (error ? "" + error : undefined) ?? titleLiFy(key),
        isUserError: true,
      }));
    }

    if ("InsufficientFunds" in pokerError)
      return [{ message: "Insufficient funds", isUserError: true }];

    if ("TableNotFound" in pokerError)
      return [{ message: "Table not found", isUserError: true }];

    if ("UserError" in error && error.UserError instanceof Object)
      return Object.entries(error.UserError).map(([key, error]) => ({
        title: titleLiFy(key),
        message: error && "" + error,
        isUserError: true,
      }));


    return Object.entries(error).map(([key, error]) => ({
      title: titleLiFy(key),
      message: error && "" + JSON.stringify(error),
    }));
  }, [_error]);

  const canReport = useMemo(
    () => !isUserError && !parsed?.some(({ isUserError }) => isUserError),
    [parsed, isUserError],
  );

  useEffect(() => {
    if (!_error) return;
    console.error(_error);
  }, [_error]);

  return (
    <AnimatePresence>
      {parsed !== undefined && parsed.length > 0 && (
        <motion.div
          key="error"
          variants={{
            hidden: { opacity: 0, height: 0 },
            visible: { opacity: 1, height: "auto" },
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={classNames(
            "text-white type-callout rounded-xl overflow-hidden",
            translucent ? "bg-[#392247]" : "bg-purple-500/[0.12]",
            className,
          )}
        >
          <div className="p-6 gap-1 text-left flex flex-col justify-start items-start overflow-auto whitespace-pre-wrap">
            {title && <p className="type-header" key="title">{title}</p>}
            <AnimatePresence>
              {parsed.map((error, i) => (
                <ParsedErrorMessageComponent {...error} key={`${i}-${error}`} />
              ))}
              {/* {canReport && (
                <ButtonComponent
                  onClick={() =>
                    openFeedback(
                      `I received this error: \`${title}:\n${parsed
                        .map(({ title, message }) =>
                          title ? `${title}: ${message}` : message,
                        )
                        .join("\n")}\``,
                    )
                  }
                  color="purple"
                  className="mt-4"
                >
                  Report error
                </ButtonComponent>
              )} */}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default ErrorComponent;
