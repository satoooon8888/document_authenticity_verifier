#!/usr/bin/env -S deno run --allow-net

import { show } from "./show.js";
import { verify } from "./verify.js";

const showUsage = () => {
  console.log(`Usage: docauth show <url>`);
  console.log(`       docauth verify <url>`);
};

const cli = async (args) => {
  if (!args[0]) {
    console.log("Error: command required");
    showUsage();
    process.exit(1);
  }

  const command = args[0];

  switch (command) {
    case "show":
      if (!args[1]) {
        console.log("Error: url required");
        showUsage();
        process.exit(1);
      }
      await show(args[1]);
      break;
    case "verify":
      if (!args[1]) {
        console.log("Error: url required");
        showUsage();
        process.exit(1);
      }
      await verify(args[1]);
      break;
    default:
      break;
  }
};

await cli(Deno.args);
