import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.209.0/testing/asserts.ts";

import { stub } from "https://deno.land/std@0.209.0/testing/mock.ts";

import { fetchClaim } from "../fetch.js";

Deno.test("fetch valid claim", async () => {
  const claimMap = {
    "test:claim-1": {
      subject: "test:subject-1",
      authenticity: true,
      premises: [],
    },
  };

  const fetchStub = stub(globalThis, "fetch", async (url) => {
    return new Response(JSON.stringify(claimMap[url]));
  });

  try {
    const claim = await fetchClaim("test:claim-1");
    assertEquals(claim, claimMap["test:claim-1"]);
  } finally {
    fetchStub.restore();
  }
});

Deno.test("fetch invalid claim", async () => {
  const claimMap = {
    "test:claim-1": {
      subject: { invalid: 1 },
      authenticity: true,
      premises: [],
    },
  };

  const fetchStub = stub(globalThis, "fetch", async (url) => {
    return new Response(JSON.stringify(claimMap[url]));
  });

  await assertRejects(
    async () => {
      await fetchClaim("test:claim-1");
    },
    Error,
    "Got an invalid claim",
  );

  fetchStub.restore();
});
