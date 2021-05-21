(function () {
    'use strict';

    angular
        .module('app')
        .factory('serviciosRest', serviciosRest);

    serviciosRest.$inject = ['$http', '$log', '$window', '$resource', 'urlServicios'];

    /* @ngInject */
    function serviciosRest($http, $log, $window, $resource, urlServicios) {

        var store = $window.localStorage;
        var llave = 'at-finance';
        var producto = null;
        var productoCat = null;
        var usuarioSesion = null;
        var textoBuscar = null;

        var serviciosJava = $resource(urlServicios+'apiRest/:servicio', {servicio: "@servicio"}, {
            getUsuarios: {
                method: 'POST', isArray: 'true', headers: {'Content-Type': 'application/json'}
            },
            getCategorias: {
                method: 'POST', isArray: 'true', headers: {'Content-Type': 'application/json'}
            },
            getPromociones: {
                method: 'POST', isArray: 'true', headers: {'Content-Type': 'application/json'}
            },
            getPromocionesActivos: {
                method: 'POST', isArray: 'true', headers: {'Content-Type': 'application/json'}
            },
            getProductos: {
                method: 'POST', isArray: 'true', headers: {'Content-Type': 'application/json'}
            },
            getProductosActivos: {
                method: 'POST', isArray: 'true', headers: {'Content-Type': 'application/json'}
            },
            getVentas: {
                method: 'POST', isArray: 'true', headers: {'Content-Type': 'application/json'}
            },
            crudTblUsuario: {
                method: 'POST', headers: {'Content-Type': 'application/json'}
            },
            crudTblPromocion: {
                method: 'POST', headers: {'Content-Type': 'application/json'}
            },
            crudTblCategoria: {
                method: 'POST', headers: {'Content-Type': 'application/json'}
            },
            crudTblProducto: {
                method: 'POST', headers: {'Content-Type': 'application/json'}
            },
            crudTblVenta: {
                method: 'POST', headers: {'Content-Type': 'application/json'}
            }
        });

        var servicios = {
            setT: setT,
            validarDato: validarDato,
            setDatosProducto: setDatosProducto,
            getDatosProducto: getDatosProducto,
            getDatosSesion: getDatosSesion,
            setDatosSesion: setDatosSesion,
            subirArchivoGenerico: subirArchivoGenerico,
            getPromociones: getPromociones,
            getPromocionesActivos: getPromocionesActivos,
            getCategorias: getCategorias,
            getProductos: getProductos,
            getProductosActivos: getProductosActivos,
            getUsuarios: getUsuarios,
            getVentas: getVentas,
            crudTblUsuario: crudTblUsuario,
            crudTblPromocion: crudTblPromocion,
            crudTblCategoria: crudTblCategoria,
            crudTblProducto: crudTblProducto,
            setTextoBuscar: setTextoBuscar,
            getTextoBuscar: getTextoBuscar,
            setDatosProductoCat: setDatosProductoCat,
            getDatosProductoCat: getDatosProductoCat,
            crudTblVenta: crudTblVenta,
            replaceAll: replaceAll
        };
        return servicios;

        function setT(t) {
            if (t) {
                store.setItem(llave, t);
            } else {
                store.removeItem(llave);
            }
        };

        function setDatosProducto(prod) {
            producto = prod;
        }

        function getDatosProducto() {
            return producto;
        }
        function setDatosProductoCat(categoria) {
            productoCat = categoria;
        }

        function getDatosProductoCat() {
            return productoCat;
        }

        function setDatosSesion(usuario) {
            usuarioSesion = usuario;
        }

        function getDatosSesion() {
            return usuarioSesion;
        }

        function setTextoBuscar(texto) {
            textoBuscar = texto;
        }

        function getTextoBuscar() {
            return textoBuscar;
        }

        function getPromociones(parametros) {
            return serviciosJava.getPromociones({servicio: "getPromociones"}, parametros);
        }
        function getPromocionesActivos(parametros) {
            return serviciosJava.getPromocionesActivos({servicio: "getPromocionesActivos"}, parametros);
        }

        function getCategorias(parametros) {
            return serviciosJava.getCategorias({servicio: "getCategorias"}, parametros);
        }

        function getProductos(parametros) {
            return serviciosJava.getProductos({servicio: "getProductos"}, parametros);
        }

        function getProductosActivos(parametros) {
            return serviciosJava.getProductosActivos({servicio: "getProductosActivos"}, parametros);
        }

        function getVentas(parametros) {
            return serviciosJava.getVentas({servicio: "getVentas"}, parametros);
        }

        function getUsuarios(parametros) {
            return serviciosJava.getUsuarios({servicio: "getUsuarios"}, parametros);
        }
        function crudTblUsuario(parametros) {
            return serviciosJava.crudTblUsuario({servicio: "crudUsuarios"}, parametros);
        }
        function crudTblPromocion(parametros) {
            return serviciosJava.crudTblPromocion({servicio: "crudPromocion"}, parametros);
        }
        function crudTblCategoria(parametros) {
            return serviciosJava.crudTblCategoria({servicio: "crudCategoria"}, parametros);
        }
        function crudTblProducto(parametros) {
            return serviciosJava.crudTblProducto({servicio: "crudCatProducto"}, parametros);
        }
        function crudTblVenta(parametros) {
            return serviciosJava.crudTblVenta({servicio: "crudVenta"}, parametros);
        }


        function validarDato(valor) {
            var bandera = false;
            if (valor != undefined && valor != null && valor != '') {
                bandera = true;
            }
            return bandera;
        }


        function subirArchivoGenerico(ruta, imagen, metodo, codNodo) {
            var fd = new FormData();
            fd.append('ruta', ruta);
            fd.append('file', imagen);
            fd.append('metodo', metodo);
            return $http.post( urlServicios + 'apiRest/crudDoctoGeneral', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
        }

        function replaceAll(str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        }

    }
})();