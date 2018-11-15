const request = require('supertest');
const app = require('../../../app');
const data = require('../data/user');
const using = require('jasmine-data-provider');

const url = '/users';

describe('Users spec.', () => {

  describe('Positive flow.', () => {
    it('should create new user', async () => {
      const userData = data.newUser();
      const res = await request(app)
        .post(url)
        .send(userData);

      expect(res.statusCode).toBe(201, `Status code is not correct. ${res.body}`);
      expect(res.body.firstName).toBe(userData.firstName, 'First name is incorrect');
      expect(res.body.lastName).toBe(userData.lastName, 'Last name is not correct');
      expect(res.body.phone).toBe(userData.phone, 'Phone is not correct');
      expect(res.body.email).toBe(userData.email, 'Email is not correct');
      expect(res.body.isAdmin).toBe(!!userData.isAdmin, 'Is Admin is not correct');
      expect(res.body.isOwner).toBe(!!userData.isOwner, 'Is owner entity is not correct');
      expect(res.body.createdAt).not.toBeUndefined('created at is absent');
      expect(res.body.updatedAt).not.toBeUndefined('updated at is absent');
      expect(res.body.password).toBeUndefined('password is present');
      expect(res.body.salt).toBeUndefined('salt is present');
      expect(res.body.hashedPassword).toBeUndefined('hashed password is present');
    });

    describe('Dependent tests.', () => {
      let id;
      let userData;

      beforeEach(async () => {
        userData = data.newUser();
        id = (await request(app)
          .post(url)
          .send(userData))
          .body.id;
      });

      it('should return list of users', async () => {
        const res = await request(app)
          .get(url);

        expect(res.statusCode).toBe(200, 'Status code is not correct');
        expect(res.body.length).toBeGreaterThan(1, 'Users list is empty');
      });

      it('should return specific user', async () => {
        const res = await request(app)
          .get(`${url}/${id}`);

        expect(res.statusCode).toBe(200, 'Status code is not correct');
        expect(res.body.firstName).toBe(userData.firstName, 'First name is incorrect');
        expect(res.body.lastName).toBe(userData.lastName, 'Last name is not correct');
        expect(res.body.phone).toBe(userData.phone, 'Phone is not correct');
        expect(res.body.email).toBe(userData.email, 'Email is not correct');
        expect(res.body.isAdmin).toBeFalsy('Is Admin is not correct');
        expect(res.body.isOwner).toBeFalsy('Is owner entity is not correct');
      });

      it('should update user', async () => {
        const updateUser = data.newUser();

        const res = await request(app)
          .put(`${url}/${id}`)
          .send(updateUser);

        expect(res.statusCode).toBe(200, 'Status code is not correct');
        expect(res.body.firstName).toBe(updateUser.firstName, 'First name is incorrect');
        expect(res.body.lastName).toBe(updateUser.lastName, 'Last name is not correct');
        expect(res.body.phone).toBe(updateUser.phone, 'Phone is not correct');
        expect(res.body.email).toBe(updateUser.email, 'Email is not correct');
        expect(res.body.isAdmin).toBeFalsy('Is Admin is not correct');
        expect(res.body.isOwner).toBeFalsy('Is owner entity is not correct');
      });
    });
  });

  describe('Negative flow.', () => {

    describe('Get specific user.', () => {
      it('should not return not existing user', async () => {
        const res = await request(app)
          .get(`${url}/${data.randomId}`);

        expect(res.statusCode).toBe(404, 'status code is not correct');
        expect(res.text).toBe('Not found', 'status message is not correct');
      });
    });

    describe('Fields validation.', () => {
      describe('Required fields', () => {
        it('Not passed fields', async () => {
          const requiredMessages = Object.assign({}, data.validationMessages.required);
          const res = await request(app)
            .post(url)
            .send({});

          expect(res.statusCode).toBe(422, 'Status code is not correct');

          using(requiredMessages, (expectedMessage, field) => {
            const error = res.body.errors.find(e => e.path === field);
            expect(error.message).toBe(expectedMessage, `Required validation message of ${field} is not correct`);
          });
        });

        using(data.validation.emptyValue.values, (field) => {
          it(`Empty value in ${field}`, async () => {
            const payload = data.newUser();
            payload[field] = '';

            const res = await request(app)
              .post(url)
              .send(payload);

            const expectedMessage = data.validationMessages.required[field];
            expect(res.statusCode).toBe(422, 'Status code is not correct');
            expect(res.body.errors[0].message)
              .toBe(expectedMessage, `Required validation message of ${field} is not correct`);
          })
        })

      });


      using(data.validation.length, (validationData, field) => {
        describe(`${field} length validation.`, () => {

          using(validationData.values, (length) => {
            it(`Length ${length}`, async () => {
              const payload = data.newUser();
              payload[field] = data.generateLengthData(field, length);

              const res = await request(app)
                .post(url)
                .send(payload);

              expect(res.statusCode).toBe(422);
              expect(res.body.errors[0].message)
                .toBe(data.validationMessages.invalid(validationData.nameInError || field),
                  `${field} validation error is incorrect`);
            });
          })

        });
      });

      using(data.validation.content, (validationData, field) => {
        describe(`${field} content validation`, () => {

          using(validationData.values, (content) => {
            it(`Length ${content}`, async () => {
              const payload = data.newUser();
              payload[field] = content;

              const res = await request(app)
                .post(url)
                .send(payload);

              expect(res.statusCode).toBe(422);
              expect(res.body.errors[0].message)
                .toBe(data.validationMessages.invalid(validationData.nameInError || field),
                  `${field} validation error is incorrect`);
            });
          })

        });
      });

      describe('Email field', () => {
        it('Unique', async () => {
          const existingEmail = (await request(app)
            .post(url)
            .send(data.newUser()))
            .body.email;

          const payload = data.newUser();
          payload.email = existingEmail;

          const res = await request(app)
            .post(url)
            .send(payload);

          expect(res.statusCode).toBe(422);
          expect(res.body.errors[0].message)
            .toBe(data.validationMessages.uniqueEmail, `Validation message of unique email is incorrect`);
        });
      })
    })
  });

});
