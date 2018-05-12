'use strict';
import angular from 'angular';
import $ from 'jquery';

class CuradorHeaderComponent {
  /*@ngInject*/
  constructor($rootScope, $scope, $element, $stateParams, Auth, $state) {
    this.$scope = $scope;
    this.selected = '';
    this.Auth = Auth;
    this.$state = $state;
    this.showingDropdown = false;
    this.$rootScope = $rootScope;

    this.isDisabled = false;
    this.noCache = true;
    this.selectedItem;
    this.searchText =  $stateParams.search || '';

    this.navbarItems = [
      { section: 'propuestas', icon: 'ri ri-propuestas', caption: 'Propuestas' },
      { section: 'actividades', icon: 'ri ri-actividades', caption: 'Actividades' },
      { section: 'herramientas', icon: 'ri ri-herramienta', caption: 'Herramientas' },
      { section: 'orientaciones', icon: 'ri ri-orientaciones', caption: 'Orientaciones' },
      { section: 'mediateca', icon: 'ri ri-mediateca', caption: 'Mediateca' },
    ];

    this.getUser();
    this.handleClickOnWindow();

    $rootScope.$on('$stateChangeSuccess', () => {
      this.searchText =  $stateParams.search || '';
    });
  }


  searchTextChange(searchText){
    this.$rootScope.$emit('filterChange', searchText);
  }
  
  selectedItemChange(item){

  }

  querySearch(searchText){
    return [];
  }

  getUser(){
    this.Auth
      .getCurrentUser()
      .then(user => {
        this.user = user;
      })
      .catch(err => {
        throw err;
      });
  }

  handleClickOnWindow() {
    $(window).click(() => {
      if (this.showingDropdown){
        this.showingDropdown = false;
        this.$scope.$apply();
      }
    });
  }
  
  itemClicked(item) {
    if (this.selected === item.section){
      return;
    }
    this.selected = item.section;
  }

  toggleProfile($event){
    this.showingDropdown = !this.showingDropdown;
    $event.stopPropagation();
  }

  logout(){
    this.Auth.logout();
    this.$state.go('app.login');
  }

    goUserModule() {
        // let host = window.location.host;
        // let protocol = window.location.protocol;
        // window.location.href = `${protocol}//${host}/tablero/users`;
        this.$state.go('curador.users');
    }
}

export default angular.module('robotica.curador.curadorHeader', [])
  .component('curadorHeader', {
    template: require('./header.html'),
    controller: CuradorHeaderComponent
  })
  .name;
