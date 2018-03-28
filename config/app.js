const _ = require('lodash');
const path = require('path');
const process = require('process');

module.exports = {
    logger: {
        level: process.env.APP_LOG_LEVEL
    },
    db: {
        connection: process.env.DB_CONNECTION,
        pool: process.env.DB_POOL_SIZE,
        debug: !!Number(process.env.DB_DEBUG)
    },
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        pass: process.env.REDIS_PASS
    },
    webServer: {
        port: process.env.WEBSERVER_PORT,
        cookieSecretKey: process.env.COOKIE_SECRET,
        sessionSecretKey: process.env.SESSION_SECRET,
        viewsDirectory: path.join(process.cwd(), 'src/server/views'),
        publicDirectories: {
            '/': path.join(process.cwd(), 'app/site/public')
        },
        nunjucks: {
            watch: !!Number(process.env.NUNJUCKS_WATCH),
            noCache: !!Number(process.env.NUNJUCKS_NOCACHE)
        }
    },
    tracking: {
        min_session_length: process.env.MIN_USER_SESSION_LENGTH
    },
    api: {
        secret: process.env.API_JWT_SECRET,
        passwordSalt: process.env.API_PASSWORD_SALT
    }
};