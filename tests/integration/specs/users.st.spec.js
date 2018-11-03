const request = require('supertest');
const app = require('../../../app');
const data = require('../data/user/users.data');

const url = '/users';

describe('Users spec', () => {

  describe('positive flow', ()=>{
    it('should create new user', () => {
      const userData = data.newUser();
      request(app)
        .post(url)
        .send(userData)
        .end((err, res) => {
          expect(res.statusCode).toBe(201, `Status code is not correct. ${res.body}`);
          expect(res.body.firstName).toBe(userData.firstName, 'First name is incorrect');
          expect(res.body.lastName).toBe(userData.lastName, 'Last name is not correct');
          expect(res.body.phone).toBe(userData.phone, 'Phone is not correct');
          expect(res.body.email).toBe(userData.email, 'Email is not correct');
          expect(res.body.isAdmin).toBeFalsy('Is Admin is not correct');
          expect(res.body.isOwner).toBeFalsy('Is owner entity is not correct');
          expect(res.body.createdAt).not.toBeUndefined('created at is absent');
          expect(res.body.updatedAt).not.toBeUndefined('updated at is absent');
          expect(res.body.password).toBeUndefined('password is present');
          expect(res.body.salt).toBeUndefined('salt is present');
          expect(res.body.hashedPassword).toBeUndefined('hashed password is present');
        })
    });

    it('should return list of users', () => {
      request(app)
        .get(url)
        .end((err, res) => {
          expect(res.statusCode).toBe(200, 'Status code is not correct');
          expect(res.body.length).toBeGreaterThan(1, 'Users list is empty');
        });
    });

    it('should return specific user', async () => {
      let id;
      const userData = data.newUser();
      request(app)
        .post(url)
        .send(userData)
        .end((err, res)=>{
          id = res.body.id;

          request(app)
            .get(`${url}/${id}`)
            .end((err, res) => {
              expect(res.statusCode).toBe(200, 'Status code is not correct');
              expect(res.body.firstName).toBe(userData.firstName, 'First name is incorrect');
              expect(res.body.lastName).toBe(userData.lastName, 'Last name is not correct');
              expect(res.body.phone).toBe(userData.phone, 'Phone is not correct');
              expect(res.body.email).toBe(userData.email, 'Email is not correct');
              expect(res.body.isAdmin).toBeFalsy('Is Admin is not correct');
              expect(res.body.isOwner).toBeFalsy('Is owner entity is not correct');
            });
        });
    });

    it('should update user', async () => {
      let id;
      const userData = data.newUser();
      const updateUser = data.newUser();
      request(app)
        .post(url)
        .send(userData)
        .end((err, res)=>{
          id = res.body.id;

          request(app)
            .put(`${url}/${id}`)
            .send(updateUser)
            .end(res=>{
              expect(res.statusCode).toBe(200, 'Status code is not correct');
              expect(res.body.firstName).toBe(updateUser.firstName, 'First name is incorrect');
              expect(res.body.lastName).toBe(updateUser.lastName, 'Last name is not correct');
              expect(res.body.phone).toBe(updateUser.phone, 'Phone is not correct');
              expect(res.body.email).toBe(updateUser.email, 'Email is not correct');
              expect(res.body.isAdmin).toBeFalsy('Is Admin is not correct');
              expect(res.body.isOwner).toBeFalsy('Is owner entity is not correct');
            })
        });
    });
  })
});
