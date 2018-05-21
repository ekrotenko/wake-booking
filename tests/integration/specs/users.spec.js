const client = require(`../services/request.client`);
const data = require(`../data/user/users.data`);
const randomString = require('random-string');
const using = require('jasmine-data-provider');

describe('Users e2e', () => {

  let createdRider;

  describe('Positive flow', () => {
    it('should create rider user', async () => {
      const res = await client('POST', data.url, {}, data.newUser);
      createdRider = res.body;

      expect(res.statusCode).toBe(201, `Status code is not correct. ${res.body}`);
      expect(res.body.firstName).toBe(data.newUser.firstName, 'First name is incorrect');
      expect(res.body.lastName).toBe(data.newUser.lastName, 'Last name is not correct');
      expect(res.body.phone).toBe(data.newUser.phone, 'Phone is not correct');
      expect(res.body.email).toBe(data.newUser.email, 'Email is not correct');
      expect(res.body.isAdmin).toBeFalsy('Is Admin is not correct');
      expect(res.body.isOwner).toBeFalsy('Is owner entity is not correct');
      expect(res.body.createdAt).not.toBeUndefined('created at is absent');
      expect(res.body.updatedAt).not.toBeUndefined('updated at is absent');
      expect(res.body.password).toBeUndefined('password is present');
      expect(res.body.salt).toBeUndefined('salt is present');
      expect(res.body.hashedPassword).toBeUndefined('hashed password is present');
    });

    it('should return list of users', async () => {
      const res = await client('GET', data.url);
      expect(res.statusCode).toBe(200, 'Status code is not correct');
      expect(res.body.length).toBeGreaterThan(1, 'Users list is empty');
    });

    it('should return specific user', async () => {
      const res = await client('GET', `${data.url}/${createdRider.id}`);
      expect(res.statusCode).toBe(200, 'Status code is not correct');
      expect(res.body.firstName).toBe(data.newUser.firstName, 'First name is incorrect');
      expect(res.body.lastName).toBe(data.newUser.lastName, 'Last name is not correct');
      expect(res.body.phone).toBe(data.newUser.phone, 'Phone is not correct');
      expect(res.body.email).toBe(data.newUser.email, 'Email is not correct');
      expect(res.body.isAdmin).toBeFalsy('Is Admin is not correct');
      expect(res.body.isOwner).toBeFalsy('Is owner entity is not correct');
    });

    it('should update user', async () => {
      const res = await client('PUT', `${data.url}/${createdRider.id}`, {}, data.updateUser);
      expect(res.statusCode).toBe(200, 'Status code is not correct');
      expect(res.body.firstName).toBe(data.updateUser.firstName, 'First name is incorrect');
      expect(res.body.lastName).toBe(data.updateUser.lastName, 'Last name is not correct');
      expect(res.body.phone).toBe(data.updateUser.phone, 'Phone is not correct');
      expect(res.body.email).toBe(data.updateUser.email, 'Email is not correct');
      expect(res.body.isAdmin).toBeFalsy('Is Admin is not correct');
      expect(res.body.isOwner).toBeFalsy('Is owner entity is not correct');
    });
  });

  describe('Negative flow', () => {
    describe('get specific user', () => {
      it('should not return not existing user', async () => {
        const res = await client('GET', `${data.url}/${data.randomId}`);
        expect(res.statusCode).toBe(404, 'status code is not correct');
        expect(res.statusMessage).toBe('Not Found', 'status message is not correct');
      });
    });

    describe('Fields validation', () => {
      it('Required fields', async () => {
        const res = await client('POST', data.url);

        expect(res.statusCode).toBe(422, 'Status code is not correct');
        expect(res.body).toBe(data.validationMessages.required, 'Required validation is not correct');
      });

      using(data.lengthValidation, (validationData, description) => {
        describe(`${description} length validation`, () => {

          using(validationData.values, (length) => {
            it(`Length ${length}`, async () => {
              const payload = Object.assign({}, data.newUser);
              payload[description] = randomString({length});
              const res = await client('POST', data.url, {}, payload);

              expect(res.statusCode).toBe(422);
              expect(res.body).toBe(data.validationMessages.length(description));
            });
          })

        });
      });

      describe('Email field', ()=>{
        it('unique', async ()=>{
          const payload = Object.assign({}, data.newUser);
          payload.email = createdRider.email;
          const res = await client('POST', data.url, {}, payload);

          expect(res.statusCode).toBe(422);
          expect(res.body).toBe(data);
        })
      })
    })
  });

});