import { fetchClaim } from "./fetch.js";

const buildFullyExpandedClaim = async (
  claim,
  parentClaimIdSet = new Set(),
) => {
  console.log(claim, parentClaimIdSet);
  if (claim.premises.length == 0) return claim;

  parentClaimIdSet.add(claim.id);

  const expandedPremises = await Promise.all(
    claim.premises.map(async (premiseUrl) => {
      if (parentClaimIdSet.has(premiseUrl)) {
        throw Error("Circular reference is detected");
      }
      const premiseClaim = await fetchClaim(premiseUrl);
      const expandedPremiseClaim = await buildFullyExpandedClaim(
        premiseClaim,
        parentClaimIdSet,
      );
      return expandedPremiseClaim;
    }),
  );

  parentClaimIdSet.delete(claim.id);

  return { ...claim, premises: expandedPremises };
};

export { buildFullyExpandedClaim };
