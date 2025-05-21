import { IsDev } from "./env";

export const IC_HOST = IsDev ? "http://127.0.0.1:4943/" : "https://ic0.app";
