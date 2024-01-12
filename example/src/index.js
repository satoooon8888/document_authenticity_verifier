import { Hono } from "../deps.js";

import { fs, path } from "../deps.js";

const PORT = "8000";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const template = Deno.readTextFileSync(path.join(__dirname, "./index.html"));

const app = new Hono();

app.get("/claim/:claimId", async (c) => {
  const claimId = c.req.param("claimId");
  const claimPath = path.join(__dirname, "claim", claimId);

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
  return c.html(template);
});

Deno.serve(app.fetch, { port: PORT });
