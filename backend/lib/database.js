'use strict';

const {
    Pool
} = require('pg');

class DataBase {
    #pool;
    constructor(config) {
        this.#pool = new Pool(config);
    }

    async #query(sql, values) {
        return await this.#pool.query(sql, values);
    }

    #where(conditional, index = 0) {
        const keys = Object.keys(conditional);
        const args = [];
        const values = [];
        const operator = '=';
        for (const key of keys) {
            values.push(conditional[key]);
            args.push(`${key} ${operator} $${++index}`);
        }
        return {
            expression: args.join(' AND '),
            values
        };
    }

    delete(table, conditional) {
        const {
            expression,
            values
        } = this.#where(conditional);
        const sql = `DELETE FROM ${table} WHERE ${expression}`;
        this.#query(sql, values);
    }

    async select(table, schema = ['*'], conditional = null) {
        const keys = schema.join(', ');
        let whereClause = '';
        let args = [];
        if (conditional) {
            const {
                expression,
                values
            } = this.#where(conditional);
            whereClause += `WHERE ${expression}`;
            args = values;
        }
        const sql = `SELECT ${keys} FROM ${table} ${whereClause}`;
        console.log(sql, args);
        const data = await this.#query(sql, args);
        return data.rows[0];
    }

    async insert(table, schema) {
        const keys = Object.keys(schema);
        const values = [];
        const args = [];
        let i = 0;
        for (const key of keys) {
            values.push(schema[key]);
            args.push(`$${++i}`);
        }
        const fildes = keys.join(', ');
        const params = args.join(', ');
        const sql = `INSERT INTO ${table} (${fildes}) VALUES (${params})`;
        await this.#query(sql, values);
    }

    #parseUpdate(conditional, index = 0) {
        const keys = Object.keys(conditional);
        const args = [];
        const values = [];
        for (const key of keys) {
            values.push(conditional[key]);
            args.push(`${key} = $${++index}`);
        }
        return {
            expression: args.join(', '),
            values
        }
    }

    async update(table, schema, conditional) {
        const argIndex = Object.keys(schema).length;
        const updExp = this.#parseUpdate(schema);
        const cond = this.#where(conditional, argIndex);
        const sql = `UPDATE ${table} SET ${updExp.expression} WHERE ${cond.expression}`;
        const values = updExp.values.concat(cond.values);
        await this.#query(sql, values);
    }

    async transaction(table, fromUser, toUser, difference) {
        const client = await this.#pool.connect()
        try {
            await client.query('BEGIN');
            const newBalanceFrom = fromUser.balance - parseInt(difference, 10);
            const newBalanceTo = parseInt(toUser.balance) + parseInt(difference, 10);
            const sql = `UPDATE ${table} SET balance = $1 WHERE login = $2 AND balance = $3`;
            await client.query(sql, [newBalanceFrom, fromUser.login, fromUser.balance]);
            await client.query(sql, [newBalanceTo, toUser.login, toUser.balance]);
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    close() {
        this.#pool.end();
      }
}

module.exports.DataBase = DataBase;