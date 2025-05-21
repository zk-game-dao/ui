import { createContext, memo, PropsWithChildren, useContext } from 'react';

export type ThemeContextValue = {
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({ isDark: true });

export const ProvideTheme = memo<PropsWithChildren<ThemeContextValue>>(
  ({ children, ...theme }) => {
    const currentTheme = useContext(ThemeContext);
    return (
      <ThemeContext.Provider value={{ ...currentTheme, ...theme }}>
        {children}
      </ThemeContext.Provider>
    );
  },
);

export const useTheme = () => useContext(ThemeContext);
