import { Resource } from "sst"
import { type Handler } from "aws-lambda"
import { friendlyId } from "@repo/utilities/server"


export const handler: Handler = async (_event) => {
  return {
    statusCode: 200,
    body: `${friendlyId()} Linked to ${Resource.Files.name}`,
  };
};
