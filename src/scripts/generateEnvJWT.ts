const fs = require('fs')
const path = require('path')

const getUniqueCodev2 = (length = 32) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function appKey() {
  const pathRes = path.resolve('.env')
  const contentEnv = fs.readFileSync(pathRes, { encoding: 'utf-8' })
  const uniqueCode = getUniqueCodev2()
  const strJWT = `APP_KEY=${uniqueCode}`

  if (contentEnv.includes('APP_KEY=')) {
    // change APP_KEY value
    const replaceContent = contentEnv.replace(/APP_KEY=(.*)?/, strJWT)
    fs.writeFileSync(`${pathRes}`, replaceContent)
    console.log('Refresh APP_KEY Success')
  } else {
    // Generate APP_KEY value
    const extraContent = `${strJWT}\n\n${contentEnv}`
    fs.writeFileSync(`${pathRes}`, extraContent)
    console.log('Generate APP_KEY Success')
  }
}

function accessTokenJWT() {
  const pathRes = path.resolve('.env')
  const contentEnv = fs.readFileSync(pathRes, { encoding: 'utf-8' })
  const jwtSecret = getUniqueCodev2()
  const strJWT = `JWT_SECRET_ACCESS_TOKEN=${jwtSecret}`

  if (contentEnv.includes('JWT_SECRET_ACCESS_TOKEN=')) {
    // change JWT_SECRET_ACCESS_TOKEN value
    const replaceContent = contentEnv.replace(
      /JWT_SECRET_ACCESS_TOKEN=(.*)?/,
      strJWT
    )
    fs.writeFileSync(`${pathRes}`, replaceContent)
    console.log('Refresh JWT_SECRET_ACCESS_TOKEN Success')
  } else {
    // Generate JWT_SECRET_ACCESS_TOKEN value
    const extraContent = `${strJWT}\n\n${contentEnv}`
    fs.writeFileSync(`${pathRes}`, extraContent)
    console.log('Generate JWT_SECRET_ACCESS_TOKEN Success')
  }
}

function refreshTokenJWT() {
  const pathRes = path.resolve('.env')
  const contentEnv = fs.readFileSync(pathRes, { encoding: 'utf-8' })
  const jwtSecret = getUniqueCodev2()
  const strJWT = `JWT_SECRET_REFRESH_TOKEN=${jwtSecret}`

  if (contentEnv.includes('JWT_SECRET_REFRESH_TOKEN=')) {
    // change JWT_SECRET_REFRESH_TOKEN value
    const replaceContent = contentEnv.replace(
      /JWT_SECRET_REFRESH_TOKEN=(.*)?/,
      strJWT
    )
    fs.writeFileSync(`${pathRes}`, replaceContent)
    console.log('Refresh JWT_SECRET_REFRESH_TOKEN Success')
  } else {
    // Generate JWT_SECRET_REFRESH_TOKEN value
    const extraContent = `${strJWT}\n\n${contentEnv}`
    fs.writeFileSync(`${pathRes}`, extraContent)
    console.log('Generate JWT_SECRET_REFRESH_TOKEN Success')
  }
}

function secretOTP() {
  const pathRes = path.resolve('.env')
  const contentEnv = fs.readFileSync(pathRes, { encoding: 'utf-8' })
  const jwtSecret = getUniqueCodev2()
  const strJWT = `SECRET_OTP=${jwtSecret}`

  if (contentEnv.includes('SECRET_OTP=')) {
    // change SECRET_OTP value
    const replaceContent = contentEnv.replace(/SECRET_OTP=(.*)?/, strJWT)
    fs.writeFileSync(`${pathRes}`, replaceContent)
    console.log('Refresh SECRET_OTP Success')
  } else {
    // Generate SECRET_OTP value
    const extraContent = `${strJWT}\n\n${contentEnv}`
    fs.writeFileSync(`${pathRes}`, extraContent)
    console.log('Generate SECRET_OTP Success')
  }
}

appKey()
accessTokenJWT()
refreshTokenJWT()
secretOTP()
