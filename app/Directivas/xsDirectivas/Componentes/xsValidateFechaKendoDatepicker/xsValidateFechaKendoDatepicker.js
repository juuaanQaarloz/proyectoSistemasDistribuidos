/**
 * @ngdoc directive
 * @name xpertysModulo.directive:xvValidateFechaKendoDatepicker
 * @scope
 * @restrict
 * @description
 * Directivaque valida que la fecha de campo de datepickers se una fecha valida
 */
angular.module('xpertysModulo')
    .directive('xsValidateFechaKendoDatepicker', function ($timeout, $log, $filter) {
        function link($scope, element, attributes, controller) {
            var cont = controller;
            var ele = element;
            var sco = $scope;
            var att = attributes;

            element.bind('focus', function ($event) {

                if(ele.data("kendoDatePicker").options.format == 'dd/MM/yyyy'){
                    $(ele).kendoMaskedTextBox({
                        mask: "00/00/0000"
                    });
                }
                if(ele.data("kendoDatePicker").options.format == 'MM/yyyy'){
                    $(ele).kendoMaskedTextBox({
                        mask: "00/0000"
                    });
                }
                if(ele.data("kendoDatePicker").options.format == 'MM/yy'){
                    $(ele).kendoMaskedTextBox({
                        mask: "00/00"
                    });
                }

                $(ele).removeClass("k-textbox");

            });
            /*--Accion que se ejecuta ya qe fecha a sido seleccioada o despues de qe qita el focus de input-----*/
            element.bind('change', function ($event) {

                var fechaValida;
                var fechaMin = $filter('fechaSimple')(ele.data("kendoDatePicker").options.min);
                var fechaMax = $filter('fechaSimple')(ele.data("kendoDatePicker").options.max);

                if(ele.data("kendoDatePicker").options.format == 'dd/MM/yyyy'){
                    fechaReal(ele[0].value);
                }
                if(ele.data("kendoDatePicker").options.format == 'MM/yyyy'){

                    fechaRealMes(ele[0].value);
                }
                if(ele.data("kendoDatePicker").options.format == 'MM/yy'){

                    fechaRealAnio(ele[0].value);
                }
                /**
                 * Funcion que se utilza para validar si la fecha que se esta ingresando es valida y real
                 * @param {Date} fecha - Feche a la que se le esta comparando
                 * @returns {boolean} fechaValida - Retorna un tru si la fecha es valida
                 */
                function fechaReal (fecha) {
                    $log.info("Entra a validar la fecha seleccioanda dd/MM/yyyy");

                    var fechaf = fecha.split("/");
                    var d = fechaf[0];
                    var m = fechaf[1];
                    var y = fechaf[2];
                    // valida qe el mes sea menor a 13
                    // valida qe el año sea menor a 2100
                    // valida qe el dia dependiendo del mes
                    fechaValida = m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();

                    return fechaValida
                }
                /**
                 * Funcion que se utilza para validar si la fecha que se esta ingresando es valida y real solo mes y año
                 * @param {Date} fecha - Feche a la que se le esta comparando
                 * @returns {boolean} fechaValida - Retorna un tru si la fecha es valida
                 */
                function fechaRealMes (fecha) {
                    $log.info("Entra a validar la fecha seleccioanda MM/yyyy");

                    var fechaf = fecha.split("/");
                    var m = fechaf[0];
                    var y = fechaf[1];
                    // valida qe el mes sea menor a 13
                    // valida qe el año sea menor a 2100
                    fechaValida = m > 0 && m < 13 && y > 0 && y < 32768;
                    return fechaValida
                }

                /**
                 * Funcion que se utilza para validar si la fecha que se esta ingresando es valida y real solo mes y año
                 * @param {Date} fecha - Feche a la que se le esta comparando
                 * @returns {boolean} fechaValida - Retorna un tru si la fecha es valida
                 */
                function fechaRealAnio (fecha) {
                    $log.info("Entra a validar la fecha seleccioanda MM/yy");

                    var fechaf = fecha.split("/");
                    var m = fechaf[0];
                    var y = fechaf[1];
                    // valida qe el mes sea menor a 13
                    // valida qe el año sea menor a 2100

                    fechaValida = m > 0 && m < 13 && y > 0 && y <= 99;
                    return fechaValida
                }

                if (!fechaValida) {
                    $log.info(fechaValida + " Fecha Invalida Selecciona Otra :'C");
                    $timeout(function(){
                        ele.data("kendoDatePicker").value('');
                        cont[0].$setViewValue('');
                        cont[0].$render();
                        sco.$apply();
                    });
                    return null;
                }else{
                    //funcion que valida si la fecha introducida es menor al fecha minima
                    if(fechas(fechaMin, ele[0].value ) == 'S'){
                        $log.info("Fecha Menor a la minima requerida");
                        $timeout(function(){
                            ele.data("kendoDatePicker").value('');
                            cont[0].$setViewValue('');
                            cont[0].$render();
                            sco.$apply();
                        });
                        return null;
                    }
                    //funcion que valida si la fecha introducida es mayor al fecha maxima
                    if(fechas(ele[0].value, fechaMax ) == 'S'){
                        $log.info("Fecha Mayor a la maxima requerida");
                        $timeout(function(){
                            ele.data("kendoDatePicker").value('');
                            cont[0].$setViewValue('');
                            cont[0].$render();
                            sco.$apply();
                        });
                        return null;
                    }
                }
            });

            /**
             * Funcion que se encarga de comparar las dos fecha que se le envian para validar cual es mayor de las 2
             * @param {Date} fechaInicial - fecha que comprara como inicial
             * @param {Date} fechaFinal - fecha que comparar como final
             * @returns {String} S - Si la fecha es mayor, N - si es menor
             */
            function fechas( fechaInicial, fechaFinal ) {

                var fecIni = fechaInicial.split("/");
                var fecFin = fechaFinal.split("/");

                var inicio = new Date( fecIni[2], (fecIni[1] - 1 ), fecIni[0] );
                var fin = new Date( fecFin[2], (fecFin[1] - 1 ), fecFin[0] );

                if(inicio > fin)
                    return "S";
                return "N";
            }
        }

        return {
            restrict: "A",
            link: link,
            link: link,
            require: ['ngModel', '?kNgModel']
        };
    });
