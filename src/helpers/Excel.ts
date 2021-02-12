import fs from 'fs'
import * as ExcelJS from 'exceljs'
import excelToJson from 'convert-excel-to-json'

interface OptionConvert {
  header?: any
  columnToKey?: any
}

class Excel {
  /**
   *
   * @param headers
   * @param data
   */
  public static async generate(
    headers: Partial<ExcelJS.Column>[],
    data: any[]
  ): Promise<Buffer> {
    const workBook = new ExcelJS.stream.xlsx.WorkbookWriter({})
    const sheet = workBook.addWorksheet('My Worksheet')

    // @ts-ignore
    sheet.columns = headers
    for (let i = 0; i < data.length; i += 1) {
      const tempData = { no: i + 1, ...data[i] }
      sheet.addRow(tempData)
    }
    sheet.getRow(1).font = { bold: true }
    sheet.commit()

    return new Promise((resolve, reject) => {
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
   * @param path
   * @param options
   * options is used when there is only 1 sheet
   */
  public static convertToJson(path: string | Buffer, options?: OptionConvert) {
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
