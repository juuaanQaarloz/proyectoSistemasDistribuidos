(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @name eCommers.controller:MenuSuperiorControlador
     * @description
     * Definición del MenuSuperiorControlador en el modulo eCommers que da seguimiento a los accesos del sistema.
     */
    angular
        .module('app')
        .controller('MenuSuperiorControlador', MenuSuperiorControlador);

    MenuSuperiorControlador.$inject = ['$log', '$location', 'serviciosRest', '$timeout', 'alertasServicios', '$scope',
    '$rootScope', 'webStorage', 'tblsServicios'];

    /* @ngInject */
    function MenuSuperiorControlador($log, $location, serviciosRest, $timeout, alertasServicios, $scope, $rootScope,
                                     webStorage, tblsServicios) {
        /* jshint validthis: true */
        var menuSuperiorCtrl = this;

        menuSuperiorCtrl.usuarioSesion = null;
        $rootScope.ocultarBuscarMenuSuperior = false;

        menuSuperiorCtrl.tblMisProductoVenta = tblsServicios.getTabla('tblsGenerales', 'tblMisProductoVenta');

        menuSuperiorCtrl.cbxTipoUsuario = {
            placeholder: "Seleccione",
            dataTextField: "tipo",
            dataValueField: "idTipo"
        };
        menuSuperiorCtrl.tiposdeUsuario = [
            {tipo: "Comprador", idTipo: "C"}
        ];

        menuSuperiorCtrl.irAPortal = irAPortal;
        menuSuperiorCtrl.irAdminPantalla = irAdminPantalla;

        $scope.$watch('menuSuperiorCtrl.datosSesion', function (registro) {
            if(registro){
                menuSuperiorCtrl.usuarioSesion = registro;
            }
        }, true);

        activarControlador();

        function activarControlador() {
            var usuarioSesion = angular.copy(webStorage.session.get('ecommercejc.usuario'));
            $timeout(function () {
                if(usuarioSesion){
                    menuSuperiorCtrl.usuarioSesion = JSON.parse(usuarioSesion);
                    $rootScope.usuarioSesion = JSON.parse(usuarioSesion);
                }
            });
        }

        function irAPortal() {
            $location.path('/inicio');
        }

        function irAdminPantalla() {
            $location.path('/mntAdministracionDatos');
        }

    }
})();
