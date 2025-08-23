const logDir = "/usr/src/app/files";
const filePath = `${logDir}/logs.txt`;
let pingpong = 0;

Deno.serve( { port : 4243} , (_req) => {
  pingpong++
  const pingEntry = `Ping / Pong : ${pingpong}\n`;
  Deno.writeTextFileSync(filePath, pingEntry, { append: true });
  return new Response( "Ping:" + String(pingpong) )
})