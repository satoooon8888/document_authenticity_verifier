FROM denoland/deno:1.39.2
EXPOSE 8000

WORKDIR /app

USER deno

COPY deno.json .
COPY deno.lock .
COPY deps.js .
RUN deno cache deps.js

COPY . .

CMD ["task", "start"]
