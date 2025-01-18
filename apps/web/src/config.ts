
import { Resource } from 'sst'

// NextJS Configuration
export const stage = Resource.App.stage

// DynamoDB Configuration
export const dynamodbTableName = Resource.DynamoDB.name
export const dynamodbConnection = {
  name: dynamodbTableName
}

// S3 Configuration
export const s3Connection = {
  bucket: Resource.Files.name,
}
