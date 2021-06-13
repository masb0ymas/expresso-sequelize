module.exports = {
  apps: [
    {
      name: 'api_expresso',
      script: './dist/bin/server.js',
      instances: 'max', // max instance = 0 | max
      exec_mode: 'cluster',
      watch: '.', // default: watch = true
      env: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
