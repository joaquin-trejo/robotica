'use strict';

import Users from './users.model';


/**
 * Get list of users
 * restriction: 'authenticate'
 */
export function index(req, res, next) {
	var query = req.querymen;
	
	Users
		.find({})
		.count()
		.exec((err, count) => {
			if (err){
				return next(err);
			}
			req.totalItems = count;
			req.result = Users
										.find(query.query)
										.skip(query.cursor.skip)
										.limit(query.cursor.limit)
										.sort(query.sort)
										.select(query.select)
										.exec();
			next();
		});
}


/**
 * Creates a new users
 * restriction: 'curador'
 */
export function create(req, res, next) {
  var newUsers = new Users(req.body);
  
	req.result = newUsers.save();
	next();
}


/**
 * Updates a users
 * restriction: 'curador'
 */
export function update(req, res, next) {
	delete req.body._id;

	req.result = Users.update({ _id: req.params.id}, req.body);
	next();
}


/**
 * Get a single users
 * restriction: 'authenticate'
 */
export function show(req, res, next) {
  var usersId = req.params.id;

	req.result = Users.findById(usersId).exec();
	next();
}


/**
 * Deletes a users
 * restriction: 'authenticate'
 */
export function destroy(req, res, next) {
	req.result =  Users.findByIdAndRemove(req.params.id).exec();
	req.statusCode = 204;
	next();
}
