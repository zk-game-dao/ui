import { useCallback } from "react";
import { useToast } from "../components/toast/toast-provider.context";

export const useCopyToClipboard = (url?: string) => {
  const { addToast } = useToast();

  return useCallback(() => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    addToast({ children: "Link copied" });
  }, [url]);
};
