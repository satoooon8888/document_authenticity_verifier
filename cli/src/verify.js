import { walkWholeClaimMap } from "../../core/src/mod.js";

import { showClaim } from "./show.js";

const verify = async (url) => {
  const { claimMap, authenticated, errors } = await walkWholeClaimMap(url);
  Object.entries(claimMap).map(([id, claim]) => {
    showClaim(claim);
  });
  errors.map((error) => {
    console.log(`[Error] ${JSON.stringify(error)}`);
  });
  Object.entries(authenticated)
    .filter(([id, v]) => v === false)
    .map(([id, v]) => {
      if (claimMap[id].authenticity) {
        console.log(`[Warning] ${id} has unauthenticated claim.`);
      } else {
        console.log(`[Warning] ${id} is not authenticated by owner.`);
      }
    });
  if (authenticated[url]) {
    console.log(`[*] ${url} is verified.`);
  } else {
    console.log(`[*] failed to verify ${url}`);
  }
};

export { verify };
