# Multer

## Config

Multer customization is not that difficult.

```js
// controllers/role/controller.ts

const uploadFile = useMulter({
  dest: 'public/uploads/excel',
  allowedExt: ['.xlsx', '.xls'],
  limit: {
    fieldSize: 10 * 1024 * 1024, // 10mb
    fileSize: 5 * 1024 * 1024, // 5mb
  },
}).fields([{ name: 'fileExcel', maxCount: 1 }])
```

The only parameters that the `useMulter()` accepts are the `dest`, `allowExt`, and the file upload `limit`.

| key             | value           | example                       |
| --------------- | --------------- | ----------------------------- |
| dest            | string          | 'public/uploads/excel'        |
| allowedExt      | Array of string | ['.xlsx', '.xls']             |
| allowedMimetype | Array of string | ['application/vnd.ms-excel']  |
| limit           | object          | { fieldSize: 9, fileSize: 9 } |

## Single Upload

Using single upload like this:

```js
// controllers/role/controller.ts

const allowExtension = ['.xlsx', '.xls']
const allowMimetype = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

// set config multer
const uploadFile = useMulter({
  dest: 'public/uploads/excel',
  allowedExt: allowExtension,
  allowedMimetype: allowMimetype,
  limit: {
    fieldSize: 10 * 1024 * 1024, // 10mb
    fileSize: 5 * 1024 * 1024, // 5mb
  },
}).fields([{ name: 'fileExcel', maxCount: 1 }])

// set file upload to request body with `setBody`
const setFileToBody = asyncHandler(async function setFileToBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // pick single field multer
  const fileExcel = req.pickSingleFieldMulter(['fileExcel'])

  req.setBody(fileExcel)
  next()
})

// set function to middleware routes
routes.post(
  '/role/import-excel',
  Authorization,
  uploadFile,
  setFileToBody,
  asyncHandler(async function importExcel(req: Request, res: Response) {
    const formData = req.getBody()

    // get field `fileExcel` from request body `getBody`
    const fieldExcel = get(formData, 'fileExcel', {})

    const data = await RoleService.importExcel(fieldExcel)

    const httpResponse = HttpResponse.created(data)
    res.status(200).json(httpResponse)
  })
)
```

## Multiple Upload

Using multiple upload like this:

```js
// controllers/role/controller.ts

const allowExtension = ['.xlsx', '.xls']
const allowMimetype = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

// set config multer
const uploadFile = useMulter({
  dest: 'public/uploads/excel',
  allowedExt: allowExtension,
  allowedMimetype: allowMimetype,
  limit: {
    fieldSize: 10 * 1024 * 1024, // 10mb
    fileSize: 5 * 1024 * 1024, // 5mb
  },
}).fields([
  { name: 'fileExcel', maxCount: 10 },
  { name: 'filePDF', maxCount: 10 },
])

// set file upload to request body with `setBody`
const setFileToBody = asyncHandler(async function setFileToBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // pick multiple field multer
  const fileExcel = req.pickMultiFieldMulter(['fileExcel'])
  const filePDF = req.pickMultiFieldMulter(['filePDF'])

  req.setBody({ ...fileExcel, ...filePDF })
  next()
})

// set function to middleware routes
routes.post(
  '/role/import-excel',
  Authorization,
  uploadFile,
  setFileToBody,
  asyncHandler(async function importExcel(req: Request, res: Response) {
    const formData = req.getBody()

    // get field `fileExcel` from request body `getBody`
    const fieldExcel = get(formData, 'fileExcel', {})
    const fieldPDF = get(formData, 'filePDF', {})

    const data = await RoleService.importExcel(fieldExcel)

    const httpResponse = HttpResponse.created(data)
    res.status(200).json(httpResponse)
  })
)
```
