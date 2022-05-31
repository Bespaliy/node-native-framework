'use strict';

const { DataBase } = require('./database');
const { parseCookie, sendCookie, hash } = require('./common');
const config = require('../config/database');

const db = new DataBase(config);

const HASH_LENGTH = 24;

const sessions = new Map();

class StorageSession {

    constructor(req) {
        this.ip = req.socket.remoteAddress;
        this.session = null;
    }

    init(token, data) {
        this.session = new Session(token, data);
    }

    async start(userId) {
        const token = hash(HASH_LENGTH);
        this.init(token);
        const { ip, session, res } = this;
        const data = JSON.stringify(session.data);
        sessions.set(token, session);
        await db.insert('Session', { userId, token, ip, data });
        return session;
    }

    async save(session) {
        const token = session.token;
        const data = session.data;
        await db.update('Session', { data }, { token });
    }

    // static restore(cookie) {
    //     const { token } = parseCookie(cookie);
    //     let session = sessions.get(token);
    //     if (!session) {
    //         const data = await db.select('Session', ['data'], { token });
    //         session = new Session(token, data);
    //         sessions.set(token, session);
    //     }
    //     if (!session) return null;
    //     return session;
    // }

    async reload(userId) {
        const { res } = this;
        let sess = await db.select('Session', ['token', 'data'], { userId });
        if (!sess) sess = await this.start(userId);
        const { token, data } = sess;
        const session = new Session(token, data);
        sessions.set(token, session);
        console.log(sessions);
        return session;
    }
}

class Session {
    constructor(token, data = { token }) {
        this.token = token;
        this.data = data;
    }

    getData(key) {
        return this.data[key];
    }

    setData(key, value) {
        this.data[key] = value;
    }

}

module.exports = { StorageSession };