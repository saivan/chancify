import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getMimeType } from "@repo/utilities";


export * from './api'
type SignedMethods = 'get' | 'put'
type SignedUrlParameters = {
  method?: SignedMethods
  expiration?: number
}


export type BucketConnection = {
  name: string
  region?: string
  endpoint?: string
  credentials?: {
    accessKeyId: string
    secretAccessKey: string
  }
}


export class Files {

  _connection?: BucketConnection | undefined
  _s3Client?: S3Client | undefined

  constructor(inputs: {
    connection?: BucketConnection
    bucket?: string
  }) {
    if (inputs.connection) this.connection(inputs.connection)
    if (inputs.bucket) this.connection({ name: inputs.bucket })
  }

  connection(): BucketConnection | undefined
  connection(details: BucketConnection): this
  connection(details?: BucketConnection): this | BucketConnection | undefined {
    if (details == null) return this._connection
    this._connection = details
    return this
  }

  signedUrl(key: string, options: SignedUrlParameters): Promise<string>
  signedUrl(key: string, method?: SignedMethods): Promise<string>
  async signedUrl(
    key: string,
    o: SignedMethods | SignedUrlParameters = 'get'
  ) {
    const {
      method = 'get', expiration = 3600,
    } = typeof o === 'string' ? { method: o } : o
    const { Bucket, S3Client } = this._getConnector()
    const command = method === 'get'
      ? new GetObjectCommand({ Bucket, Key: key })
      : new PutObjectCommand({ Bucket, Key: key })
    const url = await getSignedUrl(S3Client, command, { expiresIn: expiration })
    return url
  }

  async list({
    prefix = '',
  }: {
    prefix?: string
  }) {
    const { Bucket, S3Client } = this._getConnector()
    const command = new ListObjectsCommand({ Bucket, Prefix: prefix })
    const response = await S3Client.send(command)
    if (response.Contents == null) return []
    const items = response.Contents.map((content) => {
      if (content.Key == null) {
        throw new Error(`S3 returned an object without a key`)
      }
      return {
        key: content.Key,
        type: getMimeType(content.Key),
        size: content.Size,
        lastModified: content.LastModified,
        filename: content.Key?.split('/').pop(),
      }
    })
    return items
  }

  async delete(key: string) {
    const { S3Client, Bucket } = this._getConnector()
    const command = new DeleteObjectCommand({ Bucket, Key: key })
    await S3Client.send(command)
    return true
  }

  _getConnector() {
    // Make sure there is a connection
    if (this._connection == null) throw new Error(`No connection details provided`)

    // If we have a cached entity, return it
    if (this._s3Client) return {
      S3Client: this._s3Client,
      Bucket: this._connection.name,
    }

    // For a direct link, we don't need to consider the connection
    const isDirectLink = this._connection?.endpoint == null
      || this._connection?.region == null
      || this._connection?.credentials == null
    if (isDirectLink) {
      this._s3Client = new S3Client()
      return {
        S3Client: this._s3Client,
        Bucket: this._connection.name,
      }
    }

    // Create the S3 client
    this._s3Client = new S3Client({
      region: this._connection?.region,
      endpoint: this._connection?.endpoint,
      credentials: {
        accessKeyId: this._connection?.credentials?.accessKeyId as string,
        secretAccessKey: this._connection?.credentials?.secretAccessKey as string,
      },
      forcePathStyle: true,
    })
    return {
      S3Client: this._s3Client,
      Bucket: this._connection.name,
    }
  }
}
