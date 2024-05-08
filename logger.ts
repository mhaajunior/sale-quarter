import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const transportInfo: DailyRotateFile = new DailyRotateFile({
  dirname: "/var/log/retail/",
  filename: "info-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const errorInfo: DailyRotateFile = new DailyRotateFile({
  level: "error",
  dirname: "/var/log/retail/",
  filename: "error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const logger = createLogger({
  level: "info",
  transports: [transportInfo, errorInfo],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

export { logger };
