const http  = require('http')
const https = require('https')

export const fetchData = <T = any>(url: string,type: 'http' | 'https' = 'http'): Promise<T> => {
    const fetcher = url.startsWith('https://')
        ? https
        : http
    return new Promise((resolve, reject) => {
      fetcher.get(
        url,
        (res: any) => {
          res.setEncoding('utf8')
          let rawData = ''
          res.on('data', (chunk: any) => { rawData += chunk })
          res.on('end', () => {
            try {
              const parsedData = JSON.parse(rawData)
              resolve(parsedData)
            } catch (e) {
              console.error(e.message)
              reject(e)
            }
          })
        }
      ).on('error', (e: any) => {
        // console.error(`Got error: ${e.message}`);
        reject(e)
      })
    })
  }
