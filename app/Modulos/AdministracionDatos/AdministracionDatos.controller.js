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
            /*if(!$rootScope.usuarioSesion || $rootScope.usuarioSesion.tipoUsuario != 'A') {
                alertasServicios.desplegarMensaje("Tú no puedes acceder a esta opción no eres un adminsitrador de sistema");
                $timeout(function () {
                    $location.path('/inicio');
                }, 500)
            } else {
                administracionDatosCtrl.mostrarSecciones = true;
                administracionDatosCtrl.tabSeleccionada = 1;
            }*/
            administracionDatosCtrl.mostrarSecciones = true;
            administracionDatosCtrl.tabSeleccionada = 1;
        }

    }
})();
