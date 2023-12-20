import { fetchClaim } from "./fetch.js";

const walkWholeClaimMap = async (
  claimId,
) => {
  const claimMap = {};
  const authenticated = {};
  const errors = [];

  // DFS
  const stack = [[claimId, "up"], [claimId, "down"]];
  const seen = new Set();
  const finished = new Set();

  while (stack.length !== 0) {
    const [claimId, flag] = stack.pop();
    // console.table({
    //   "claimId": claimId,
    //   "flag": flag,
    // });
    // console.log("seen", seen);
    // console.log("finished", finished);
    // console.log("stack", stack);
    if (flag == "down") {
      // 行きがけの処理
      seen.add(claimId);
      const claim = await fetchClaim(claimId);
      claimMap[claimId] = claim;

      claim.premises.map((premiseId) => {
        if (finished.has(premiseId)) return;
        if (seen.has(premiseId) && !finished.has(premiseId)) {
          // Circular Reference
          errors.push({ message: "Circular reference is detected" });
          return;
        }
        stack.push([premiseId, "up"]);
        stack.push([premiseId, "down"]);
      });
    } else if (flag === "up") {
      // 帰りがけの処理
      authenticated[claimId] = claimMap[claimId].premises.every(
        (premiseId) => authenticated[premiseId],
      ) && claimMap[claimId].authenticity;

      finished.add(claimId);
    }
  }
  return { claimMap, authenticated, errors };
};

export { walkWholeClaimMap };
