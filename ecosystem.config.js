module.exports = {
  apps: [
    {
      name: 'api_express_ts',
      script: 'npm run serve:production',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      exec_mode: 'fork',
      instances: 1,
      autorestart: false,
      watch: false,
      max_memory_restart: '1G',
    },
  ],

  // deploy : {
  //  production : {
  //    user : 'SSH_USERNAME',
  //    host : 'SSH_HOSTMACHINE',
  //    ref  : 'origin/master',
  //    repo : 'GIT_REPOSITORY',
  //    path : 'DESTINATION_PATH',
  //    'pre-deploy-local': '',
  //    'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //    'pre-setup': ''
  //  }
  // }
}
