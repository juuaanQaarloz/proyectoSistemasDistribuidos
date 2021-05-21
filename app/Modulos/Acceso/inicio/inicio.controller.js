(function () {
    'use strict';
    angular
        .module('app')
        .controller('InicioControlador', InicioControlador);

    /* @ngInject */
    function InicioControlador($log, tblsServicios, $timeout, $http, alertasServicios, $scope, $location,
                               urlArchivos, $rootScope) {
        /* jshint validthis: true */
        var inicioCtrl = this;

        inicioCtrl.viewCarrucel = false;
        /** Obtener configuracion de Tabla **/
        inicioCtrl.tblTokens = tblsServicios.getTabla('tblsGenerales', 'tblTokens');
        inicioCtrl.urlImagenes = urlArchivos;
        $rootScope.ocultarBuscarMenuSuperior = false;

        /** Funciones del Controlador **/
        activarControlador();

        function activarControlador() {

        }

    }
})();
