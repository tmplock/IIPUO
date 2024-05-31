
'use strict';

module.exports = {
    apps: [
        {
            name: "unover-dev",
            script: "./app.js",
            instances: 1,
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: "development"
            },
        },
        {
            name: "unover-prod",
            script: "./app.js",
            instances: 1,
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: "production"
            },
            exec_mode: "fork",
            log_date_format: "YYYY-MM-DD HH:mm Z",
            out_file: "logs/out.log",
        },
    ],
};