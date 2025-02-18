
import {
  DynamoDBClient,
  CreateTableCommand,
  CreateTableCommandInput,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb'
import dynamoSchema from './dynamo.schema.json'
import { TableConnection } from '../src'


const dynamoTableDescription = {
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  },
}
export const connection: TableConnection = {
  name: 'testing',
  ...dynamoTableDescription,
}

// Get clients to interact with the database
const dynamodbClient = new DynamoDBClient(dynamoTableDescription)

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
    console.log("Make sure you're running local-stack with `docker-compose up`")
    console.error(`Interaction with dynamodb failed`, error)
  }
}

