import { assertEquals } from "std/testing/asserts.ts";

import { walkWholeClaimMap } from "../walk.js";

import { stubClaims } from "./util.js";

Deno.test("walk with single claim", async () => {
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
    const { claimMap: fetchedClaimMap, authenticated, errors } =
      await walkWholeClaimMap("test:claim-1");
    assertEquals(claimMap, fetchedClaimMap);
    assertEquals(errors, []);
    assertEquals(authenticated, { "test:claim-1": true });
  });
});

Deno.test("walk with nested claim", async () => {
  const claimMap = {
    "test:claim-1": {
      id: "test:claim-1",
      subject: "test:subject-1",
      authenticity: true,
      premises: ["test:claim-2", "test:claim-5"],
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
      authenticity: false,
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
    const { claimMap: fetchedClaimMap, authenticated, errors } =
      await walkWholeClaimMap("test:claim-1");
    assertEquals(claimMap, fetchedClaimMap);
    assertEquals(errors, []);
    assertEquals(authenticated, {
      "test:claim-1": false,
      "test:claim-2": false,
      "test:claim-3": false,
      "test:claim-4": true,
      "test:claim-5": true,
    });
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
    const { claimMap: fetchedClaimMap, authenticated, errors } =
      await walkWholeClaimMap("test:claim-1");
    assertEquals(claimMap, fetchedClaimMap);
    assertEquals(authenticated, {
      "test:claim-1": false,
    });
    assertEquals(errors[0].message, "Circular reference is detected");
    assertEquals(errors[0].circle, ["test:claim-1"]);
  });
});

Deno.test("detect circular reference 2", async () => {
  const claimMap = {
    "test:claim-1": {
      id: "test:claim-1",
      subject: "test:subject-1",
      authenticity: true,
      premises: ["test:claim-2", "test:claim-4"],
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
    "test:claim-4": {
      id: "test:claim-4",
      subject: "test:subject-4",
      authenticity: true,
      premises: [],
    },
  };

  const doStub = stubClaims(claimMap);

  await doStub(async () => {
    const { claimMap: fetchedClaimMap, authenticated, errors } =
      await walkWholeClaimMap("test:claim-1");
    assertEquals(claimMap, fetchedClaimMap);
    assertEquals(authenticated, {
      "test:claim-1": false,
      "test:claim-2": false,
      "test:claim-3": false,
      "test:claim-4": true,
    });
    assertEquals(errors[0].message, "Circular reference is detected");
    assertEquals(errors[0].circle, [
      "test:claim-1",
      "test:claim-2",
      "test:claim-3",
    ]);
  });
});
