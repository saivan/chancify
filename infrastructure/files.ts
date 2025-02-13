/// <reference path="../.sst/platform/config.d.ts" />

export const Files = new sst.aws.Bucket("Files", {
  access: 'cloudfront',
})
