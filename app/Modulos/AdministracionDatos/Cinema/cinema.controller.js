(function () {
    'use strict';

    angular
        .module('app')
        .controller('CinemaController', CinemaController);

    CinemaController.$inject = [ '$log', 'tblsServicios' , 'serviciosRest', '$timeout', 'alertasServicios'];

    function CinemaController( $log, tblsServicios, serviciosRest, $timeout, alertasServicios) {

        /* jshint validthis: true */
        var cinemaCtrl = this;

        /* Rutas de Modales */
        cinemaCtrl.mdlCinemaA = "Modulos/AdministracionDatos/Cinema/modals/mdlCinemaA.html";
        cinemaCtrl.mdlCinemaB = "Modulos/AdministracionDatos/Cinema/modals/mdlCinemaB.html";
        cinemaCtrl.mdlCinemaM = "Modulos/AdministracionDatos/Cinema/modals/mdlCinemaM.html";

        cinemaCtrl.cbxCategoria = {
            placeholder: "Seleccione",
            dataTextField: "nombreCategoria",
            dataValueField: "idCategoria"
        };

        cinemaCtrl.tblCinema = tblsServicios.getTabla('tblsGenerales', 'tblCinema');
        cinemaCtrl.listDatosCinemas = [];
        cinemaCtrl.listDatosCinemasTbl = false;
        cinemaCtrl.nuevoCinema = {};

        activarControlador();
        cinemaCtrl.seleccionarCinema = seleccionarCinema;
        cinemaCtrl.insertarCinema = insertarCinema;
        cinemaCtrl.editarCinema = editarCinema;
        cinemaCtrl.eliminarCinema = eliminarCinema;


        function activarControlador() {
            consultarCinemaes();
            $timeout(function () {
                cinemaCtrl.listDatosCinemasTbl = true;
            })
        }

        function consultarCinemaes() {
            cinemaCtrl.listDatosCinemas = [];
            cinemaCtrl.cinemaSeleccionado = null;
            var mapa = { };
            var promesa = serviciosRest.consultaGenerica('consultaCinema', mapa);
            promesa.then(function (response) {
                var respuesta = JSON.parse(response.data+"}");
                if(respuesta && respuesta.datos.length > 0) {
                    cinemaCtrl.listDatosCinemas = respuesta.datos;
                }
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function seleccionarCinema(row) {
            cinemaCtrl.cinemaSeleccionado = row;
            cinemaCtrl.cinemaEditable = angular.copy(cinemaCtrl.cinemaSeleccionado);
        }

        function insertarCinema() {
            var mapa = {
                accion: 'INSERT',
                nombre: cinemaCtrl.nuevoCinema.nombre,
                direccion: cinemaCtrl.nuevoCinema.direccion,
            };
            var promesa = serviciosRest.crud('crudCinema', mapa);
            promesa.then(function (response) {
                console.log(response);
                if(response && response.data) {
                    //var respuesta = JSON.parse(response.data); //JSON CON EL ID INSERTADO
                    cinemaCtrl.nuevoCinema = {};
                    angular.element("#mdlCinemaA").modal('hide');
                    consultarCinemaes();
                }
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function editarCinema() {
            var mapa = {
                accion: 'UPDATE',
                id: cinemaCtrl.cinemaSeleccionado.id,
                nombre: cinemaCtrl.cinemaEditable.nombre,
                direccion: cinemaCtrl.cinemaEditable.direccion,
            };
            var promesa = serviciosRest.crud('crudCinema', mapa);
            promesa.then(function (response) {
                console.log(response);
                console.log(response);
                console.log(response);
                angular.element("#mdlCinemaM").modal('hide');
                consultarCinemaes();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function eliminarCinema() {
            var mapa = {
                accion: 'DELETE',
                id: cinemaCtrl.cinemaSeleccionado.id
            };
            var promesa = serviciosRest.crud('crudCinema', mapa);
            promesa.then(function (response) {
                angular.element("#mdlCinemaB").modal('hide');
                consultarCinemaes();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

    }
})();
