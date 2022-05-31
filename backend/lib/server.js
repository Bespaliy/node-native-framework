'use strict';

const http = require('http');
const {
  parseBody
} = require('./common');
const {
  StorageSession
} = require('./session');

const HEADERS = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};


const types = {
  object: (data) => JSON.stringify(data),
  string: (data) => data,
  number: (data) => data.toString(),
  boolean: (data) => data.toString(),
  undefined: () => 'not found',
}

class Server {
  constructor(host, port, protocol, api) {
    this.host = host;
    this.port = port;
    this.protocol = protocol;
    this.api = api;
  }

  run() {
    const { host, port, protocol } = this;
    const proto = protocol === 'http' ? http : null;
    const server = proto.createServer(this.listener.bind(this));
    server.listen(port, host);
    console.log('Server is listen...');
  }

  async listener(req, res) {
    const { url } = req;
    const { api } = this;
    const endpoint = url.substring(1);
    console.log(endpoint, req.method);
    const method = api.get(endpoint);
    const session = new StorageSession(req);
    try {
      const data = await parseBody(req);
      const result = await method(data);
      const { userId } = result;
      if (userId) await session.reload(userId);
      res.writeHead(200, { ...HEADERS });
      res.end(JSON.stringify(result));
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = {
  Server
};