export type Environment = "development" | "staging" | "production";

export let environment: Environment = "development";

if (typeof window !== "undefined") {
  if (
    window.location.origin.includes("localhost") ||
    window.location.origin.includes("127.0.0") ||
    import.meta.env.NODE_ENV === "development"
  )
    environment = "development";
  else if (window.location.origin.includes("zkpoker.app"))
    environment = "production";
  else environment = "staging";
}

export const IsDev = environment === "development";

export type EnvMap<T> = Record<Environment, T>;

export const SelectEnv = <T>(data: EnvMap<T>) => data[environment];
