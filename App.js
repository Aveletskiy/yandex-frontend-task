const log4js = require('log4js');

const Application = require('../base/App');

// components
const WrapController = require('server/components/WrapController');
const ResponseSenderService = require('server/response/ResponseSenderService');
const ResponseSenderWorker = require('server/response/ResponseSenderWorker');
const TrackManager = require('server/components/TrackManager');
const ApiUserManager = require('server/components/ApiUserManager');

//database
const DbProvider = require('server/components/db/DbProvider');

// server
const WebServer = require('server/components/WebServer');
const WebServerMiddlewares = require('server/components/WebServerMiddlewares');

// middlewares
const apiMode = require('server/middlewares/apiMode');
const apiAuth = require('server/middlewares/apiAuth');

// controllers
const IndexController = require('server/controllers/IndexController');
const ApiController = require('server/controllers/ApiController');
const DocsController = require('server/controllers/DocsController');

// routes
const indexRoute = require('server/routes/index');
const apiRoute = require('server/routes/api');
const docsRoute = require('server/routes/docs');

// websockets
const trackingHandler = require('server/websockets/handlers/tracking');
const TrackingController = require('server/websockets/controllers/TrackingController');

class App extends Application {
    constructor(config) {
        super(config);
    }

    run() {
        try {
            this.bootstrap();
            this.initServer();
            this.onAppInit();
            this.logger.info('App initialized');
        } catch (e) {
            this.logger.error('An error occurred while starting the app', e);
            this.stopApp();
        }
    }

    initServer() {
        this.core.webServerMiddlewares.init();
        this.core.webServer.start();
        this.runRouting();
        this.core.webServerMiddlewares.initErrorPages();
        this.initSocketHandlers();
    }

    runRouting() {
        this.core.routes.$list().map(name => {
            try {
                this.core.routes[name];
            } catch (e) {
                this.logger.error('Error while executing routing', name, e);
            }
        });
    }

    initSocketHandlers() {
        this.core.websocket.handlers.$list().map(name => {
            try {
                this.core.websocket.handlers[name];
            } catch (e) {
                this.logger.error('Error while initializing websocket event handler', name, e);
            }
        });
    }

    stopApp() {
        this.core.webServer.stop();
        process.exit(0);
    }

    getWorkerName() {
        if (process.env.id) {
            return `worker ${process.env.id}`;
        }

        return 'worker';
    }

    get components() {
        log4js.configure({
            appenders: { [this.getWorkerName()]: { type: 'console'} },
            categories: { default: { appenders: [this.getWorkerName()], level: this.config.logger.level } }
        });
        const logger = log4js.getLogger(this.getWorkerName());

        this.logger = logger;
        return {
            'config': {
                module: this.config,
                type: App.componentConstant
            },
            'logger': {
                module: logger,
                type: App.componentConstant
            },
            'dbProvider': {
                module: DbProvider,
                dependencies: [
                    'logger', 'config.db'
                ],
                type: App.componentService
            },
            'webServer': {
                module: WebServer,
                dependencies: [
                    'config.webServer', 'logger'
                ],
                type: App.componentService
            },
            'webServerMiddlewares': {
                module: WebServerMiddlewares,
                dependencies: [
                    'logger', 'config', 'webServer'
                ],
                type: App.componentService
            },
            'wrapController': {
                module: WrapController,
                dependencies: [
                    'logger', 'responseSender'
                ],
                type: App.componentService
            },
            'responseSender': {
                module: ResponseSenderService,
                dependencies: [
                    'logger', 'responseSenderWorker'
                ],
                type: App.componentService
            },
            'responseSenderWorker': {
                module: ResponseSenderWorker,
                dependencies: [
                    'logger'
                ],
                type: App.componentFactory
            },
            'trackManager': {
                module: TrackManager,
                dependencies: [
                    'logger', 'dbProvider', 'config.tracking'
                ],
                type: App.componentService
            },
            'apiUserManager': {
                module: ApiUserManager,
                dependencies: [
                    'logger', 'dbProvider'
                ],
                type: App.componentService
            },
            'middlewares': {
                'apiMode': {
                    module: apiMode,
                    type: App.componentService
                },
                'apiAuth': {
                    module: apiAuth,
                    dependencies: [
                        'logger', 'config.api', 'apiUserManager'
                    ],
                    type: App.componentService
                }
            },
            'controllers': {
                'index': {
                    module: IndexController,
                    dependencies: [
                        'logger', 'bitcoinClient', 'eventsManager'
                    ],
                    type: App.componentService
                },
                'api': {
                    module: ApiController,
                    dependencies: [
                        'logger', 'config.api', 'apiUserManager', 'trackManager'
                    ],
                    type: App.componentService
                },
                'docs': {
                    module: DocsController,
                    dependencies: [
                        'logger'
                    ],
                    type: App.componentService
                }
            },
            'routes': {
                'index': {
                    module: indexRoute,
                    dependencies: [
                        'webServer', 'wrapController', 'controllers.index', 'middlewares'
                    ],
                    type: App.componentService
                },
                'api': {
                    module: apiRoute,
                    dependencies: [
                        'webServer', 'wrapController', 'controllers.api', 'middlewares'
                    ],
                    type: App.componentService
                },
                'docs': {
                    module: docsRoute,
                    dependencies: [
                        'webServer', 'wrapController', 'controllers.docs'
                    ],
                    type: App.componentService
                },
            },
            'websocket': {
                'handlers': {
                    'tracking': {
                        module: trackingHandler,
                        dependencies: [
                            'webServer', 'websocket.controllers.tracking'
                        ],
                        type: App.componentService
                    }
                },
                'controllers': {
                    'tracking': {
                        module: TrackingController,
                        dependencies: [
                            'logger', 'trackManager'
                        ],
                        type: App.componentService
                    }
                }
            }
        }
    }
}

module.exports = App;