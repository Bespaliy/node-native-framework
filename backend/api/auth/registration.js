async ({ login, password }) => {
    const hash = await secure.hash(password);
    await db.insert('\"User\"', { login, password: hash});
    return { status: 'Ok' };
  };