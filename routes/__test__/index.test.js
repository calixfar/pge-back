const request = require('supertest');
const { app } = require('../../app');
const User = require('../../models/user');

it('returns a 403 no token valide', async () => {
    return request(app)
        .post('/api/v1/user')
        .send({
            email: 'test@test.com',
            password: '12345678',
            name: 'Test',
            last_name: 'test',
            phone: '312312332',
            type_user: 'ADMIN',

        })
        .expect(403);
});
it('returns a 500 no password or email', async () => {
    await request(app)
        .post('/api/v1/auth')
        .send({})
        .expect(500);
    await request(app)
        .post('/api/v1/auth')
        .send({
            email: 'test@test.com'
        })
        .expect(500);
    await request(app)
        .post('/api/v1/auth')
        .send({
            password: '12312342'
        })
        .expect(500);
});
it('set token after successful login', async () => {
    const initialUser = {
        email: 'test@test.com',
        password: '12345678',
        name: 'Test',
        last_name: 'test',
        phone: '312312332',
        type_user: 'ADMIN'
    }
    const newUser =  new User(initialUser);
    newUser.save();
    await request(app)
        .post('/api/v1/auth')
        .send({
            email: initialUser.email,
            password: initialUser.password
        }).expect(200).then((res) => {
            console.log(res.body);
            expect(res.body.token).toBeDefined();
        })
    
});
it('Return 200 in register user from user type ADMIN', async () => {
    const initialUser = {
        email: 'test@test.com',
        password: '12345678',
        name: 'Test',
        last_name: 'test',
        phone: '312312332',
        type_user: 'ADMIN'
    }
    const newUser =  new User(initialUser);
    newUser.save();
    const res = await request(app)
        .post('/api/v1/auth')
        .send({
            email: initialUser.email,
            password: initialUser.password
        })
    await request(app)
        .post('/api/v1/user')
        .set('x-auth-token', res.body.token)
        .send({
            ...initialUser,
            email: 'test2@hotmail.com'

        }).expect(200)
});
it('Return 400 in register user from user type EMPLOYEE', async () => {
    const initialUser = {
        email: 'test@test.com',
        password: '12345678',
        name: 'Test',
        last_name: 'test',
        phone: '312312332',
        type_user: 'EMPLOYEE'
    }
    const newUser =  new User(initialUser);
    newUser.save();
    const res = await request(app)
        .post('/api/v1/auth')
        .send({
            email: initialUser.email,
            password: initialUser.password
        })
    await request(app)
        .post('/api/v1/user')
        .set('x-auth-token', res.body.token)
        .send({
            ...initialUser,
            email: 'test2@hotmail.com'

        }).expect(400)
});