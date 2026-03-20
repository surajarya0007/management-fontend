const DEFAULT_ORIGIN = "management-backend-ivory.vercel.app";

const origin = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_ORIGIN).replace(
  /\/$/,
  "",
);

export const API_ORIGIN = origin;
export const API_BASE = `${origin}/api`;
