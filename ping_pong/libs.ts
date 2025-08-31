import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

export const sql = new Client({
    user: "postgres",
    database: "postgres",
    hostname: "postgres-svc",
    port: 5432,
    password: Deno.env.get('POSTGRES_PASSWORD'),
  });
