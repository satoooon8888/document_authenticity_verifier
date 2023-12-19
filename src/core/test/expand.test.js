import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.209.0/testing/asserts.ts";

import { stub } from "https://deno.land/std@0.209.0/testing/mock.ts";

import { buildFullyExpandedClaim } from "../expand.js";

Deno.test("expand single claim", async () => {
  const claim = {
    id: "test:claim-1",
    subject: "test:subject-1",
    authenticity: true,
    premises: [],
  };

  const expandedClaim = await buildFullyExpandedClaim(claim);

  assertEquals(expandedClaim, claim);
});

Deno.test("expand nested claim", async () => {
  const claimMap = {
    "test:claim-1": {
      id: "test:claim-1",
      subject: "test:subject-1",
      authenticity: true,
      premises: ["test:claim-2"],
    },
    "test:claim-2": {
      id: "test:claim-2",
      subject: "test:subject-2",
      authenticity: true,
      premises: [],
    },
  };

  const fetchStub = stub(globalThis, "fetch", async (url) => {
    return new Response(JSON.stringify(claimMap[url]));
  });

  const expectdClaim = {
    id: "test:claim-1",
    subject: "test:subject-1",
    authenticity: true,
    premises: [claimMap["test:claim-2"]],
  };

  try {
    const expandedClaim = await buildFullyExpandedClaim(
      claimMap["test:claim-1"],
    );
    assertEquals(expandedClaim, expectdClaim);
  } finally {
    fetchStub.restore();
  }
});
