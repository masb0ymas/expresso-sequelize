import { UploadJob } from './upload.job'

export class Jobs {
  /**
   * Initialize Jobs
   */
  public static initialize(): void {
    // run upload task
    this._uploadTask()
  }

  /**
   * Upload Task
   */
  private static _uploadTask(): void {
    // Upload Job
    const getTask = UploadJob.getTask()
    getTask.start()
  }
}
