'use strict';

const config = require('./config/app');
const Application = require('./App');

(new Application(config)).run();