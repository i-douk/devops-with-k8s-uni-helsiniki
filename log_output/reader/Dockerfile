FROM denoland/deno:2.1.7

# The port that your application listens to.
EXPOSE 4242

WORKDIR /app

# Prefer not to run as root.
USER root

# These steps will be re-run upon each file change in your working directory:
COPY . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

CMD ["run", "--allow-net" , "--allow-read", "--allow-env", "main.ts"]