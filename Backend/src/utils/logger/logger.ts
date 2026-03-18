import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

const transport = isProduction
  ? undefined
  : pino.transport({
      targets: [
        // 👇 Console (same as before)
        {
          target: "pino-pretty",
          level: "debug",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },

        // 👇 Daily rotating backend logs
        {
          target: "pino-roll",
          level: "debug",
          options: {
            file: "./logs/backend.log",
            frequency: "daily",  
             dateFormat: "yyyy-MM-dd",
            size: "10m",          
            limit: {
              count: 14,          
            },
          },
        },

        // 👇 Daily rotating error logs
        {
          target: "pino-roll",
          level: "error",
          options: {
            file: "./logs/error.log",
            frequency: "daily",
             dateFormat: "yyyy-MM-dd",
            size: "10m",
            limit: {
              count: 14,
            },
          },
        },
      ],
    });

const logger = pino(
  {
    level: isProduction ? "info" : "debug",
  },
  transport
);

export default logger;