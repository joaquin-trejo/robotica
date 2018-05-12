'use strict';

import angular from 'angular';

import header from './header/header.component';
import dashboard from './dashboard';
import newResource from './new';
import resource from './resource';
import users from './users';

// config to providers
import { curadorConfig } from './curador.config';

let requirements = [
	header,
	dashboard,
	newResource,
	resource,
    users
];

module.exports = angular
									.module('robotica.curador', requirements)
									.config(curadorConfig)
									.name;
