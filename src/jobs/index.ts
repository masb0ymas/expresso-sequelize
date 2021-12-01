import UploadJob from './UploadJob'

function initialJobs(): void {
  // Upload Job
  const uploadTask = UploadJob.getTask()
  uploadTask.start()
}

export default initialJobs
