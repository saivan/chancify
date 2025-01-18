
import { expect, describe, it } from 'vitest'
import { lookup } from 'mime-types'
import * as client from '@repo/files/client'
import * as server from '@repo/files/server'
import { shortId } from '@repo/utilities';




describe('File', () => {
  describe ('server', () => {
    describe('signedUrl', () => {

      it(`returns a signed url that we can upload to`, async () => {
        // Get a signed URL from the server
        const id = shortId()
        const filename = `test-${id}.txt`
        const url = await server.Files.signedUrl(filename, 'put')

        // Upload a file to the signed URL via the client
        const { file } = createRandomFile(filename, 64)

        // Upload the file to test that it works
        const request = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          }
        })
        expect(request.ok).toBe(true)
        expect(request.status).toBe(200)
      })

      it(`honors the expiration time on put`, async () => {
        // Get a signed URL from the server
        const id = shortId()
        const filename = `test-${id}.txt`
        const url = await server.Files.signedUrl(filename, {
          expiration: 0.1, method: 'put',
        })

        // Wait to invalidate the signed URL
        await sleep(500)

        // Upload a file to the signed URL via the client
        const { file } = createRandomFile(filename, 64)
        const request = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          }
        })
        expect(request.ok).toBe(false)
        expect(request.status).toBe(500)
      })

      it(`allows a file to be overwritten`, async () => {
        // Upload a file
        const id = shortId()
        const filename = `test-${id}.txt`
        await uploadFile(filename)

        // Get a signed URL from the server
        const url = await server.Files.signedUrl(filename, 'put')
        const newFilename = `test-${id}-new.txt`  
        const { file, contents } = createRandomFile(newFilename, 256)

        // Upload the file to the signed URL again
        const request = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          }
        }) 
        expect(request.ok).toBe(true)
        expect(request.status).toBe(200)

        // Download the file to make sure it was uploaded
        const downloadUrl = await server.Files.signedUrl(filename)
        const response = await fetch(downloadUrl)
        const downloadedContents = await response.text()
        expect(downloadedContents).toBe(contents)
      })

      it(`returns a signed url that we can download from`, async () => {
        // Upload a file to the server
        const id = shortId()
        const filename = `test-${id}.txt`
        const uploaded = await uploadFile(filename)

        // Get a signed URL from the server for this file
        const url = await server.Files.signedUrl(filename)
        const response = await fetch(url)
        const downloadedFile = await response.blob()
        const downloadedText = await downloadedFile.text()

        // Compare the files
        expect(uploaded.file.size).toBe(downloadedFile.size)
        expect(uploaded.file.type).toBe(downloadedFile.type)
        expect(uploaded.contents).toBe(downloadedText)
      })

      it(`honors the expiration time on get`, async () => {
        // Upload a file to the server
        const id = shortId()
        const filename = `test-${id}.txt`
        await uploadFile(filename)

        // Get a signed URL from the server for this file
        const url = await server.Files.signedUrl(filename, { expiration: 0.1 })
        await sleep(500)
        const response = await fetch(url)
        expect(response.ok).toBe(false)
        expect(response.status).toBe(500)
      })
    })

    describe('list', () => {
      it(`lists file names that match a prefix`, async () => {
        // Create a list of files to test
        const prefix = `/test-list-${shortId()}/`
        const filenames = new Array(5)
          .fill(0)
          .map(() => `${prefix}test-${shortId()}.txt`)

        // Create the files
        const size = 32
        for (let filename of filenames) {
          await uploadFile(filename, { size })
        }

        // Make sure the files are listed
        const files = await server.Files.list({ prefix }) 
        for (let filename of filenames) {
          const item = files.find((item) => item.key === filename)
          expect(item).toBeDefined()
        }
      })

      it(`returns an empty list if nothing is found`, async () => {
        // Make sure the files are listed
        const prefix = `/test-list-${shortId()}/`
        const files = await server.Files.list({ prefix }) 
        expect(files).toEqual([])
      })
    })

    describe('delete', () => {
      it(`deletes a file from the server`, async () => {
        // Upload a file to the server
        const id = shortId()
        const filename = `test-${id}.txt`
        await uploadFile(filename)

        // Make sure the file is uploaded
        const downloadUrl = await server.Files.signedUrl(filename)
        const firstResult = await fetch(downloadUrl)
        expect(firstResult.ok).toBe(true)

        // Delete the file from the server
        const deleted = await server.Files.delete(filename)
        expect(deleted).toBe(true)

        // Make sure the file is deleted
        const deletedResult = await fetch(downloadUrl)
        expect(deletedResult.ok).toBe(false)
      })
    })
  })

  describe ('client', () => {
    describe('put', () => {
     
      it(`uploads a file to the server`, async () => {
        // Make a file to upload
        const filename = `test-${shortId()}.txt`
        const { file } = createRandomFile(filename, 64)

        // Upload the file to test that it works
        const success = await client.Files.put(filename, file)
        expect(success).toBe(true)
      })
  
    })

    describe('get', () => {

      it(`returns plain text for a text file`, async () => {
        // Make the file
        const key = `test-${shortId()}.txt`
        const { file, contents } = createRandomFile(key, 64)

        // Upload and download the file again
        await client.Files.put(key, file)
        const { data } = await client.Files.get(key)
        expect(data).toBe(contents)
      })

      it(`returns a blob for a binary file`, async () => {
        // Make the file
        const key = `test-${shortId()}.bin`
        const { file } = createRandomFile(key, 64)

        // Upload and download the file again
        await client.Files.put(key, file)
        const { data } = await client.Files.get(key)
        expect(data instanceof Blob).toBe(true)
      })

      it(`returns a JSON object for a JSON file`, async () => {
        // Make the file
        const key = `test-${shortId()}.json`
        const contents = { test: shortId() }
        const file = new File([
          JSON.stringify(contents)
        ], key, { type: 'application/json' })

        // Upload and download the file again
        await client.Files.put(key, file)
        const { data } = await client.Files.get(key)
        expect(data).toEqual(contents)
      })

      it(`returns no data if the file doesn't exist`, async () => {
        const key = `test-${shortId()}.txt`
        const { data, response } = await client.Files.get(key)
        expect(data).toBeUndefined()
        expect(response.ok).toBe(false)
      })

    })
  
    describe('list', () => {
      it(`returns a list of files that match a pattern`, async () => {
        // Make the file names for upload
        const prefix = `/test-list-${shortId()}/`
        const filenames = new Array(5).fill(0)
          .map(() => `${prefix}test-${shortId()}.txt`)
          .sort() // S3 returns in alphabetical order
        
        // Upload the files
        const contentPromises = filenames.map(async (filename) => {
          const { file, contents } = createRandomFile(filename, 32)
          await client.Files.put(filename, file)
          return contents
        })
        const contents = await Promise.all(contentPromises)

        // Download each file and compare the contents
        const files = await client.Files.list(prefix)
        for (let [i, file] of files.entries()) {
          const { data } = await client.Files.get(file.key)
          expect(data).toBe(contents[i])
        }
      })
    })

    describe(`delete`, () => {
      it(`deletes a file from the server`, async () => {
        // Upload a file to the server and make sure we can download it
        const filename = `test-${shortId()}.txt`
        const { file, contents } = createRandomFile(filename, 64)
        await client.Files.put(filename, file)
        const { data } = await client.Files.get(filename)
        expect(data).toBe(contents)

        // Delete the file from the server
        await client.Files.delete(filename)

        // Make sure we can't download the file anymore
        const deleted = await client.Files.get(filename)
        expect(deleted.data).toBeUndefined()
        expect(deleted.response.ok).toBe(false)
      })
    })
  })
})


function createRandomFile(filename: string, fileSize: number) {
  const times = Math.ceil(fileSize / filename.length)
  const contents = filename.repeat(times);
  const type = lookup(filename) || 'text/plain'
  const blob = new Blob([contents], { type });
  const file = new File([blob], filename, { type });
  return { file, contents }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function uploadFile (filename: string, { size = 64 } = {}) {
  // Get a signed URL from the server and make a file to upload
  const url = await server.Files.signedUrl(filename, 'put')
  const { file, contents } = createRandomFile(filename, size)

  // Upload the file to test that it works
  const request = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    }
  })
  return { file, contents }
}