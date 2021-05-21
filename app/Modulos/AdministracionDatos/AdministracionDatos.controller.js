(function () {
    'use strict';

    angular
        .module('app')
        .controller('AdministracionDatos', AdministracionDatos);

    AdministracionDatos.$inject = [ '$log', '$location', '$rootScope', '$timeout', 'alertasServicios' ];

    function AdministracionDatos( $log, $location, $rootScope, $timeout, alertasServicios ) {

        /* jshint validthis: true */
        var administracionDatosCtrl = this;
        $rootScope.ocultarBuscarMenuSuperior = false;
        administracionDatosCtrl.mostrarSecciones = false;

        activarControlador();

        function activarControlador() {
            administracionDatosCtrl.mostrarSecciones = true;
            administracionDatosCtrl.tabSeleccionada = 1;
        }

    }
})();
