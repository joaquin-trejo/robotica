'use strict';
import _ from 'lodash';
export default angular
    .module('robotica.social.components.userCard', [])
    .directive('userCard', userCard)
    .name;

class UserCardController {
    /*@ngInject*/
    constructor($scope, $element, $state, $http, Restangular){
        this.$scope = $scope;
        this.$element = $element;
        this.$state = $state;
        this.$http = $http;
        this.Restangular = Restangular;
        this.$element.addClass('resource-card');
        this.showInfo = true;
        this.deleteUserBoolean = false;
        this.roles = [
            {
                id: 'admin',
                name: 'Admin'
           },{
                id: 'user',
                name: 'User'
            },{
                id: 'maestro',
                name: 'Maestro'
            }
        ];
        this.user = this.$scope.user;
        this.selectedRole = {};
        this.editable = this.$scope.editable === true;
        this.getUserRole(this.user);
    }

    getUserRole(user) {
        let index = _.findIndex(this.roles, function(o) {
            return o.id == user.role;
        });
        this.selectedRole = (index == -1) ? this.roles[0] : this.roles[index];
    }

    updateUser(_id){
        this.User = this.Restangular.one('users', _id);
        this.User.role = this.selectedRole.id;
        this.User
            .put()
            .then( data => {
                this.$state.go(this.$state.current, {}, {reload: true});
            })
            .catch(err => {
                throw err;
            })
    }

    deleteUser(_id){
        this.User = this.Restangular.one('users', _id);
        this.User
            .remove()
            .then( data => {
                this.$state.go(this.$state.current, {}, {reload: true});
            })
            .catch( err => {
                throw err;
            });
    }
}

function userCard($log){
    'ngInject';

    return {
        restrict: 'E',
        controller: UserCardController,
        controllerAs: '$ctrl',
        scope: {
            user: '=',
            editable: '='
        },
        template: require('./userCard.html')
    }
}