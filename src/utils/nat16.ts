export const ConvertNat16ToPerc = (nat?: number) => (nat ?? 0) / 65536;
export const ConvertPercToNat16 = (perc?: number) =>
  Math.round((perc ?? 0) * 65536);
