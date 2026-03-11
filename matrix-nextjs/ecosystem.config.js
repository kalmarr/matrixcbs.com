// MATRIX CBS - PM2 Ecosystem Configuration
// FONTOS: web1 (contabo-matrixcbs) userrel kell indítani, NEM kalmarr-ral!
// A wrapper script (start-matrixcbs.sh) figyeli a next-server worker process-t,
// így a PM2 autorestart tényleg csak akkor triggerel, ha a szerver leállt.

module.exports = {
  apps: [{
    name: 'matrixcbs',
    script: '/var/www/clients/client0/web1/private/scripts/start-matrixcbs.sh',
    interpreter: '/bin/bash',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    kill_timeout: 15000,
    treekill: true,
    max_restarts: 0,
    min_uptime: '30s',
    restart_delay: 10000,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      HOSTNAME: '0.0.0.0'
    }
  }]
};
