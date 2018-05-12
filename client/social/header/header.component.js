'use strict';
import angular from 'angular';

class HeaderComponent {
  /*@ngInject*/
  constructor($element, $state, $stateParams, $rootScope) {
    this.selected = '';
    this.$stateParams = $stateParams;
    this.$state = $state;
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
      { section: 'mediateca1', icon: 'ri ri-mediateca', caption: 'Mediateca1' },
    ];

    this.menuNavBar = [
      {
        section: 'institucional',  caption: 'Institucional',
        "nodes": [
          {
            section: 'quienesSomos',  caption: 'Quienes Somos', action:'/quienesSomos.html'
          },
          {
            section: 'ultimasNoticias',  caption: 'Ultimas Noticas', action:'?seccion=ultimasNoticias'
          },
          {
            section: 'calendario',  caption: 'Calendario', action:'?seccion=calendario'
          }
        ]
      },
      {
        section: 'desafios',  caption: 'Desafios',
        "nodes": [
          {
            section: 'desafios',  caption: 'Desafios', action:'?seccion=desafios'
          },
          {
            section: 'subiDesafio',  caption: 'Subi tu desafio', action:'/subiDesafio'
          }
        ]
      },
      {
        section: 'Otra',  caption: 'Otra de purbea',
        "nodes": [
          {
            section: 'prueba 1',  caption: 'prueba1 ', action:'?seccion=desafios'
          },
          {
            section: 'prueba 2',  caption: 'prueba2 ', action:'/subiDesafio'
          }
        ]
      },
      {
        section: 'kits',  caption: 'Kits', action:'?seccion=kits'
      }
    ];

    this.arraySectionsName = [];
  
    $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
      this.searchText =  $stateParams.search || '';
      if (!toParams.seccion){
        this.selected = '';
      }
    });
  }

  $onInit(){
    this.selected = this.$stateParams.seccion;
    for (var j = 0; j < this.menuNavBar.length; j++) {
      this.arraySectionsName.push(this.menuNavBar[j].section);
    }
  }
  
  selectedItemChange(item){

  }

  querySearch(searchText){
    return [];
  }

  searchTextChange(searchText){
    this.$rootScope.$emit('filterHomeChange', searchText);
  }

  itemClicked(item) {
    if (!item.nodes) {
        if (this.selected === item.section){
            return;
        }
        this.$state.go('.', { seccion: item.section });
        this.selected = item.section;
    }
  }
}

export default angular.module('robotica.social.socialHeader', [])
  .component('socialHeader', {
    template: require('./header.html'),
    controller: HeaderComponent
  })
  .name;
