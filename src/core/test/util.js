import { stub } from "https://deno.land/std@0.209.0/testing/mock.ts";

const stubClaims = (claimMap) => {
  const callback = async (testAsyncFn) => {
    const fetchStub = stub(globalThis, "fetch", (url) => {
      if (!claimMap.hasOwnProperty(url)) {
        return Promise.resolve(new Response("Not Found", { status: 404 }));
      }
      return Promise.resolve(new Response(JSON.stringify(claimMap[url])));
    });
    try {
      await testAsyncFn();
    } finally {
      fetchStub.restore();
    }
  };
  return callback;
};

export { stubClaims };
