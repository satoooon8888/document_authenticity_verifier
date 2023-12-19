import Ajv from "https://esm.sh/ajv@8.12.0";
import addFormats from "https://esm.sh/ajv-formats@2.1.1";

const { default: claimSchema } = await import("../schema/claim.schema.json", {
  assert: { type: "json" },
});

const ajv = new Ajv();
addFormats(ajv);

const validateClaim = ajv.compile(claimSchema);

export { validateClaim };
