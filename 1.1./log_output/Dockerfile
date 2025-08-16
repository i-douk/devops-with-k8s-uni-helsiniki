FROM denoland/deno:2.1.7

WORKDIR /app

USER root

COPY . .

RUN deno cache main.ts

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "main.ts"]