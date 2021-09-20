import fs from 'fs'
import path from 'path'

const getUniqueCodev2 = (length = 32): string => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function generateEnv(value: string, regExp: RegExp): void {
  const pathRes = path.resolve('.env')
  const contentEnv = fs.readFileSync(pathRes, { encoding: 'utf-8' })
  const uniqueCode = getUniqueCodev2()
  const strJWT = `${value}=${uniqueCode}`

  console.log({ pathRes, strJWT })

  if (contentEnv.includes(`${value}=`)) {
    // change value
    const replaceContent = contentEnv.replace(regExp, strJWT)
    fs.writeFileSync(`${pathRes}`, replaceContent)
    console.log(`Refresh ${value} Success`)
  } else {
    // Generate value
    const extraContent = `${strJWT}\n\n${contentEnv}`
    fs.writeFileSync(`${pathRes}`, extraContent)
    console.log(`Generate ${value} Success`)
  }
}

function appKey(): void {
  return generateEnv('APP_KEY', /APP_KEY=(.*)?/)
}

function secretOTP(): void {
  return generateEnv('SECRET_OTP', /SECRET_OTP=(.*)?/)
}

function secretAccessToken(): void {
  return generateEnv('JWT_SECRET_ACCESS_TOKEN', /JWT_SECRET_ACCESS_TOKEN=(.*)?/)
}

function secretRefreshToken(): void {
  return generateEnv(
    'JWT_SECRET_REFRESH_TOKEN',
    /JWT_SECRET_REFRESH_TOKEN=(.*)?/
  )
}

appKey()
secretOTP()
secretAccessToken()
secretRefreshToken()
