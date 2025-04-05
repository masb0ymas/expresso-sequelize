import SessionJob from './session'
import UploadJob from './upload'

export default class Job {
  static initialize() {
    this._sessionJob()
    this._uploadJob()
  }

  private static _sessionJob() {
    const task = SessionJob.removeSession()
    task.start()
  }

  private static _uploadJob() {
    const task = UploadJob.updateSignedUrl()
    task.start()
  }
}
