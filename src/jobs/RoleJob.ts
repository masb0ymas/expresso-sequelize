import RoleService from 'controllers/Role/service'
import cron from 'node-cron'
import ConstRoles from 'constants/ConstRoles'

class RoleJob {
  /**
   * Get Role Task
   */
  public static getRole() {
    // Run this job every 30 minutes
    const task = cron.schedule('30 * * * *', async () => {
      const data = await RoleService.getOne(ConstRoles.ID_UMUM)
      console.log('Running task check get role by id', { data })
    })

    return task
  }
}

export default RoleJob
