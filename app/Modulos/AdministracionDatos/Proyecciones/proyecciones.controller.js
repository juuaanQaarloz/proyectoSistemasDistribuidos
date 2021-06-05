(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProyeccionesController', ProyeccionesController);

    ProyeccionesController.$inject = [ '$log', 'tblsServicios' , 'serviciosRest', '$timeout', 'alertasServicios'];

    function ProyeccionesController( $log, tblsServicios, serviciosRest, $timeout, alertasServicios) {

        /* jshint validthis: true */
        var proyeccionCtrl = this;

        /* Rutas de Modales */
        proyeccionCtrl.mdlProyeccionesA = "Modulos/AdministracionDatos/Proyecciones/modals/mdlProyeccionesA.html";
        proyeccionCtrl.mdlProyeccionesB = "Modulos/AdministracionDatos/Proyecciones/modals/mdlProyeccionesB.html";
        proyeccionCtrl.mdlProyeccionesM = "Modulos/AdministracionDatos/Proyecciones/modals/mdlProyeccionesM.html";

        proyeccionCtrl.cbxCategoria = {
            placeholder: "Seleccione",
            dataTextField: "nombreCategoria",
            dataValueField: "idCategoria"
        };

        proyeccionCtrl.tblProyecciones = tblsServicios.getTabla('tblsGenerales', 'tblProyecciones');

        proyeccionCtrl.listDatosProyeccioness = [];
        proyeccionCtrl.listDatosProyeccionessTbl = false;
        proyeccionCtrl.nuevoProyecciones = {};

        activarControlador();
        proyeccionCtrl.seleccionarProyecciones = seleccionarProyecciones;
        proyeccionCtrl.insertarProyecciones = insertarProyecciones;
        proyeccionCtrl.editarProyecciones = editarProyecciones;
        proyeccionCtrl.eliminarProyecciones = eliminarProyecciones;


        function activarControlador() {
            consultarProyecciones();
            $timeout(function () {
                proyeccionCtrl.listDatosProyeccionessTbl = true;
            })
        }

        function consultarProyecciones() {
            proyeccionCtrl.listDatosProyeccioness = [];
            proyeccionCtrl.proyeccionSeleccionado = null;
            var mapa = { };
            var promesa = serviciosRest.consultaGenerica('consultaProyecciones', mapa);
            promesa.then(function (response) {
                var respuesta = JSON.parse(response.data+"}");
                if(respuesta && respuesta.datos.length > 0) {
                    proyeccionCtrl.listDatosProyeccioness = respuesta.datos;
                }
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function seleccionarProyecciones(row) {
            proyeccionCtrl.proyeccionSeleccionado = row;
            proyeccionCtrl.proyeccionEditable = angular.copy(proyeccionCtrl.proyeccionSeleccionado);
        }

        function insertarProyecciones() {
            var mapa = {
                accion: 'INSERT',
                nombre: proyeccionCtrl.nuevoProyecciones.nombre,
                direccion: proyeccionCtrl.nuevoProyecciones.direccion,
            };
            var promesa = serviciosRest.crud('crudProyecciones', mapa);
            promesa.then(function (response) {
                console.log(response);
                if(response && response.data) {
                    //var respuesta = JSON.parse(response.data); //JSON CON EL ID INSERTADO
                    proyeccionCtrl.nuevoProyecciones = {};
                    angular.element("#mdlProyeccionesA").modal('hide');
                    consultarProyecciones();
                }
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function editarProyecciones() {
            var mapa = {
                accion: 'UPDATE',
                id: proyeccionCtrl.proyeccionSeleccionado.id,
                nombre: proyeccionCtrl.proyeccionEditable.nombre,
                direccion: proyeccionCtrl.proyeccionEditable.direccion,
            };
            var promesa = serviciosRest.crud('crudProyecciones', mapa);
            promesa.then(function (response) {
                console.log(response);
                console.log(response);
                console.log(response);
                angular.element("#mdlProyeccionesM").modal('hide');
                consultarProyecciones();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function eliminarProyecciones() {
            var mapa = {
                accion: 'DELETE',
                id: proyeccionCtrl.proyeccionSeleccionado.id
            };
            var promesa = serviciosRest.crud('crudProyecciones', mapa);
            promesa.then(function (response) {
                angular.element("#mdlProyeccionesB").modal('hide');
                consultarProyecciones();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

    }
})();
