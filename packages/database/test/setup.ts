
import {
  DynamoDBClient,
  CreateTableCommand,
  CreateTableCommandInput,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb'
import dynamoSchema from './dynamo.schema.json'


// Get clients to interact with the database
const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  },
})

export async function initialise() {
  async function checkTableExists(tableName: string) {
    try {
      await dynamodbClient.send(new DescribeTableCommand({ TableName: tableName }))
      return true
    } catch (error: any) {
      if (error.name === 'ResourceNotFoundException') return false
      throw error
    }
  }

  async function createTable(params: CreateTableCommandInput) {
    try {
      const createTable = new CreateTableCommand(params)
      await dynamodbClient.send(createTable)
    } catch (error) {
      console.error('Error creating table:', error)
    }
  }

  try {
    const tableExists = await checkTableExists(dynamoSchema.TableName)
    if (!tableExists) await createTable(dynamoSchema as CreateTableCommandInput)
  } catch (error) {
    console.error(`Interaction with dynamodb failed`, error)
  }
}

// Setup dynamodb
import { beforeAll } from "vitest"
beforeAll(async () => {
  await initialise()
})
