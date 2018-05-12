'use strict';
/*eslint no-invalid-this:0*/
mongoose.Promise = require('bluebird');
import mongoose, {Schema} from 'mongoose';
import {registerEvents} from './users.events';

var ops = {};
ops.timestamps = true;
var UsersSchema = new Schema({
	}, ops);

registerEvents(UsersSchema);
export default mongoose.model('Users', UsersSchema);