FROM denoland/deno:1.39.2
EXPOSE 8000

WORKDIR /app

USER deno

COPY deno.json .
COPY deno.lock .
COPY deps.js .
RUN deno cache deps.js

COPY . .

CMD ["run", "--allow-net=0.0.0.0:8000", "--allow-read=src/", "src/index.js"]
