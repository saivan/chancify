/// <reference path="../.sst/platform/config.d.ts" />

import { ClerkPublicKey, ClerkSecretKey } from "./secrets"
import { DynamoDB } from "./dynamo"
import { Files } from "./files"

export const NextJS = new sst.aws.Nextjs("NextJS", {
  path: "apps/web",

  link: [ 
    Files, DynamoDB,
  ],
  environment: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ClerkPublicKey.value,
    CLERK_SECRET_KEY: ClerkSecretKey.value,
    APP_NAME: 'Chancify',
  },
})
