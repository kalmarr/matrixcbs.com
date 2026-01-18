// MATRIX CBS - PM2 Ecosystem Configuration

module.exports = {
  apps: [{
    name: 'matrixcbs',
    script: 'server.js',
    cwd: '/var/www/clients/client0/web1/private/.next/standalone',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      HOSTNAME: '0.0.0.0'
    }
  }]
};
