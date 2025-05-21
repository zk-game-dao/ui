import { memo, PropsWithChildren } from 'react';

import { FauxLoadingBarAnimationComponent } from './faux-loading-bar-animation.component';
import { LoadingAnimationComponent } from './loading-animation.component';

export const TransferLoadingIndicatorComponent = memo<PropsWithChildren<{
  isTransferring: boolean;
  isProcessing: boolean;
}>>(({ isProcessing: isJoining, isTransferring, children }) => {
  return (
    <>
      {isTransferring && (
        <LoadingAnimationComponent>
          Waiting for transfer
        </LoadingAnimationComponent>
      )}
      {isJoining && !isTransferring && (
        <FauxLoadingBarAnimationComponent>
          {children ?? 'Processing'}...
        </FauxLoadingBarAnimationComponent>
      )}
    </>
  );
});