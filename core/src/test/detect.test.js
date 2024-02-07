import { assertEquals, assertThrows } from "std/testing/asserts.ts";

import { detectClaimIdFromHtml, detectClaimIdFromUrl } from "../detect.js";

Deno.test("detect claimId ", () => {
  const html = `
  <html>
    <head>
      <meta name="claim" content="test:claim">
    </head>
    <body>
      OK
    </body>
  </html>
  `

  const claimId = detectClaimIdFromHtml(html);
  assertEquals(claimId, "test:claim");
});

Deno.test("detect no claimId ", () => {
  const html = `
  <html>
    <head>
    </head>
    <body>
      OK
    </body>
  </html>
  `

  assertThrows(
    () => {
      detectClaimIdFromHtml(html);
    },
    Error,
    "No claims detected",
  );
});


