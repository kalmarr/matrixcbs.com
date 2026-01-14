// MATRIX CBS - PM2 Ecosystem Configuration

module.exports = {
  apps: [{
    name: 'matrixcbs',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/clients/client0/web1/private',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    // Logok a PM2 alapértelmezett helyre (~/.pm2/logs/)
    // error_file és out_file törölve - root által létrehozott logs mappa jogosultsági problémája miatt
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
