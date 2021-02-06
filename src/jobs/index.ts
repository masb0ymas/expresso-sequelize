import RoleJob from 'jobs/RoleJob'

function initialJobs() {
  // Role Jobs
  const getRoleTask = RoleJob.getRole()
  getRoleTask.start()

  // Other Jobs
}

export default initialJobs
