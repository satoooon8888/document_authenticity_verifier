import { validateClaim } from "./validate.js";

const fetchClaim = async (url) => {
  const response = await fetch(url);
  if (response.status === 404) {
    throw Error("Claim is not found");
  }
  const claim = await response.json();
  if (!validateClaim(claim)) {
    const err = new Error(`Claim validation failed`);
    err.reasons = validateClaim.errors;
    console.log("ValidationError: ", validateClaim.errors);
    throw err;
  }
  return claim;
};

export { fetchClaim };
