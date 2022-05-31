async ({ login, password }) => {    
    const user = await db.select('\"User\"', ['*'], { login });
    console.log(user);
    const hash = user ? user.password : undefined;
    const valid = await secure.verify(password, hash);
    if (!user || !valid) throw new Error('Incorrect login or password');
    return { userId: user.accountId };
};