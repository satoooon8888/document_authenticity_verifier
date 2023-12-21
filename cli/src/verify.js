import { walkWholeClaimMap } from "../../core/src/mod.js";

const verify = async (url) => {
  const { claimMap, authenticated, errors } = await walkWholeClaimMap(url);
  if (authenticated) {
    console.log(`${url} is authenticated`);
  } else {
    console.log(`${url} has unauthenticated claim!`);
  }
};
