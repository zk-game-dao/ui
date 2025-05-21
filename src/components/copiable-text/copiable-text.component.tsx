import { memo, useCallback } from 'react';

import Interactable from '../interactable.component';
import { useToast } from '../toast/toast-provider.context';

export const CopiableTextComponent = memo<{ text: string }>(({ text }) => {
  const { addToast } = useToast();

  const copy = useCallback(() => {
    navigator.clipboard.writeText(text);
    addToast({ children: "Copied" });
  }, [text]);

  return (
    <div className="flex flex-row w-full group relative">
      <input
        type="text"
        value={text}
        readOnly
        className="h-full w-full bg-transparent text-material-placeholder "
      />
      <Interactable
        onClick={copy}
        className="group-hover:opacity-100 opacity-0 absolute right-0 active:scale-95 type-button-2"
      >
        Copy
      </Interactable>
    </div>
  );
});
