import fs from 'fs'
import jwt, {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from 'jsonwebtoken'

const { JWT_SECRET }: any = process.env

// Generate Unique Code ( default length 32 )
function getUniqueCodev2(length = 32) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// Get Token from headers
function getToken(headers: any) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    }
    return null
  }
  return null
}

// Verify Token
function verifyToken(header: any) {
  const token = getToken(header)

  try {
    if (!token) {
      return { data: null, message: 'Token not found!' }
    }

    const data = jwt.verify(token, JWT_SECRET)
    return { data, message: 'Token is verify' }
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return { data: null, message: `Token ${err.message}` }
    }

    if (err instanceof JsonWebTokenError) {
      return { data: null, message: `Token ${err.message}` }
    }

    if (err instanceof NotBeforeError) {
      return { data: null, message: `Token ${err.message}` }
    }
  }
}

// Read HTML File
function readHTMLFile(path: any, callback: any) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      callback(err)
    } else {
      callback(null, html)
    }
  })
}

export { getUniqueCodev2, getToken, verifyToken, readHTMLFile }
