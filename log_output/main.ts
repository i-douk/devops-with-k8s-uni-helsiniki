import * as uuid from "jsr:@std/uuid";

const randomString = uuid.v1.generate();

const generateLogs = () => {
  setInterval(async () => {
    const logEntry = new Date().toISOString() + ": " + randomString + "\n";
      console.log(logEntry)
  }, 5000);
};

generateLogs();