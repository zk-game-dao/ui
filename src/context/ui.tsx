import { memo, PropsWithChildren } from 'react';

import { ProvideModalStack } from './modal-stack.context';
import { ProvideTheme, ThemeContextValue } from './theme.context';
import { ProvideConfig, UIConfig } from './config.context';

export const ProvideUI = memo<PropsWithChildren<UIConfig>>(({ children, ...config }) => (
  <ProvideConfig {...config}>
    <ProvideTheme isDark>
      <ProvideModalStack>
        {children}
      </ProvideModalStack>
    </ProvideTheme>
  </ProvideConfig>
));
