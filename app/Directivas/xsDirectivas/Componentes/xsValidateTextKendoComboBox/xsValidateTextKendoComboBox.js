/**
 * @ngdoc directive
 * @name xsModulo.directive:xsValidateTextKendoComboBox
 * @scope
 * @restrict
 * @description
 * Directivaque valida que en verdad hayan seleccionado alguna opcion del cbx de lo contrario
 * retornara invalido.
 */
angular.module('xsModulo')
    .directive('xsValidateTextKendoComboBox', function ($timeout) {
        function link($scope, element, attributes, controller) {
            var cont = controller;
            var ele = element;
            var sco = $scope;
            element.bind('change', function ($event) {
                if (element.data("kendoComboBox").selectedIndex == -1) {
                    $timeout(function(){
                        ele.data("kendoComboBox").value('');
                        cont[0].$setViewValue('');
                        cont[0].$render();
                        sco.$apply();
                    });
                    return null;
                }
            });
           // var validator = getValidator(controller, element);
            controller[0].$formatters.unshift(function (value){
                if(element.context.selectedOptions.length == 0){
                    if(value != undefined && value != '' && value != null){
                        if (element.data("kendoComboBox") != undefined && ele.data("kendoComboBox").selectedIndex == -1) {
                            ele.data("kendoComboBox").value('');
                            cont[0].$setViewValue('');
                            cont[0].$render();
                            return null;
                        }
                        else if (value && value.toString().indexOf('undefined') < 0 && value.toString().indexOf('null') < 0
                                    && value.toString().indexOf('number') < 0 && value.toString().indexOf('string') < 0 && value.toString().indexOf('object') < 0) {
                            cont[0].$setViewValue(value);
                            cont[0].$render();
                            return value;
                        }
                        else if (value && value.toString().indexOf('undefined') > -1 && value.toString().indexOf('null') > -1
                            && value.toString().indexOf('number') > -1 && value.toString().indexOf('string') > -1 && value.toString().indexOf('object') > -1) {
                            cont[0].$setViewValue('');
                            cont[0].$render();
                            return null;
                        }
                        else {
                            return null;
                        }
                    }
                }
                else{
                    if(value != undefined && value != '' && value != null){
                        if(value && value.toString().indexOf('undefined') < 0 && value.toString().indexOf('null') < 0
                            && value.toString().indexOf('number') < 0 && value.toString().indexOf('string') < 0 && value.toString().indexOf('object') < 0) {
                            cont[0].$setViewValue(value);
                            cont[0].$render();
                            return value;
                        }
                        else if (value && value.toString().indexOf('undefined') > -1 && value.toString().indexOf('null') > -1
                            && value.toString().indexOf('number') > -1 && value.toString().indexOf('string') > -1 && value.toString().indexOf('object') > -1) {
                            cont[0].$setViewValue('');
                            cont[0].$render();
                            return null;
                        }
                        else {
                            cont[0].$setViewValue('');
                            cont[0].$render();
                            return null;
                        }
                    }
                }
            });
        }

        return {
            restrict: "A",
            link: link,
            require: ['ngModel', '?kNgModel']
        };
    });
