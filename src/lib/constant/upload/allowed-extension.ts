// extension
export const allowed_zip = ['.zip', '.7z']
export const allowed_pdf = ['.pdf']
export const allowed_image = ['.png', '.jpg', '.jpeg', '.svg', '.webp']
export const allowed_excel = ['.xlsx', '.xls']
export const allowed_doc = ['.doc', '.docx']

// default allowed ext
export const default_allowed_ext = [
  ...allowed_zip,
  ...allowed_pdf,
  ...allowed_image,
  ...allowed_excel,
  ...allowed_doc,
]
