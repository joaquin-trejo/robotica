'use strict';
import $ from 'jquery';
import { Z_DEFAULT_STRATEGY } from 'zlib';

export default angular
	.module('robotica-ui.components.navbarItem', [])
	.directive('rdNavbarItem', RdContainer)
	.name;

class RdNavbarItemController {
	/*@ngInject*/
	constructor($scope, $element, $state) {
		this.$scope = $scope;
        this.$element = $element;
        this.$state = $state;
        // has a model?
        this.model = this.$scope.ngModel;
        let m = this.$scope.ngModel;
		if (m && typeof m === 'object') {
			//replace the scope;
			this.icon = m.icon;
			this.caption = m.caption;
			this.section = m.section;
		} else {
			this.icon = this.$scope.icon;
			this.caption = this.$scope.caption;
		}

        this.$element.addClass('rd-navbar__item');
		this.$element.attr('data-rd-section', this.section);
		
		//this.$element.attr('role', 'menuitem');

        this.$scope.$watch(() => { return this.$scope.selected }, (value) => {
            if (value) {
                this.$element.addClass('rd-navbar__item--selected');
            } else {
                this.$element.removeClass('rd-navbar__item--selected')
            }
        });
    }

    itemClicked(item) {
        if (this.selected === item.section) return;
        let host = window.location.host;
        let protocol = window.location.protocol;
        if (item.action) {
            this.selected = item.action;
            window.location.href = `${protocol}//${host}/${item.action}`;
        }
        // this.$state.go('.', { seccion: item.section });
        // this.selected = item.section;
    }
}

function RdContainer(){
	'ngInject';

	return {
		restrict: 'E',
		controller: RdNavbarItemController,
		controllerAs: '$rdNavbarItemCtrl',
		scope: {
			icon: '@navbarItemIcon',
			caption: '@navbarItemCaption',
            section: '@navbarItemSection',
            menuSectionsName: '=',
			ngModel: '=',
			selected: '=navbarItemSelected'
		},
		template: require('./navbar-item.html')
	}
}