import * as Sentry from "@sentry/node";

const isProduction =  process.env.NODE_ENV === "production";

export const initSentry = () => {
  if (!isProduction) {
    console.log("🟡 Sentry disabled in development");
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  });

  console.log("🟢 Sentry initialized");
};

export { Sentry };