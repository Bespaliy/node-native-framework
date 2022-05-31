'use strict';

const vm = require('vm');
const fs = require('fs').promises;
const path = require('path');

const createApi = async (context, dirApi) => {
    let api = new Map();
    const dir = await fs.readdir(path.join(__dirname, '..', dirApi), { withFileTypes: true });
    vm.createContext(context);
    for (const file of dir) {
        if (file.isDirectory()) {
           const res = await createApi(context, `${dirApi}/${file.name}`);
           api = new Map([...res, ...api]);
           continue; 
        } 
        const res = await fs.readFile(`${__dirname}/../${dirApi}/${file.name}`);
        const code = vm.runInContext(res, context);
        api.set(`${dirApi}/${file.name.slice(0, -3)}`, code);
    }
    return api;
}

module.exports = createApi;
