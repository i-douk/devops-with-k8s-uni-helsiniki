
let pingpong = 0;

Deno.serve( { port : 4243} , (_req) => {
  pingpong++
  return new Response( "Ping:" + String(pingpong) )
})