(function () {
    'use strict';

    angular
        .module('app')
        .controller('AutorController', AutorController);

    AutorController.$inject = [ '$log', 'tblsServicios' , 'serviciosRest', '$timeout', 'alertasServicios'];

    function AutorController( $log, tblsServicios, serviciosRest, $timeout, alertasServicios) {

        /* jshint validthis: true */
        var autorCtrl = this;

        /* Rutas de Modales */
        autorCtrl.mdlAutorA = "Modulos/AdministracionDatos/Autor/modals/mdlAutorA.html";
        autorCtrl.mdlAutorB = "Modulos/AdministracionDatos/Autor/modals/mdlAutorB.html";
        autorCtrl.mdlAutorM = "Modulos/AdministracionDatos/Autor/modals/mdlAutorM.html";

        autorCtrl.cbxCategoria = {
            placeholder: "Seleccione",
            dataTextField: "nombreCategoria",
            dataValueField: "idCategoria"
        };

        autorCtrl.tblAutor = tblsServicios.getTabla('tblsGenerales', 'tblAutor');
        autorCtrl.listDatosAutores = [];
        autorCtrl.listDatosAutoresTbl = false;
        autorCtrl.nuevoAutor = {};

        activarControlador();
        autorCtrl.seleccionarAutor = seleccionarAutor;
        autorCtrl.insertarAutor = insertarAutor;
        autorCtrl.editarAutor = editarAutor;
        autorCtrl.eliminarAutor = eliminarAutor;


        function activarControlador() {
            consultarAutores();
            $timeout(function () {
                autorCtrl.listDatosAutoresTbl = true;
            })
        }

        function consultarAutores() {
            autorCtrl.listDatosAutores = [];
            autorCtrl.autorSeleccionado = null;
            var mapa = { };
            var promesa = serviciosRest.consultaGenerica('consultaActor', mapa);
            promesa.then(function (response) {
                var respuesta = JSON.parse(response.data+"}");
                if(respuesta && respuesta.datos.length > 0) {
                    autorCtrl.listDatosAutores = respuesta.datos;
                }
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function seleccionarAutor(row) {
            autorCtrl.autorSeleccionado = row;
            autorCtrl.autorEditable = angular.copy(autorCtrl.autorSeleccionado);
        }

        function insertarAutor() {
            var mapa = {
                accion: 'INSERT',
                nombre: autorCtrl.nuevoAutor.nombre,
                nacionalidad: autorCtrl.nuevoAutor.nacionalidad,
            };
            var promesa = serviciosRest.crud('crudAutor', mapa);
            promesa.then(function (response) {
                console.log(response);
                if(response && response.data) {
                    //var respuesta = JSON.parse(response.data); //JSON CON EL ID INSERTADO
                    autorCtrl.nuevoAutor = {};
                    angular.element("#mdlAutorA").modal('hide');
                    consultarAutores();
                }
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function editarAutor() {
            var mapa = {
                accion: 'UPDATE',
                id: autorCtrl.autorSeleccionado.id,
                nombre: autorCtrl.autorEditable.nombre,
                nacionalidad: autorCtrl.autorEditable.nacionalidad,
            };
            var promesa = serviciosRest.crud('crudAutor', mapa);
            promesa.then(function (response) {
                console.log(response);
                console.log(response);
                console.log(response);
                angular.element("#mdlAutorM").modal('hide');
                consultarAutores();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function eliminarAutor() {
            var mapa = {
                accion: 'DELETE',
                id: autorCtrl.autorSeleccionado.id
            };
            var promesa = serviciosRest.crud('crudAutor', mapa);
            promesa.then(function (response) {
                angular.element("#mdlAutorB").modal('hide');
                consultarAutores();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

    }
})();
