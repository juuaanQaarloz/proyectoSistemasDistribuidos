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

        activarControlador();
        autorCtrl.seleccionarAutor = seleccionarAutor;
        autorCtrl.insertarAutor = insertarAutor;
        autorCtrl.editarAutor = editarAutor;


        function activarControlador() {
            consultarAutores();
            $timeout(function () {
                autorCtrl.listDatosAutoresTbl = true;
            })
        }

        function consultarAutores() {
            autorCtrl.listDatosAutores = [];
            var mapa = {};
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
        }

        function insertarAutor() {
            angular.element("#mdlConfirmaCerrarSesion").modal('hide');
        }

        function editarAutor() {
            angular.element("#mdlConfirmaCerrarSesion").modal('hide');
        }

    }
})();
