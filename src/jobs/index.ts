import ExampleJob from './ExampleJob'

function initialJobs(): void {
  // Example Jobs
  const exampleTask = ExampleJob.getTask()
  exampleTask.start()
}

export default initialJobs
