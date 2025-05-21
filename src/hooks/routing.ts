import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const useRouting = () => {
  const navigate = useNavigate();
  // const navigate = useCallback((path: string) => {
  //   // push history
  //   window.history.pushState({}, "", path);
  // }, []);

  const getHref = useCallback((path: string) => path, []);
  const push = useCallback((path: string) => navigate(getHref(path)), []);

  return { push, getHref };
};
