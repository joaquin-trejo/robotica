'use strict';

export default angular
    .module('robotica.social.components.userCard', [])
    .service('userCardService', userCardService)
    .name;

function userCardService($http) {
    /****************** FUNCTIONS DECLARED *********************/
    this.editUser = editUser;

    /********************* FUNCTIONS **************************/
    function editUser(id, role) {
        const host = window.location.host;
        const protocol = window.location.protocol;
        const payload = {
            id: id,
            role: role
        };
        return $http.post(`${protocol}//${host}/editUser`, payload);
    }
}