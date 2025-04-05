export class Mimetype {
  /**
   * Allowed Mimetype Zip
   * @returns
   */
  public get zip(): string[] {
    return ['application/zip', 'application/x-zip-compressed', 'application/x-7z-compressed']
  }

  /**
   * Allowed Mimetype PDF
   * @returns
   */
  public get pdf(): string[] {
    return ['application/pdf']
  }

  /**
   * Allowed Mimetype Image
   * @returns
   */
  public get image(): string[] {
    return ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
  }

  /**
   * Allowed Mimetype Spreadsheet
   * @returns
   */
  public get spreadsheet(): string[] {
    return [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]
  }

  /**
   * Allowed Mimetype Docs
   * @returns
   */
  public get docs(): string[] {
    return [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
  }

  /**
   * Default Return Mimetype
   */
  public get default(): string[] {
    const result = [...this.docs, ...this.image, ...this.pdf, ...this.spreadsheet, ...this.zip]

    return result
  }
}
