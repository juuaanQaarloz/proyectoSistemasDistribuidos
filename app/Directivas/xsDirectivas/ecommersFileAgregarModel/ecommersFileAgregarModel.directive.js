angular
    .module('xsModulo')
    .directive('ecommersFileAgregarModel',ecommersFileAgregarModel);

ecommersFileAgregarModel.$inject = [];

/* @ngInject */
function ecommersFileAgregarModel() {
    return {
        require:'ngModel',
        link: function(scope, element, attrs, ngModel) {
            element.bind('change', function(){
                scope.$apply(function(){
                    ngModel.$setViewValue(element[0].files[0]);
                    ngModel.$render();
                });
            });
        }
    }
}