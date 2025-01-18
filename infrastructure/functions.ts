
import { Files } from "./files"

export const TestFunction = new sst.aws.Function("TestFunction", {
  url: true,
  link: [Files],
  handler: "apps/functions/src/test.handler"
})
