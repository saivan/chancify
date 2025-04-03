/// <reference path="../.sst/platform/config.d.ts" />

import { ClerkPublicKey, ClerkSecretKey } from "./secrets"
import { DynamoDB } from "./dynamo"
import { Files } from "./files"


const stage = $app.stage
export const NextJS = new sst.aws.Nextjs("NextJS", {
  path: "apps/web",
  ... (stage === 'production' ? {
    domain: {
      name: "app.chancify.org",
      dns: false,
      cert: "arn:aws:acm:us-east-1:104334888055:certificate/a72c2453-04ef-4f0f-85ec-7dea1bb192b6"
    }
  } : {}),

  link: [ 
    Files, DynamoDB,
  ],
  environment: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ClerkPublicKey.value,
    CLERK_SECRET_KEY: ClerkSecretKey.value,
    APP_NAME: 'Chancify',
  },
})
