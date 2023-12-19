import { assertEquals } from "https://deno.land/std@0.65.0/testing/asserts.ts";

import { validateClaim } from "../validate.js";

Deno.test("validate valid claim", () => {
  const claim = {
    id: "test:claim-1",
    subject: "test:subject-1",
    authenticity: true,
    premises: [],
  };

  assertEquals(validateClaim(claim), true);
});

Deno.test("validate invalid claim", () => {
  const claim = {
    id: "test:claim-1",
    subject: { invalid: true },
    authenticity: true,
    premises: [],
  };

  assertEquals(validateClaim(claim), false);
});
