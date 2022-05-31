'use strict';

const crypto = require('crypto');
const { uid } = require('uid');

const parseBody = async (req) => {
    const buffer = [];
    for await (const chunk of req) buffer.push(chunk);
    const data = Buffer.concat(buffer).toString();
    return JSON.parse(data);
}

const hash = len => {
    const sessId = uid(len);
    const str = JSON.stringify(sessId, function (key, val) {
        return val
    });

    return crypto.createHash('sha1')
        .update(str, 'utf8')
        .digest('hex');
}

const parseCookie = (cookie) => {
    const value = {};
    const items = cookie.split(';');
    for (const item of items) {
        const parts = item.split('=');
        const key = parts[0].trim();
        const val = parts[1] || '';
        value[key] = val.trim();
    }
    return value;
};

const sendCookie = (name, data) => {
    const cookie = `${name}=${data}; Path=/; HttpOnly;`;
    return cookie;
}

module.exports = { parseBody, hash, parseCookie, sendCookie };