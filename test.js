const crypto = require('crypto');
const MSG_INVALID_SECRET = 'asdasd';

function checkIsSecretKey(key) {
    if (Buffer.isBuffer(key)) {
        return;
    }

    if (typeof key === 'string') {
        return key;
    }

    if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_SECRET);
    }

    if (typeof key !== 'object') {
        throw typeError(MSG_INVALID_SECRET);
    }

    if (key.type !== 'secret') {
        throw typeError(MSG_INVALID_SECRET);
    }

    if (typeof key.export !== 'function') {
        throw typeError(MSG_INVALID_SECRET);
    }
}

function fromBase64(base64) {
    return base64
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function normalizeInput(thing) {
    // if (!bufferOrString(thing))
    //     thing = JSON.stringify(thing);
    return thing;
}

function createHmacSigner(bits) {
    return function sign(thing, secret) {
        checkIsSecretKey(secret);
        thing = normalizeInput(thing);
        var hmac = crypto.createHmac('sha' + bits, secret);
        var sig = (hmac.update(thing), hmac.digest('base64'))
        return fromBase64(sig);
    }
}

console.log(createHmacSigner(256)(JSON.stringify({
    "email": "asdasdwww@ds",
    "id": 6,
    "roles": [
      {
        "id": 1,
        "value": "ADMIN",
        "description": "Administarator",
        "createdAt": "2022-05-24T13:57:08.322Z",
        "updatedAt": "2022-05-24T13:57:08.322Z"
      }
    ],
    "iat": 1653471813,
    "exp": 1653558213
  }), 'asdsdfsdfdsfdsfsdfasd'));