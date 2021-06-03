(function () {
    'use strict';

    angular
        .module('app')
        .controller('CiudadController', CiudadController);

    CiudadController.$inject = [ '$log', 'tblsServicios' , 'serviciosRest', '$timeout', 'alertasServicios'];

    function CiudadController( $log, tblsServicios, serviciosRest, $timeout, alertasServicios) {

        /* jshint validthis: true */
        var ciudadCtrl = this;

        /* Rutas de Modales */
        ciudadCtrl.mdlCiudadA = "Modulos/AdministracionDatos/Ciudad/modals/mdlCiudadA.html";
        ciudadCtrl.mdlCiudadB = "Modulos/AdministracionDatos/Ciudad/modals/mdlCiudadB.html";
        ciudadCtrl.mdlCiudadM = "Modulos/AdministracionDatos/Ciudad/modals/mdlCiudadM.html";

        ciudadCtrl.cbxCategoria = {
            placeholder: "Seleccione",
            dataTextField: "nombreCategoria",
            dataValueField: "idCategoria"
        };

        ciudadCtrl.tblCiudad = tblsServicios.getTabla('tblsGenerales', 'tblCiudad');
        ciudadCtrl.listDatosCiudads = [];
        ciudadCtrl.listDatosCiudadsTbl = false;
        ciudadCtrl.nuevoCiudad = {};

        activarControlador();
        ciudadCtrl.seleccionarCiudad = seleccionarCiudad;
        ciudadCtrl.insertarCiudad = insertarCiudad;
        ciudadCtrl.editarCiudad = editarCiudad;
        ciudadCtrl.eliminarCiudad = eliminarCiudad;


        function activarControlador() {
            consultarCiudades();
            $timeout(function () {
                ciudadCtrl.listDatosCiudadsTbl = true;
            })
        }

        function consultarCiudades() {
            ciudadCtrl.listDatosCiudads = [];
            ciudadCtrl.ciudadSeleccionado = null;
            var mapa = { };
            var promesa = serviciosRest.consultaGenerica('consultaCiudad', mapa);
            promesa.then(function (response) {
                var respuesta = JSON.parse(response.data+"}");
                if(respuesta && respuesta.datos.length > 0) {
                    ciudadCtrl.listDatosCiudads = respuesta.datos;
                }
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function seleccionarCiudad(row) {
            ciudadCtrl.ciudadSeleccionado = row;
            ciudadCtrl.ciudadEditable = angular.copy(ciudadCtrl.ciudadSeleccionado);
        }

        function insertarCiudad() {
            var mapa = {
                accion: 'INSERT',
                nombre: ciudadCtrl.nuevoCiudad.nombre,
                continente: ciudadCtrl.nuevoCiudad.continente,
            };
            var promesa = serviciosRest.crud('crudCiudad', mapa);
            promesa.then(function (response) {
                console.log(response);
                if(response && response.data) {
                    //var respuesta = JSON.parse(response.data); //JSON CON EL ID INSERTADO
                    ciudadCtrl.nuevoCiudad = {};
                    angular.element("#mdlCiudadA").modal('hide');
                    consultarCiudades();
                }
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function editarCiudad() {
            var mapa = {
                accion: 'UPDATE',
                id: ciudadCtrl.ciudadSeleccionado.id,
                nombre: ciudadCtrl.ciudadEditable.nombre,
                continente: ciudadCtrl.ciudadEditable.continente,
            };
            var promesa = serviciosRest.crud('crudCiudad', mapa);
            promesa.then(function (response) {
                console.log(response);
                console.log(response);
                console.log(response);
                angular.element("#mdlCiudadM").modal('hide');
                consultarCiudades();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function eliminarCiudad() {
            var mapa = {
                accion: 'DELETE',
                id: ciudadCtrl.ciudadSeleccionado.id
            };
            var promesa = serviciosRest.crud('crudCiudad', mapa);
            promesa.then(function (response) {
                angular.element("#mdlCiudadB").modal('hide');
                consultarCiudades();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

    }
})();
