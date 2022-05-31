interface IConfig {
    host: string,
    port: number,
    database: string,
    user: string,
    password: string,
}

interface IConditional {
    expression: string, 
    values: string[]
}

export class DataBase {
    private #pool: Pool;
    private async #query(sql: string, values: string[]): Promise<QueryArrayResult<any[]>>;
    private #where(conditional: object, index = 0): IConditional;
    private #parseUpdate(conditional: object, index = 0): IConditional;
    constructor(config: IConfig);
    delete(table: string, conditional: object): void;
    async select(table: string, schema = ['*'], conditional?: object): Promise<QueryArrayResult<any[]>>;
    async insert(table: string, schema: object): Promise<void>;
    async update(table: string, schema: object, conditional: object): Promise<void>;
    async transaction(table: string, fromUser: object, toUser: object, difference: number): Promise<void>;
    close(): void;
}