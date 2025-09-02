let pingpong = 0;
import { sql } from "./libs.ts";

// create table if not exists
await sql.connect()
await sql.queryObject`
  CREATE TABLE IF NOT EXISTS pings (ping INT)
`
await sql.end()

//connect to db and save
async function savePing(ping: string) {
  await sql.connect()
  try {
    await sql.queryObject`
      INSERT INTO pings (ping)
      VALUES (${ping})
    `;
    console.log("ping saved successfully");
  } catch (error) {
    console.error("Failed to save ping:", error);
  } finally {
    await sql.end();
  }
}

Deno.serve({ port: 2347, hostname: "0.0.0.0" }, (req) => {
  if (new URL(req.url).pathname === "/") {
    return new Response("OK", { status: 200 });
  }
  if (new URL(req.url).pathname === "/ping") {
    pingpong++;
    savePing(String(pingpong));
    return new Response("Ping:" + String(pingpong));
  }
  return new Response("Not Found", { status: 404 });
});