import { fetchClaim } from "./fetch.js";

const fetchWholeClaimMap = async (
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
    console.log(claimId, flag, stack, seen, finished);
    if (flag == "down") {
      // 行きがけ
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
      // 帰りがけ
      finished.add(claimId);
    }
  }
  return { claimMap: claimMap, errors: errors };
};

export { fetchWholeClaimMap };
