import { GetRoleTask } from 'jobs/RoleJob'

function initialJobs() {
  // Role Jobs
  GetRoleTask.start()
}

export default initialJobs
