export interface FileAttributes {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

export interface FileInstance {
  [key: string]: FileAttributes
}
