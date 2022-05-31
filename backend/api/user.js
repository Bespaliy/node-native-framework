async (table, schema = ['*'], conditional = null) => {
    const res = await db.select(table, schema, conditional);
    const UserId = res.rows[0]['accountId'];
    const session = await db.select('Session', ['token'], {UserId});
    return { result: 'success', data: session.rows[0] };
  };