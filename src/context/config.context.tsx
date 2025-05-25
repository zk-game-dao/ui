import { BannerProps } from 'components/banner/banner.component';
import { createContext, memo, PropsWithChildren, useContext, useEffect } from 'react';

export const Themes = ['zkpoker', 'purepoker'] as const;
export type Theme = typeof Themes[number];

export type UIConfig = {
  theme: Theme;
  banner?: BannerProps;
};

const ConfigContext = createContext<UIConfig>({ theme: "zkpoker" });

export const ProvideConfig = memo<PropsWithChildren<UIConfig>>(
  ({ children, ...theme }) => {
    const currentTheme = useContext(ConfigContext);

    useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme.theme);
      Themes.forEach(v => document.documentElement.classList.remove(v));
      document.documentElement.classList.add(theme.theme);
    }, [theme.theme]);

    return (
      <ConfigContext.Provider value={{ ...currentTheme, ...theme }}>
        {children}
      </ConfigContext.Provider>
    );
  },
);

export const useConfig = () => useContext(ConfigContext);
