import classNames from 'classnames';
import { FooterComponent, FooterLink } from 'components/footer/footer.component';
import {
  LoadingAnimationComponent
} from 'components/loading-animation/loading-animation.component';
import { Tab } from 'components/navbar/navbar-tab.component';
import { set } from 'lodash';
import {
  createContext, FC, memo, PropsWithChildren, ReactNode, Suspense, useCallback, useContext,
  useEffect, useId, useMemo, useState
} from 'react';

import { HeroComponent, HeroComponentProps } from '../hero/hero.component';
import NavbarComponent, { NavbarComponentProps } from '../navbar/navbar.component';

type LayoutProps = {
  navbar?: NavbarComponentProps;
  container?: "default" | "large";
  isFullScreen?: boolean;
  className?: string;
  footer?: boolean;
  hero?: HeroComponentProps;
};

// Utility type to create paths for nested objects
type NestedPaths<T> = T extends object
  ? {
    [K in keyof T]: K extends string
    ? T[K] extends object
    ? K | `${K}.${NestedPaths<T[K]>}`
    : K
    : never;
  }[keyof T]
  : never;

// Utility type to extract the value type of a path
type ValueAtPath<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
  ? Rest extends NestedPaths<T[Key]>
  ? ValueAtPath<T[Key], Rest>
  : never
  : never
  : P extends keyof T
  ? T[P]
  : never;

type LayoutOverride<T extends LayoutProps, P extends NestedPaths<T>> = {
  path: P;
  value: ValueAtPath<T, P>;
};

const LayoutContext = createContext<{
  updateLayout(props: LayoutProps): void;
  overrideProp<T extends LayoutProps, P extends NestedPaths<T>>(
    id: string,
    path: P,
    value: ValueAtPath<T, P>,
  ): () => void;
  props: LayoutProps;
}>({
  updateLayout: () => { },
  overrideProp: () => () => { },
  props: {},
});

export const useLayout = () => useContext(LayoutContext).props;

