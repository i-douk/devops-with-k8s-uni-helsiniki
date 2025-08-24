const logDir = "/usr/src/app/files";
const filePath = `${logDir}/logs.txt`;

const pings = await fetch(`http://pingpong-svc:2347`).then(res => res.text());

const handler = async (_req: Request): Promise<Response> => {
const file = await Deno.open(filePath);
  try {
    const body = await Deno.readFile(filePath);
    const bodyText = new TextDecoder().decode(body);
    return new Response(bodyText + "\n" + pings, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return new Response("Error reading file", { status: 500 });
  } finally {
    file.close();
  }
};

Deno.serve({ port: 4242 }, handler);