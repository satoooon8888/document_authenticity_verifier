import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.209.0/testing/asserts.ts";

import { fetchClaim } from "../fetch.js";

import { stubClaims } from "./util.js";

Deno.test("fetch valid claim", async () => {
  const claimMap = {
    "test:claim-1": {
      id: "test:claim-1",
      subject: "test:subject-1",
      authenticity: true,
      premises: [],
    },
  };

  const doStub = stubClaims(claimMap);
  await doStub(async () => {
    const claim = await fetchClaim("test:claim-1");
    assertEquals(claim, claimMap["test:claim-1"]);
  });
});

Deno.test("fetch invalid claim", async () => {
  const claimMap = {
    "test:claim-1": {
      id: "test:claim-1",
      subject: { invalid: 1 },
      authenticity: true,
      premises: [],
    },
  };

  const doStub = stubClaims(claimMap);

  await doStub(async () => {
    await assertRejects(
      async () => {
        await fetchClaim("test:claim-1");
      },
      Error,
      "Claim validation failed",
    );
  });
});

Deno.test("fetch unexists claim", async () => {
  const claimMap = {};

  const doStub = stubClaims(claimMap);
  await doStub(async () => {
    await assertRejects(
      async () => {
        await fetchClaim("test:claim-unexists");
      },
      Error,
      "Claim is not found",
    );
  });
});
