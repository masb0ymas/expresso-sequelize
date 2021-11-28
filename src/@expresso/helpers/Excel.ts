import excelToJson from 'convert-excel-to-json'
import * as ExcelJS from 'exceljs'
import fs from 'fs'

interface OptionConvert {
  header?: any
  columnToKey?: any
}

class Excel {
  /**
   *
   * @param headers
   * @param data
   * @returns
   */
  public static async generate(
    headers: Array<Partial<ExcelJS.Column>>,
    data: any[]
  ): Promise<Buffer> {
    const workBook = new ExcelJS.stream.xlsx.WorkbookWriter({})
    const sheet = workBook.addWorksheet('My Worksheet')

    sheet.columns = headers
    for (let i = 0; i < data.length; i += 1) {
      const tempData = { no: i + 1, ...data[i] }
      sheet.addRow(tempData)
    }
    sheet.getRow(1).font = { bold: true }
    sheet.commit()

    return await new Promise((resolve, reject) => {
      workBook
        .commit()
        .then(() => {
          const { stream } = workBook as any
          const result = stream.read()
          resolve(result)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }

  /**
   *
   * @param path {string | Buffer}
   * @param options {OptionConvert} options is used when there is only 1 sheet
   * @returns
   */
  public static convertToJson(
    path: string | Buffer,
    options?: OptionConvert
  ): {
    [key: string]: any[]
  } {
    const resultConvert = excelToJson({
      source: fs.readFileSync(path), // fs.readFileSync return a Buffer
      header: options?.header || {
        rows: 1,
      },
      columnToKey: options?.columnToKey || {
        '*': '{{columnHeader}}',
      },
    })

    return resultConvert
  }
}

export default Excel
