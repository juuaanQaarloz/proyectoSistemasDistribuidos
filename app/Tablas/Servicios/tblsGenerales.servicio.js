/**
 * Created by Rice on 2014-08-21.
 * @description Servicios que corresponden al modulo de tablas en el cual es encargado de obtener las configuraciones
 * de tables requeridas por cada modulo.
 */
(function () {
    angular.module('tablas')
        .factory('tblsGenerales', tblsGenerales);

    function tblsGenerales($log, tblTokens, tblUsuarios, tblPromociones, tblCategoria, tblProducto, tblProductoVenta,
                           tblMisProductoVenta) {

        var servicios = {
            getTabla: getTabla
        };

        return servicios;

        /*  S E R V I C I O S  D E  L A  F A B R I C A  */
        /**
         * @ngdoc function
         * @name getTabla
         * @module tablas
         * @param nombre
         * @description Funcion que obtiene la configuracion de la tabla
         * dependiendo del nombre.
         * @return config
         */
        function getTabla(nombre) {
            var config = undefined;
            if (nombre == 'tblTokens')
                config = tblTokens;
            else if (nombre == 'tblUsuarios')
                config = tblUsuarios;
            else if (nombre == 'tblPromociones')
                config = tblPromociones;
            else if (nombre == 'tblCategoria')
                config = tblCategoria;
            else if (nombre == 'tblProducto')
                config = tblProducto;
            else if (nombre == 'tblProductoVenta')
                config = tblProductoVenta;
            else if (nombre == 'tblMisProductoVenta')
                config = tblMisProductoVenta;
            else
                config = {};
            return config;
        }
    };
})();