export const LayoutProvider = memo<PropsWithChildren>(({ children }) => {
  const [_globalLayout, setLayout] = useState<LayoutProps>({});

  const [overrides, setOverrides] = useState<{
    [id: string]: LayoutOverride<LayoutProps, NestedPaths<LayoutProps>>;
  }>({});

  const {
    navbar,
    footer,
    hero,
    className,
    isFullScreen,
    container = "default",
  } = useMemo(() => {
    return Object.values(overrides).reduce((acc, { path, value }) => {
      // Type guard to ensure path is defined
      if (path) {
        set(acc, path, value);
      }
      return acc;
    }, _globalLayout);
  }, [_globalLayout, overrides]);

  const overrideProp = useCallback(function override<
    T extends LayoutProps,
    P extends NestedPaths<T>,
  >(id: string, path: P, value: ValueAtPath<T, P>): () => void {
    setOverrides((prev) => ({ ...prev, [id]: { path, value } }));
    return () =>
      setOverrides((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
  }, []);

  const updateLayout = useCallback(
    (props: LayoutProps) => setLayout(props),
    [],
  );

  useEffect(() => {
    window.document.documentElement?.classList[isFullScreen ? 'add' : 'remove']('global-full-screen');
  }, [isFullScreen])

  return (
    <LayoutContext.Provider
      value={{
        updateLayout,
        overrideProp,
        props: {
          navbar,
          footer,
          hero,
          className,
          container,
        },
      }}
    >
      <NavbarComponent {...navbar} />
      <Suspense fallback={<LoadingAnimationComponent className="m-auto" />}>
        <main
          className={classNames(
            "w-full min-h-full flex-1 flex flex-col",
            className,
          )}
        >
          {hero && <HeroComponent {...hero} />}
          <div
            className={classNames(
              "flex flex-col overflow-hidden basis-full flex-1",
              { "pb-12": footer },
            )}
          >
            {children}
          </div>
        </main>

        {footer && <FooterComponent fullWidth={container === "large"} />}
      </Suspense>
    </LayoutContext.Provider>
  );
});

export const LayoutComponent = memo<PropsWithChildren<LayoutProps>>(
  ({ children, ...props }) => {
    const { updateLayout } = useContext(LayoutContext);
    useEffect(
      () => updateLayout(props),
      [
        props.navbar,
        props.className,
        props.footer,
        props.hero,
        props.container,
        updateLayout,
      ],
    );
    return children;
  },
);

export const useOverrideLayout = <
  T extends LayoutProps,
  P extends NestedPaths<T>,
>(
  path: P,
  value: ValueAtPath<T, P>,
) => {
  const id = useId();
  const { overrideProp } = useContext(LayoutContext);

  const memoizedValue = useMemo(() => value, [value]);
  // Memoize the override callback
  const overrideCallback = useCallback(
    () => overrideProp(id, path, memoizedValue),
    [id, path, memoizedValue],
  );

  useEffect(() => overrideCallback(), [overrideCallback]);
};

export const LayoutOverrideComponent = memo<
  LayoutOverride<LayoutProps, NestedPaths<LayoutProps>>
>(({ path, value }) => {
  useOverrideLayout(path, value);

  return null;
});

export type LayoutConfig = {
  footerLinks: FooterLink[];
  NavbarUserComponent: FC;

  isOverlay?: boolean;
  hideUser?: boolean;

  navbarTabs: Tab[];
  navbarRightSide?: ReactNode;
};

const LayoutConfigContext = createContext<LayoutConfig & { override(id: string, config: Partial<LayoutConfig>): () => void; }>({
  footerLinks: [],
  navbarTabs: [],
  override: () => () => { },
  NavbarUserComponent: () => <></>,
});

export const ProvideLayoutConfig = memo<PropsWithChildren<LayoutConfig>>(({ children, ...lc }) => {
  const [layoutOverride, setLayoutOverride] = useState<{ [id: string]: Partial<LayoutConfig> }>();

  const {
    footerLinks,
    NavbarUserComponent,
    isOverlay,
    hideUser,
    navbarTabs,
    navbarRightSide,
  } = useMemo((): LayoutConfig =>
    !layoutOverride ?
      lc :
      Object.values(layoutOverride)
        .reduce<LayoutConfig>((v, all): LayoutConfig => ({ ...v, ...all }), lc) as LayoutConfig,
    [lc, layoutOverride]
  );

  const override = useCallback(function ovr(id: string, config: Partial<LayoutConfig>): () => void {
    setLayoutOverride(previous => ({
      ...previous,
      [id]: config,
    }));
    return () =>
      setLayoutOverride(previous => {
        const copy = { ...previous };
        delete copy[id];
        return copy;
      });
  }, []);

  const value = useMemo(() => ({
    footerLinks,
    NavbarUserComponent,
    isOverlay,
    hideUser,
    navbarTabs,
    navbarRightSide,
    override
  }), [footerLinks, NavbarUserComponent, isOverlay, hideUser, navbarTabs, navbarRightSide, override]);

  return (
    <LayoutConfigContext.Provider
      value={value}
    >
      {children}
    </LayoutConfigContext.Provider>
  )
});
export const useLayoutConfig = () => useContext(LayoutConfigContext);
export const useOverrideLayoutConfig = (value: Partial<LayoutConfig>) => {
  const id = useId();
  const { override } = useContext(LayoutConfigContext);

  const memoizedValue = useMemo(() => value, [value]);
  // Memoize the override callback
  const overrideCallback = useCallback(
    () => override(id, memoizedValue),
    [id, memoizedValue],
  );

  useEffect(() => overrideCallback(), [overrideCallback]);
};

export const OverrideLayoutConfigComponent = memo<PropsWithChildren<Partial<LayoutConfig>>>(({ children, ...value }) => {
  useOverrideLayoutConfig(value);

  return <>{children}</>;
});