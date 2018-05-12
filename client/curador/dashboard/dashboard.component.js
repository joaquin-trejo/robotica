'use strict';
import angular from 'angular';
import CuradorComponent from '../curador.component';

export default class DashboardComponent extends CuradorComponent {
  /*@ngInject*/
  constructor($element, $rootScope, $q, $http, $log, $stateParams, $state, Restangular, Auth, ngMeta) {
    super({$element, $log});
    this.$q = $q;
    this.$http = $http;
    this.Restangular = Restangular;
    this.$state = $state;
    this.Auth = Auth;
    this.$rootScope = $rootScope;

    this.page = 0;
    this.limit = 20;

    this.Resources = this.Restangular.all('resources');

    this.viewResource = ($event, resource) => { 
      this.viewResource_($event, resource);
    };

    this.getUser();
    ngMeta.setTitle('Tablero');
    this.searchText = $stateParams.search;

    this.$rootScope.$on('filterChange', (event, searchText) => {
      if (this.searchText !== searchText) {
        this.page = 0;
        this.searchText = searchText;
        this.$state.go('.', { search: searchText }, {notify: false});
      }
    });
  }

  getUser(){
    this.Auth
    .getCurrentUser()
    .then(user => {
      this.user = user;
      this.username = user.name;
    });
  }

  fetchData(){
    let def = this.$q.defer();

    this.page++;
    let addNewItem = {
      type: 'addnew',
      options: [
        { section: 'propuestas', icon: 'ri ri-propuestas', caption: 'Propuestas pedagógica' },
        { section: 'actividades', icon: 'ri ri-actividades', caption: 'Actividades' },
        { section: 'herramientas', icon: 'ri ri-herramienta', caption: 'Herramientas' },
        { section: 'orientaciones', icon: 'ri ri-orientaciones', caption: 'Orientaciones' },
        { section: 'mediateca', icon: 'ri ri-mediateca', caption: 'Mediateca' },
        { section: 'desafios', icon: 'ri ri-desafio', caption: 'Desafíos' }
      ]
    };

    let q;
    if (this.searchText){
      q = this.searchText
    }
    
    this.Resources
        .getList({
          q: q,
          page: this.page, 
          limit: this.limit,
          sort: 'updatedAt'
        })
        .then(res => {
          let items = [];
          if (this.page === 1) {
            items.push(addNewItem);
          }
          
          items = items.concat(res);

          let data = {
            count: (res.$total + 1),
            items: items,
            page: this.page,
            limit: this.limit
          };

          def.resolve(data);
        })
        .catch(err => {
          throw err;
        });

    return def.promise;
  }
  
  $onInit(){

  }
  
  viewResource_($event, resource){
    if (!resource){
      return;
    }

    this.$state.go(`curador.recurso`, { uid: resource._id });

  }
}
