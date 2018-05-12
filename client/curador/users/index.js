'use strict';

import UsersComponent from './users.component';

let routes = function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('curador.users', {
      url: '/tablero/users',
        authenticate: 'curador',
      template: '<curador-users></curador-users>'
    });
}

export default angular.module('robotica.curador.curadorUsers', [])
                      .config(routes)
                      .component('curadorUsers', {
                        template: require('./users.html'),
                        controller: UsersComponent
                      })
                      .name;