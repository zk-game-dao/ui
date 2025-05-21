import { ReactNode, memo } from "react";
import { Modal } from "./modal";
import { LoadingAnimationComponent } from "../loading-animation/loading-animation.component";

export const LoadingModal = memo<{ children?: ReactNode }>(({ children }) => (
  <Modal>
    <LoadingAnimationComponent className="mb-8">
      {children}
    </LoadingAnimationComponent>
  </Modal>
));
