const handler = async (_req : Request):Promise<Response> => {
  return new Response("Server running on port 4242");
}
 
Deno.serve({port: 4243, hostname: "0.0.0.0"}, handler);