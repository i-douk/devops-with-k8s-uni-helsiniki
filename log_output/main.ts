import * as uuid from "jsr:@std/uuid";

const randomString = uuid.v1.generate();
const generateLogs = () => {
  const logEntry =  randomString + "\n";
  setInterval(async () => {
      console.log(new Date().toISOString() + ": " + logEntry)
    }, 5000);
  return new Date().toISOString() + ": " + logEntry
  
};

generateLogs()

Deno.serve( { port : 4242} , (_req) => {
  return new Response( generateLogs() )
})