import Ajv from "ajv";
import addFormats from "ajv-formats";

const { default: claimSchema } = await import("./schema/claim.schema.json", {
  assert: { type: "json" },
});

const ajv = new Ajv();
addFormats(ajv);

const validateClaim = ajv.compile(claimSchema);

export { claimSchema, validateClaim };
