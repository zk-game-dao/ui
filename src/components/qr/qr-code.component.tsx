import QRCode from "qrcode";
import { memo, useMemo } from "react";

import { Principal } from "@dfinity/principal";
import { useQuery } from "@tanstack/react-query";

import { ErrorComponent } from "../error/error.component";
import { LoadingSpinnerComponent } from "../loading-animation/loading-spinner.component";
import { AnimatePresence } from "framer-motion";
import classNames from "classnames";

export const QRCodeComponent = memo<{
  className?: string;
  value?: string;
}>(({ value, className }) => {

  const { data, isPending, error } = useQuery({
    queryKey: ["qr", value ?? "unknown"],
    queryFn: () =>
      new Promise<string>((resolve, reject) => {
        if (!value) return reject("No value to encode");
        QRCode.toDataURL(value, (err, url) => {
          if (err) return reject(err);
          resolve(url);
        });
      }),
    enabled: !!value,
  });

  if (!value) return null;

  return (
    <>
      <AnimatePresence>
        <ErrorComponent error={error} />
      </AnimatePresence>
      <div
        className={classNames(
          "relative bg-white flex justify-center items-center overflow-hidden rounded-[12px]",
          className,
        )}
      >
        <AnimatePresence>
          {isPending && (
            <LoadingSpinnerComponent className="absolute inset-0" />
          )}
        </AnimatePresence>
        {data && <img src={data} alt="QR Code" />}
      </div>
    </>
  );
});
