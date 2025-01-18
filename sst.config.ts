/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "chancify",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {} 
      }
    };
  },

  async run() {
    // Import the resources
    const { Files } = await import("./infrastructure/files")
    const { NextJS } = await import("./infrastructure/nextjs")
    const { DynamoDB } = await import("./infrastructure/dynamo")
    await import("./infrastructure/functions")
    const secrets = await import("./infrastructure/secrets")

    // Export them to be used in the application
    return { Files, NextJS, DynamoDB, ...secrets }
  },
})
