import React, { memo } from "react";
import { useRouteError } from "react-router-dom";

// import { useRouting } from "@/src/hooks/routing";

import { NavbarComponent } from "../navbar/navbar.component";
import { ButtonComponent } from "../button/button.component";
import { ErrorComponent } from "../error/error.component";

export const ErrorBoundaryComponent = memo(() => {
  const error = useRouteError();
  // const { getHref } = useRouting();

  return (
    <div>
      <NavbarComponent hideUser />
      <div className="m-auto container gap-4 flex flex-col">
        <ErrorComponent error={error} />

        {/* <ButtonComponent
          variant="naked"
          color="purple"
          onClick={() => (window.location.href = getHref("/lobby"))}
        >
          Return to lobby
        </ButtonComponent> */}
      </div>
    </div>
  );
});
