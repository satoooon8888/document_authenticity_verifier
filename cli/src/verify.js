import { walkWholeClaimMap } from "../../core/src/mod.js";

const verify = async (url) => {
  const { claimMap, authenticated, errors } = await walkWholeClaimMap(url);
  console.log(claimMap);
  errors.map((error) => {
    console.log(`[Error] ${error}`);
  });
  Object.entries(authenticated)
    .filter(([id, v]) => v === false)
    .map(([id, v]) => {
      console.log(`[Warning] ${id} is not authenticated!`);
    });
  if (authenticated[url]) {
    console.log(`[*] ${url} is authenticated.`);
  } else {
    console.log(`[*] ${url} has unauthenticated claim!`);
  }
};
