import RoleService from 'controllers/Role/service'
import cron from 'node-cron'
import ConstRoles from 'constants/ConstRoles'

// Run this job every 30 minutes
const GetRoleTask = cron.schedule('30 * * * *', async () => {
  const data = await RoleService.getOne(ConstRoles.ID_UMUM)
  console.log('Running task check get role by id', { data })
})

export { GetRoleTask }
