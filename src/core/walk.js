import { fetchClaim } from "./fetch.js";

const walkWholeClaimMap = async (
  claimId,
) => {
  const claimMap = {};
  const errors = [];

  // DFS
  const stack = [[claimId, "down"]];
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
      claimMap[claimId].soundness = claim.premises.every((premiseId) =>
        claimMap[premiseId].authenticity
      );

      finished.add(claimId);
    }
  }
  return { claimMap: claimMap, errors: errors };
};

export { walkWholeClaimMap; };
