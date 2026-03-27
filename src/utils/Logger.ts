import path from "node:path"
import pino, { destination } from "pino"

const isDev = process.env.NODE_ENV !== "production"

const attachfolder = path.join(process.cwd(),"logs")


export const logger = pino({
  transport:{
    targets:[
      {
        target:"pino/file",
        options:{destination:path.join(attachfolder,"backend.log")}
      },
      {
        target:"pino/file",
        level:"error",
        options:{destination:path.join(attachfolder,"error.log")}
      }
    ]
  }
})

// logger.info("Logger is working 🚀")
// logger.warn("This is a warning")
// logger.error("This is an error log")