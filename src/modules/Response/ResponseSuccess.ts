class ResponseSuccess {
  /**
   * Response Success
   */
  public static get(message?: string, code?: Number) {
    return {
      code: code || 200,
      message: message || 'data has been received!',
    }
  }

  /**
   * Response Create
   */
  public static created(message?: string, code?: Number) {
    return {
      code: code || 201,
      message: message || 'data has been added!',
    }
  }

  /**
   * Response Update
   */
  public static updated(message?: string, code?: Number) {
    return {
      code: code || 200,
      message: message || 'the data has been updated!',
    }
  }

  /**
   * Response Delete
   */
  public static deleted(message?: string, code?: Number) {
    return {
      code: code || 200,
      message: message || 'data has been deleted!',
    }
  }
}

export default ResponseSuccess
