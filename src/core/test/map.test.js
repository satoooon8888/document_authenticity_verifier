import { assertEquals } from "https://deno.land/std@0.209.0/testing/asserts.ts";

import { fetchWholeClaimMap } from "../map.js";

import { stubClaims } from "./util.js";

Deno.test("fetch claimMap with single claim", async () => {
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
    const { claimMap: fetchedClaimMap, errors } = await fetchWholeClaimMap(
      "test:claim-1",
    );
    assertEquals(claimMap, fetchedClaimMap);
    assertEquals(errors, []);
  });
});
