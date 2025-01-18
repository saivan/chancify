
import { fileServerFactory } from '@repo/files'
import { s3Connection } from '@/config'

const { DELETE, GET } = fileServerFactory(s3Connection)
export { DELETE, GET }
