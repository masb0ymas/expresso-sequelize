export function generateOTP() {
  // which stores all digits
  const digits = '0123456789'
  let OTP = ''

  for (let i = 0; i < 6; i += 1) {
    OTP += digits[Math.floor(Math.random() * 10)]
  }

  return OTP
}
