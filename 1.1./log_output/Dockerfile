FROM denoland/deno:2.1.7

WORKDIR /app

USER deno

COPY . .

RUN deno cache --lock-write main.ts

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "main.ts"]