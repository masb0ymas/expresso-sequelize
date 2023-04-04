import { UploadJob } from './upload.job'

export class Jobs {
  public static initialize(): void {
    // upload task
    this._uploadTask()
  }

  /**
   * Upload Task
   */
  private static _uploadTask(): void {
    const getTask = UploadJob.getTask()
    getTask.start()
  }
}
