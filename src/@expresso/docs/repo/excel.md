# Excel

## Import Excel

I am using the `convert-excel-to-json` package to import excel. So I first made the excel data into json, after the data is converted to json I can process it first before saving it to the database.

Excel upload function like this:

```javascript
// controllers/role/controller.ts

// set config multer
const uploadFile = useMulter({
  dest: 'public/uploads/excel',
  allowedExt: ['.xlsx', '.xls'],
}).fields([{ name: 'fileExcel', maxCount: 1 }])

// set file upload to request body with `setBody`
const setFileToBody = asyncHandler(async function setFileToBody(
  req: Request,
  res,
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
    const buildResponse = BuildResponse.created(data)

    return res.status(200).json(buildResponse)
  })
)
```

Handle service convert to json

```javascript
// controllers/role/service.ts

public static async importExcel(fieldFiles: FileAttributes) {
  const excelJson = Excel.convertToJson(fieldFiles.path)

  return excelJson
}
```

Helpers convert to json


```javascript
// helpers/Excel.ts

public static convertToJson(path: string | Buffer, options?: OptionConvert) {
  const resultConvert = excelToJson({
    source: fs.readFileSync(path), // fs.readFileSync return a Buffer
    header: options?.header || {
      rows: 1,
    },
    columnToKey: options?.columnToKey || {
      '*': '{{columnHeader}}', // can read all excel sheet and data
    },
  })

  return resultConvert
}
```

## Export Excel

I am using the `exceljs` package to export excel. The data that is processed from the database will be made into excel.

Endpoint export excel like this:

```javascript
// controllers/role/controller.ts

routes.get(
  '/role/generate-excel',
  Authorization,
  asyncHandler(async function generateExcelEvent(req: Request, res: Response) {
    const streamExcel = await RoleService.generateExcel(req)
    const dateNow = formatDateGenerateFile(new Date())
    const filename = `${dateNow}_generate_role.xlsx`

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    res.setHeader('Content-Length', streamExcel.length)

    return res.send(streamExcel)
  })
)
```

Handle service generate excel

```javascript
// controllers/role/service.ts

public static async generateExcel(req: Request) {
  const { data } = await this.getAll(req)

  // transform data from sequelize to json,
  const roleData = JSON.parse(JSON.stringify(data))

  const header = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Name', key: 'name', width: 20 },
    // example custom key
    // { header: 'Role', key: 'roleName', width: 20 },
  ]

  const newData = []
  for (let i = 0; i < roleData.length; i += 1) {
    const item = roleData[i]
    newData.push({
      ...item,
      // example custom data with get lodash
      // roleName: get(item, 'Role.name', '-')
    })
  }

  // set stream data
  const stream: Buffer = await Excel.generate(header, newData)

  return stream
}
```
