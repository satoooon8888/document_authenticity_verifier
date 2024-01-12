import { Hono } from "hono/mod.ts";

import * as path from "std/path/mod.ts";
import * as fs from "std/fs/mod.ts";

const PORT = Deno.env.get("PORT") ?? "8000";

const app = new Hono();

app.get("/claim/:claimId", async (c) => {
  const claimId = c.req.param("claimId");
  const claimPath = path.join("claim", claimId);

  if (!fs.existsSync(claimPath)) {
    return c.notFound();
  }

  const claim = JSON.parse(Deno.readTextFileSync(claimPath));
  claim.id = new URL(`/claim/${claimId}`, c.req.url);
  claim.premises = claim.premises.map((premiseId) =>
    new URL(`/claim/${premiseId}`, c.req.url)
  );
  c.header("Access-Control-Allow-Origin", "*");
  return c.json(claim);
});

app.get("/", (c) => {
  const template = Deno.readTextFileSync("./index.html");
  return c.html(template);
});

Deno.serve(app.fetch, { port: PORT });
