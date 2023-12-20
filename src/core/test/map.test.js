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

Deno.test("fetch claimMap with nested claim", async () => {
  const claimMap = {
    "test:claim-1": {
      id: "test:claim-1",
      subject: "test:subject-1",
      authenticity: true,
      premises: ["test:claim-2", "test:claim-3", "test:claim-5"],
    },
    "test:claim-2": {
      id: "test:claim-2",
      subject: "test:subject-2",
      authenticity: true,
      premises: ["test:claim-3", "test:claim-4"],
    },
    "test:claim-3": {
      id: "test:claim-3",
      subject: "test:subject-3",
      authenticity: true,
      premises: ["test:claim-5", "test:claim-4"],
    },
    "test:claim-4": {
      id: "test:claim-4",
      subject: "test:subject-4",
      authenticity: true,
      premises: ["test:claim-5"],
    },
    "test:claim-5": {
      id: "test:claim-5",
      subject: "test:subject-5",
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

Deno.test("detect circular reference", async () => {
  const claimMap = {
    "test:claim-1": {
      id: "test:claim-1",
      subject: "test:subject-1",
      authenticity: true,
      premises: ["test:claim-1"],
    },
  };

  const doStub = stubClaims(claimMap);

  await doStub(async () => {
    const { claimMap: fetchedClaimMap, errors } = await fetchWholeClaimMap(
      "test:claim-1",
    );
    assertEquals(claimMap, fetchedClaimMap);
    assertEquals(errors, [{ "message": "Circular reference is detected" }]);
  });
});

Deno.test("detect circular reference 2", async () => {
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
      premises: ["test:claim-3"],
    },
    "test:claim-3": {
      id: "test:claim-3",
      subject: "test:subject-3",
      authenticity: true,
      premises: ["test:claim-1"],
    },
  };

  const doStub = stubClaims(claimMap);

  await doStub(async () => {
    const { claimMap: fetchedClaimMap, errors } = await fetchWholeClaimMap(
      "test:claim-1",
    );
    assertEquals(claimMap, fetchedClaimMap);
    assertEquals(errors, [{ "message": "Circular reference is detected" }]);
  });
});

Deno.test("detect circular reference 2", async () => {
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
      premises: ["test:claim-3"],
    },
    "test:claim-3": {
      id: "test:claim-3",
      subject: "test:subject-3",
      authenticity: true,
      premises: ["test:claim-1"],
    },
  };

  const doStub = stubClaims(claimMap);

  await doStub(async () => {
    const { claimMap: fetchedClaimMap, errors } = await fetchWholeClaimMap(
      "test:claim-1",
    );
    assertEquals(claimMap, fetchedClaimMap);
    assertEquals(errors, [{ "message": "Circular reference is detected" }]);
  });
});
