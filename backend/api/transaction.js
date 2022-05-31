async (table, data) => {
    const from = await db.select(table, ['login', 'balance'], {login: data.fromUser});
    const to = await db.select(table, ['login', 'balance'], {login: data.toUser});
    const fromUser = from.rows[0];
    const toUser = to.rows[0];
    await db.transaction(table, fromUser, toUser, data.sum);
    return { result: 'success' };
  };