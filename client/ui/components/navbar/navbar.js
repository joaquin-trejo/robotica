'use strict';

import $ from 'jquery';

const HIEGHT_BREACKPOINT = 100;

export default angular
	.module('robotica-ui.components.navbar', [])
	.directive('rdNavbar', RdNavbar)
	.name;

class RdNavbarController {
	/*@ngInject*/
	constructor($scope, $element, $window, $mdMedia, $timeout, $state){
		this.$scope = $scope;
    	this.$element = $element;
		this.$timeout = $timeout;
		this.$state = this.$state;
		this.selected = '';
    	this.navBarItems = this.$scope.rdItems;

    	this.$element.addClass('rd-navbar md-whiteframe-4dp');

		this.$scope.$watch(() => { return $mdMedia('xs') || $mdMedia('sm'); }, (mobile) => {
			this.isMobile = mobile === true;
			if(this.isMobile) {
                this.$element.addClass(clsScrolled);
			} else {
                this.$element.removeClass(clsScrolled);
			}
		});

		let clsScrolled = 'rd-navbar--scrolled';
		this.isCompact = this.$scope.rdCompact;
		this.$scope.$watch(() => { return this.$scope.rdCompact; }, (rdCompact) => {
			this.isCompact = this.$scope.rdCompact;
			if (this.isCompact) {
				this.$element.addClass(clsScrolled);
			}
		});
		if (this.isCompact) {
			this.$element.addClass(clsScrolled);
		}

		$(document).ready(() => {
			var scrollTop = 0;
			$(window).scroll(() => {
				scrollTop = $(window).scrollTop();
				// if (scrollTop >= HIEGHT_BREACKPOINT) {
				// 	this.$element.addClass(clsScrolled);
				// } else if (scrollTop < HIEGHT_BREACKPOINT) {
				// 	if (!this.isCompact){
				// 		this.$element.removeClass(clsScrolled);
				// 	}
				// }
				this.removeDropdown();
			});

			$(window).resize(() => {
				this.removeDropdown();
			});

			// $(document).click(() => {
			// 	console.log(this.$element)
			// 	this.$element.removeClass('show-submenu');
			// });

            [].slice.call(document.querySelectorAll('.dropdown .nav-link')).forEach(function(el){
                el.addEventListener('click', onClick, false);
            });

            function onClick(e){
                e.preventDefault();
                var el = this.parentNode;
                el.classList.contains('show-submenu') ? hideSubMenu(el) : showSubMenu(el);
            }

            function showSubMenu(el){
                el.classList.add('show-submenu');
                document.addEventListener('click', function onDocClick(e){
                    e.preventDefault();
                    if(el.contains(e.target)){
                        return;
                    }
                    document.removeEventListener('click', onDocClick);
                    hideSubMenu(el);
                });
            }

            function hideSubMenu(el){
                el.classList.remove('show-submenu');
            }
		});

		// the dropdown
		this.dropdownOpened = false;
		this.toggleDropdown = ($event) => {
			this.dropdownOpened = !this.dropdownOpened;
			$event.stopPropagation();
		};
	}

	removeDropdown(){
		// remove the dropdown
		if (this.dropdownOpened) {
			this.dropdownOpened = false;
			this.$timeout(() => {
				//this.$apply();
			});
		}
	}

	itemClicked(item) {
        if (this.selected === item.section) return;
        let host = window.location.host;
        let protocol = window.location.protocol;
        if (item.action) {
            this.selected = item.action;
            window.location.href = `${protocol}//${host}/${item.action}`;
        } else {
            return;
        }
        // this.$state.go('.', { seccion: item.section });
        // this.selected = item.section;
    }
}

function RdNavbar($window){
	'ngInject';

	return {
		restrict: 'E',
		controller: RdNavbarController,
		controllerAs: '$rdNavbarController',
		scope: {
			rdCompact: '=',
            rdItems: '='
		},
		transclude: {
			'items': 'rdNavbarNavigation',
			'tools': 'rdNavbarTools',
			'brand': 'rdNavbarBrand',
			'body': '?rdNavbarBody',
			'profile': '?rdNavbarProfile'
		},
		template: require('./navbar.html')
	}

}