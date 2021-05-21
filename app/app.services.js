(function () {
    'use strict';

    angular
        .module('app')
        .factory('serviciosRest', serviciosRest);

    serviciosRest.$inject = ['$http', '$log', '$window', '$resource', 'urlServicios'];

    /* @ngInject */
    function serviciosRest($http, $log, $window, $resource, urlServicios) {

        var serviciosJava = $resource(urlServicios+'apiRest/:servicio', {servicio: "@servicio"}, {
            getUsuarios: {
                method: 'POST', isArray: 'true', headers: {'Content-Type': 'application/json'}
            }
        });

        var servicios = {
            validarDato: validarDato,
            replaceAll: replaceAll,
            consultaGenerica: consultaGenerica
        };
        return servicios;

        function validarDato(valor) {
            var bandera = false;
            if (valor != undefined && valor != null && valor != '') {
                bandera = true;
            }
            return bandera;
        }

        function replaceAll(str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        }

        function consultaGenerica(services) {
            return $http.get("ApiPHP/" + services + ".php");
        }
    }
})();