(function () {
    'use strict';
    angular
        .module('app')
        .config(configuracion);

    configuracion.$inject = ['$routeProvider'];
    /* @ngInject */
    function configuracion($routeProvider) {

        $routeProvider.when('/', {templateUrl: 'Modulos/Acceso/inicio/inicio.html'});

        $routeProvider.when('/inicio', {templateUrl: 'Modulos/Acceso/inicio/inicio.html'});

        $routeProvider.when('/mntAdministracionDatos', {
            templateUrl: 'Modulos/AdministracionDatos/AdministracionDatos.html',
            controller: 'AdministracionDatos',
            controllerAs: 'administracionDatosCtrl'
        });

        $routeProvider.when('/producto', {
            templateUrl: 'Modulos/Ventas/Productos/Productos.html',
            controller: 'Productos',
            controllerAs: 'productoCtrl'
        });

        $routeProvider.when('/venta', {
            templateUrl: 'Modulos/Ventas/Venta/Venta.html',
            controller: 'Venta',
            controllerAs: 'ventaCtrl'
        });

        $routeProvider.otherwise({redirectTo: '/inicio'});

    };
})();
