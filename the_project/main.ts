
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { render } from "./client.js";
import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

export const sql = new Client({
  user: "postgres",
  database: "postgres",
  hostname: "postgres-svc.project.svc.cluster.local",
  port: 5432,
  password: Deno.env.get('POSTGRES_PASSWORD'),
});
// create table if not exists
await sql.connect()
await sql.queryObject`
  CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, todo VARCHAR(255))
`
await sql.end()

//save todo to db
async function saveTodo(todo: string) {
  await sql.connect()
  try {
    await sql.queryObject`
      INSERT INTO todos (todo)
      VALUES (${todo})
    `;
    console.log("todo saved successfully");
  } catch (error) {
    console.error("Failed to save todo:", error);
  } finally {
    await sql.end();
  }
}

// fetch and save image every hour
import { fetchAndSaveImage } from "./utils.ts";
const basePath = "/usr/src/app/files";
const imageFilePath = `${basePath}/image.png`;
const imageSource = Deno.env.get("IMAGE_SOURCE");
const port = Deno.env.get("PORT");
if (typeof imageSource === "string") {
  fetchAndSaveImage(imageFilePath, imageSource);
  setInterval(() => fetchAndSaveImage(imageFilePath, imageSource), 1000 * 60 * 60);
} else {  
  console.error("IMAGE_SOURCE environment variable is not set.");
}

// read html content
const html = await Deno.readTextFile("./client.html");
const todos = ['Todo 1', 'Todo 2', 'Todo 3'];
const router = new Router();

// serve client.js
router.get("/client.js", async (context) => {
  context.response.type = "application/javascript";
  await context.send({
    root: "./",
    index: "client.js",
  });
});

router.get("/", (context) => {
  const document = new DOMParser().parseFromString(
    "<!DOCTYPE html>",
    "text/html",
  );
  render(document, { todos }, port ? parseInt(port) : 8081);
  context.response.type = "text/html";
  context.response.body = `${document?.body.innerHTML}${html}`;
  
});

// serve todos
router.get("/data", (context) => {
  context.response.body = todos;
});

// serve image
router.get("/image", async (context) => {
  const imageBuf = await Deno.readFile(imageFilePath);
  context.response.body = imageBuf;
  context.response.headers.set('Content-Type', 'image/png');
});

// add todo
router.post("/add", async (context) => {
  const { value } = await context.request.body({ type: "json" });
  const { item } = await value;
  await saveTodo(item);
  todos.push(item);
  context.response.status = 200;
});

// serve css
router.get("/index.css", async (context) => {
  try {
      const file = await Deno.readFile("./index.css");
      context.response.body = file;
      context.response.headers.set("Content-Type", "text/css");
  } catch (error) {
      console.error("Failed to read CSS file:", error);
      context.response.status = 500;
      context.response.body = "Internal Server Error";
  }
});
// create application
const app = new Application();

app.use(oakCors({
  origin: [`http://localhost:${port}`, `http://localhost:8000`],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// use router
app.use(router.routes());
app.use(router.allowedMethods());


await app.listen({ port : 8081 });