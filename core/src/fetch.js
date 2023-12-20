import { validateClaim } from "./validate.js";

const fetchClaim = async (url) => {
  const response = await fetch(url);
  if (response.status === 404) {
    throw Error("Claim is not found");
  }
  const claim = await response.json();
  if (!validateClaim(claim)) {
    throw Error("Got an invalid claim");
  }
  return claim;
};

export { fetchClaim };
