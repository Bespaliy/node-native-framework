'use strict';
const { Server } = require('./backend/lib/server');
const createApi = require('./backend/lib/context');
const { DataBase } = require('./backend/lib/database');
const secure = require('./backend/lib/security')
const config = require('./backend/config/database');

const db = new DataBase(config);

const context = { console, db, secure };

createApi(context, 'api').then(api => {
    new Server('localhost', 8000, 'http', api).run();
});