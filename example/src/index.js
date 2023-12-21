import { Hono } from "https://deno.land/x/hono/mod.ts";

import * as path from "https://deno.land/std/path/mod.ts";

const PORT = Deno.env.get("PORT") ?? "8000";

const app = new Hono();

app.get("/claim/:claimId", (c) => {
  const claimId = c.req.param("claimId");
  const claim = JSON.parse(Deno.readTextFileSync(path.join("claim", claimId)));
  claim.id = new URL(`/claim/${claimId}`, c.req.url);
  claim.premises = claim.premises.map((premiseId) =>
    new URL(`/claim/${premiseId}`, c.req.url)
  );
  return c.json(claim);
});

app.get("/", (c) => {
  const template = Deno.readTextFileSync("./index.html");
  return c.html(template);
});

Deno.serve(app.fetch, { port: PORT });
