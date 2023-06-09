import chalk from 'chalk'
import { printLog, randomString } from 'expresso-core'
import fs from 'fs'
import path from 'path'

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

  const uniqueCode = randomString.generate()
  const valueEnv = `${value}=${uniqueCode}`

  if (contentEnv.includes(`${value}=`)) {
    // change value
    const replaceContent = contentEnv.replace(regExp, valueEnv)
    fs.writeFileSync(`${pathRes}`, replaceContent)

    const logMessage = printLog(`Refresh ${value}`, `= ${uniqueCode}`)
    console.log(logMessage)
  } else {
    // Generate value
    const extraContent = `${valueEnv}\n\n${contentEnv}`
    fs.writeFileSync(`${pathRes}`, extraContent)

    const logMessage = printLog(`Generate ${value}`, `= ${uniqueCode}`)
    console.log(logMessage)
  }
}

// generate app key
generateEnv('APP_KEY', /APP_KEY=(.*)?/)

// generate secret otp
generateEnv('SECRET_OTP', /SECRET_OTP=(.*)?/)

// generate jwt secret access token
generateEnv('JWT_SECRET_ACCESS_TOKEN', /JWT_SECRET_ACCESS_TOKEN=(.*)?/)

// generate jwt secret refresh token
generateEnv('JWT_SECRET_REFRESH_TOKEN', /JWT_SECRET_REFRESH_TOKEN=(.*)?/)
