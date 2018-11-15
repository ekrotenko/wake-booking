const usersService = require('../services/users.service');
const parksUsersService = require('../services/parks.users.service');
const Joi = require('joi');
const payloadValidationHelper = require('../libs/helpers/payload-validation-helper');

class UsersController {
  constructor(usersService, parksUsersService) {
    this.__usersService = usersService;
    this.__parksUsersService = parksUsersService;

    this.__joi_post_validator = Joi
      .object({
        firstName: Joi.string()
          .min(3)
          .max(30)
          .regex(/^[^1-9~`!@#$%^*()_+={}:;"<>,.&/?|]+$/)
          .required(),
        ip_masks: Joi.array().min(1)
          .items(
            Joi.string().ip({
              version: [
                'ipv4',
                'ipv6',
              ],
              cidr: 'optional',
            })
          ),
      })
      .min(1);
  }

  async getAll(req, res) {
    res.status(200).json(await this.__usersService.getAllUsers());
  }

  async setUserParam(req, res, next, id) {
    const user = await this.__usersService.getUserById(id);
    if (!user) {
      res.status(404).send('Not found');
    } else {
      req.user = user;
      next();
    }
  }

  async getUserById(req, res) {
    res.status(200).send(req.user);
  }

  async updateUserData(req, res, next) {
    res.send(await this.__usersService
      .updateUserData(req.user, req.body)
      .catch(next));
  }

  async createUser(req, res, next) {

    try {
      payloadValidationHelper.joiValidate(req.body, this.__joi_post_validator);
      const user = await this.__usersService.createUser(req.body);
      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  }

  async createParkForUser(req, res, next) {
    try {
      let user = req.user;
      if(!user.isOwner){
        user = await this.__usersService.updateUserData(req.user, {isOwner: true});
      }
      const park = await this.__parksUsersService.createPark(user, req.body);
      const responseData = {
        user: {
          id: req.user.id
        },
        park
      };

      res.status(201).send(responseData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsersController(usersService, parksUsersService);
