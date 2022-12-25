import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

/**
 *
 * @param length
 * @returns
 */
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

/**
 *
 * @param value
 * @param regExp
 */
function generateEnv(value: string, regExp: RegExp): void {
  const pathRes = path.resolve('.env')

  if (!fs.existsSync(pathRes)) {
    const errType = chalk.red('Missing env!!!')
    throw new Error(
      `${errType}\nCopy / Duplicate ${chalk.cyan(
        '.env.example'
      )} root directory to ${chalk.cyan('.env')}`
    )
  }

  const contentEnv = fs.readFileSync(pathRes, { encoding: 'utf-8' })
  const uniqueCode = getUniqueCodev2()
  const valueEnv = `${value}=${uniqueCode}`

  if (contentEnv.includes(`${value}=`)) {
    // change value
    const replaceContent = contentEnv.replace(regExp, valueEnv)
    fs.writeFileSync(`${pathRes}`, replaceContent)
    console.log(`Refresh ${chalk.cyan(valueEnv)} Success`)
  } else {
    // Generate value
    const extraContent = `${valueEnv}\n\n${contentEnv}`
    fs.writeFileSync(`${pathRes}`, extraContent)
    console.log(`Generate ${chalk.cyan(valueEnv)} Success`)
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
