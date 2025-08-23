import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { send } from "jsr:@oak/oak/send";
import { fetchAndSaveImage } from "./utils.ts";

const basePath = "/usr/src/app/files";
const imageFileName = "image.png";
const imageFilePath = `${basePath}/${imageFileName}`;

fetchAndSaveImage(imageFilePath);
setInterval(() => fetchAndSaveImage(imageFilePath), 1000 * 60 * 60);

const todos = ["do something", "do something else", "do something more"];

const router = new Router();

// Serve HTML
router.get("/", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Todos!</title></head>
      <body>
        <h1>Todos App</h1>
        <img src="/files/${imageFileName}" alt="Photo" />
        <input type="text" maxLength="140" id="todo" placeholder="Add a todo" />
        <button id="addTodo">Add</button>
        <ul>
          ${todos.map((todo) => `<li>${todo}</li>`).join("")}
        </ul>
      </body>
      <footer>
        <p> Devops with Kubernetes - Last updated: ${new Date().toISOString()}</p>
      </footer>
    </html>`;
});

// Serve static files under /files
router.get("/files/:path+", async (ctx) => {
  await send(ctx, ctx.params.path, {
    root: basePath,
  });
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 3000, host: "0.0.0.0" });
