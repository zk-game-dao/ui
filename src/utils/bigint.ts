import Big from "big.js";

export const Max = (...bigints: bigint[]) =>
  bigints.reduce((a, b) => (a > b ? a : b), 0n);

export const Min = (...bigints: bigint[]) =>
  bigints.reduce(
    (a, b) => (a !== undefined && a < b ? a : b) ?? 0n,
    undefined as bigint | undefined
  ) ?? 0n;

export const BigToBigInt = <
  Param extends Big | undefined = Big | undefined,
  Return = Param extends number ? bigint : undefined,
>(
  f: Param,
  decimals: number
): Return => {
  if (f === undefined) return undefined as Return;
  if (decimals === 0) return BigInt(f.toFixed()) as Return;
  return BigInt(f.mul(Big(10).pow(decimals)).toFixed()) as Return;
};

export const BigIntToBig = <
  Param extends bigint | undefined = bigint | undefined,
  Return = Param extends bigint ? Big : undefined,
>(
  amount: Param,
  decimals: number
): Return => {
  if (amount === undefined) return undefined as Return;
  if (decimals === 0) return Big(amount.toString()) as Return;
  return Big(amount.toString()).div(Big(10).pow(decimals)) as Return;
};

export const BigIntToString = (
  amount: bigint,
  decimals: number,
  renderedDecimalPlaces = 2
) => {
  if (decimals === 0) return amount.toString();
  const beforeDot = amount.toString().slice(0, -decimals);
  const afterDot = amount
    .toString()
    .slice(-decimals)
    .padStart(decimals, "0")
    .slice(0, renderedDecimalPlaces)
    .replace(/0+$/, "");

  if (!beforeDot && !afterDot) return "0";
  if (!beforeDot) return `0.${afterDot}`;
  if (!afterDot) return beforeDot;
  return `${beforeDot}.${afterDot}`;
};
