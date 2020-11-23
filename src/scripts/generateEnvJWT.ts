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

function accessTokenJWT() {
  const pathRes = path.resolve('.env')
  const contentEnv = fs.readFileSync(pathRes, { encoding: 'utf-8' })
  const jwtSecret = getUniqueCodev2()
  const strJWT = `JWT_SECRET_ACCESS_TOKEN=${jwtSecret}`

  if (contentEnv.includes('JWT_SECRET_ACCESS_TOKEN=')) {
    // Replace JWT SECRET jika sudah ada
    const replaceContent = contentEnv.replace(
      /JWT_SECRET_ACCESS_TOKEN=(.*)?/,
      strJWT
    )
    fs.writeFileSync(`${pathRes}`, replaceContent)
    console.log('Refresh JWT SECRET Success')
  } else {
    // Generate JWT SECRET kalo belum ada di environment
    const extraContent = `${strJWT}\n\n${contentEnv}`
    fs.writeFileSync(`${pathRes}`, extraContent)
    console.log('Generate JWT SECRET Success')
  }
}

function refreshTokenJWT() {
  const pathRes = path.resolve('.env')
  const contentEnv = fs.readFileSync(pathRes, { encoding: 'utf-8' })
  const jwtSecret = getUniqueCodev2()
  const strJWT = `JWT_SECRET_REFRESH_TOKEN=${jwtSecret}`

  if (contentEnv.includes('JWT_SECRET_REFRESH_TOKEN=')) {
    // Replace JWT SECRET REFRESH TOKEN jika sudah ada
    const replaceContent = contentEnv.replace(
      /JWT_SECRET_REFRESH_TOKEN=(.*)?/,
      strJWT
    )
    fs.writeFileSync(`${pathRes}`, replaceContent)
    console.log('Refresh JWT SECRET REFRESH TOKEN Success')
  } else {
    // Generate JWT SECRET REFRESH TOKEN kalo belum ada di environment
    const extraContent = `${strJWT}\n\n${contentEnv}`
    fs.writeFileSync(`${pathRes}`, extraContent)
    console.log('Generate JWT SECRET REFRESH TOKEN Success')
  }
}

accessTokenJWT()
refreshTokenJWT()
