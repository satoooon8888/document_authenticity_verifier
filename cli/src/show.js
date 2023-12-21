import { fetchClaim } from "../../core/src/mod.js";

const show = async (url) => {
  const claim = await fetchClaim(url);
  console.table({
    id: claim.id,
    subject: claim.subject,
    authenticity: claim.authenticity,
    ...Object.fromEntries(
      claim.premises.length
        ? claim.premises.map((premise, i) => [`Premise[${i}]`, premise])
        : [["Premise", []]],
    ),
  });
};

export { show };
