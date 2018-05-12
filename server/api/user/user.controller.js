'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import Published from "../published/published.model";
import Resource from "../resource/resource.model";
import Users from "../users/users.model";

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
// export function index(req, res) {
//   return User.find({}, '-salt -password').exec()
//     .then(users => {
//       res.status(200).json(users);
//     })
//     .catch(handleError(res));
//
// }

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res, next) {
    var query = req.querymen;
    let qq = req.query.q;
    let q = {};
    if (qq){
        // convert to regex
        let keywords = _.escapeRegExp(qq);
        let patterns = [
            { s: /[aáà]/ig, v: '[aáà]' },
            { s: /[eéè]/ig, v: '[eéè]' },
            { s: /[iíì]/ig, v: '[iíì]' },
            { s: /[oóò]/ig, v: '[oóò]' },
            { s: /[uúù]/ig, v: '[uúù]' },
        ];

        _.each(patterns, p => {
            keywords = keywords.replace(p.s, p.v);
        });

        let k = new RegExp(keywords, 'i');

        q = { $or: [
                { name: { $regex: k, $options: 'i' } },
                { email: { $regex: k, $options: 'i' } },
                { provider: { $regex: k, $options: 'i' } },
                { role: { $regex: k, $options: 'i' } }
            ]
        };
    }

    User
        .find(q)
        .count()
        .exec((err, count) => {
            if (err){
                return next(err);
            }
            req.totalItems = count;
            req.result = User
                .find(q)
                .populate('owner')
                .populate('files')
                .sort(query.cursor.sort)
                .skip(query.cursor.skip)
                .limit(query.cursor.limit)
                .select(query.cursor.select)
                .exec();
            next();
        });
}

/**
 * Creates a new user
 */
export function create(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res, next) {
    req.result = User.findByIdAndRemove(req.params.id).exec();
    next();
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      // remove google thing
      if (user.provider === 'google'){
        user.avatar = _.get(user, 'google.image.url');
        //user.google = undefined;
      }
      res.json(user);
    })
    .catch(err => next(err));
}


/**
 * Updates a user
 * restriction: 'admin'
 */
export function update(req, res, next) {
    delete req.body._id;

    req.result = User.update({ _id: req.params.id}, req.body).exec();
    next();
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
