import { validateClaim } from "./validate.js";

const fetchClaim = async (url) => {
  const claim = await fetch(url).then((r) => r.json());
  if (!validateClaim(claim)) {
    throw Error("Got an invalid claim");
  }
  return claim;
};

export { fetchClaim };
