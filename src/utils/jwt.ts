import jwt from 'jsonwebtoken'

//làm hàm nhận vào payload, privateKey, options từ đó ký tên

export const signtoken = ({
  payload,
  privateKey = process.env.JWT_SECTET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey?: string
  options: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) throw reject(err)
      resolve(token as string)
    })
  })
}
