(function () {
    'use strict';

    angular
        .module('app')
        .controller('Usuario', Usuario);

    Usuario.$inject = [ '$log', 'tblsServicios', '$filter', 'serviciosRest' ];

    function Usuario( $log, tblsServicios, $filter, serviciosRest ) {

        /* jshint validthis: true */
        var usuarioCtrl = this;

        usuarioCtrl.cbxTipoUsuario = {
            placeholder: "Seleccione",
            dataTextField: "tipo",
            dataValueField: "idTipo"
        };

        usuarioCtrl.tiposdeUsuario = [
            {tipo: "Administrador de Pagina", idTipo: "A"},
            {tipo: "Comprador", idTipo: "C"}
        ];

        /** Obtener configuracion de Tabla **/
        usuarioCtrl.tblUsuarios = tblsServicios.getTabla('tblsGenerales', 'tblUsuarios');

        usuarioCtrl.seleccionarUsuario = seleccionarUsuario;
        usuarioCtrl.agregarUsuario = agregarUsuario;
        usuarioCtrl.editarUsuario = editarUsuario;
        usuarioCtrl.noHaCambiado = noHaCambiado;
        usuarioCtrl.eliminarUsuario = eliminarUsuario;

        usuarioCtrl.nuevoUsr = {};

        activarControlador();

        function activarControlador() {
            usuarioCtrl.usuarios = [];
            var promesa = serviciosRest.getUsuarios({}).$promise;
            promesa.then(function (respuesta) {
                if(respuesta.length > 0) {
                    usuarioCtrl.usuarios = respuesta;
                }
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }


        function seleccionarUsuario(row) {
            usuarioCtrl.usuarioSeleccionado = row;
            usuarioCtrl.usuarioEditable = angular.copy(usuarioCtrl.usuarioSeleccionado);
        }

        function agregarUsuario() {
            var mapa = 0 + ",";
            mapa += "17/01/2021" + ",";
            mapa += usuarioCtrl.nuevoUsr.nombre + ",";
            mapa += usuarioCtrl.nuevoUsr.eMail + ",";
            mapa += usuarioCtrl.nuevoUsr.clave + ",";
            mapa += usuarioCtrl.nuevoUsr.tipoUsuario + ",";
            mapa += (usuarioCtrl.nuevoUsr.calle?usuarioCtrl.nuevoUsr.calle:null) + ",";
            mapa += (usuarioCtrl.nuevoUsr.noExterior?usuarioCtrl.nuevoUsr.noExterior:null) + ",";
            mapa += (usuarioCtrl.nuevoUsr.noInterior?usuarioCtrl.nuevoUsr.noInterior:null) + ",";
            mapa += (usuarioCtrl.nuevoUsr.codigoPostal?usuarioCtrl.nuevoUsr.codigoPostal:null) + ",";
            mapa += (usuarioCtrl.nuevoUsr.colonia?usuarioCtrl.nuevoUsr.colonia:null) + ",";
            mapa += (usuarioCtrl.nuevoUsr.municipio?usuarioCtrl.nuevoUsr.municipio:null) + ",";
            mapa += (usuarioCtrl.nuevoUsr.ciudad?usuarioCtrl.nuevoUsr.ciudad:null) + ",";
            mapa += (usuarioCtrl.nuevoUsr.estado?usuarioCtrl.nuevoUsr.estado:null) + ",";
            mapa += (usuarioCtrl.nuevoUsr.pais?usuarioCtrl.nuevoUsr.pais:null) + ",";
            mapa += usuarioCtrl.nuevoUsr.referencias;
            var datosMapa = {
                pcAccion:  "INSERT",
                pcTextoAdd:  mapa
            };

            var promesa = serviciosRest.crudTblUsuario(datosMapa).$promise;
            promesa.then(function (respuesta) {
                usuarioCtrl.nuevoUsr = {};
                usuarioCtrl.tipoUsuario = null;
                activarControlador();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function editarUsuario() {
             var mapa = "";

             if( usuarioCtrl.usuarioSeleccionado.nombreUsuario != usuarioCtrl.usuarioEditable.nombreUsuario) {
                mapa += "NOMBRE::S&" + usuarioCtrl.usuarioEditable.nombreUsuario + "|" ;
             }

             if( usuarioCtrl.usuarioSeleccionado.password != usuarioCtrl.usuarioEditable.password) {
                mapa += "PASSWORD::S&" + usuarioCtrl.usuarioEditable.password + "|";
             }

             if( usuarioCtrl.usuarioSeleccionado.tipoUsuario != usuarioCtrl.usuarioEditable.tipoUsuario) {
                mapa += "TIPOUSUARIO::S&" + usuarioCtrl.usuarioEditable.tipoUsuario + "|";
             }

             if( usuarioCtrl.usuarioSeleccionado.calle != usuarioCtrl.usuarioEditable.calle) {
                mapa += "CALLE::S&" + (usuarioCtrl.usuarioEditable.calle?usuarioCtrl.usuarioEditable.calle:null) + "|";
             }

             if( usuarioCtrl.usuarioSeleccionado.noExt != usuarioCtrl.usuarioEditable.noExt) {
                mapa += "NOEXT::S&" + (usuarioCtrl.usuarioEditable.noExt?usuarioCtrl.usuarioEditable.noExt:null) + "|";
             }
             if( usuarioCtrl.usuarioSeleccionado.noInt != usuarioCtrl.usuarioEditable.noInt) {
                mapa += "NOINT::S&" + (usuarioCtrl.usuarioEditable.noInt?usuarioCtrl.usuarioEditable.noInt:null) + "|";
             }
             if( usuarioCtrl.usuarioSeleccionado.codPos != usuarioCtrl.usuarioEditable.codPos) {
                mapa += "CODPOS::S&" + (usuarioCtrl.usuarioEditable.codPos?usuarioCtrl.usuarioEditable.codPos:null) + "|";
             }
             if( usuarioCtrl.usuarioSeleccionado.colonia != usuarioCtrl.usuarioEditable.colonia) {
                mapa += "COLONIA::S&" + (usuarioCtrl.usuarioEditable.colonia?usuarioCtrl.usuarioEditable.colonia:null) + "|";
             }
             if( usuarioCtrl.usuarioSeleccionado.ciudad != usuarioCtrl.usuarioEditable.ciudad) {
                mapa += "MUNICIPIO::S&" + (usuarioCtrl.usuarioEditable.ciudad?usuarioCtrl.usuarioEditable.ciudad:null) + "|";
             }
             if( usuarioCtrl.usuarioSeleccionado.municipio != usuarioCtrl.usuarioEditable.municipio) {
                mapa += "CIUDAD::S&" + (usuarioCtrl.usuarioEditable.municipio?usuarioCtrl.usuarioEditable.municipio:null) + "|";
             }
             if( usuarioCtrl.usuarioSeleccionado.estado != usuarioCtrl.usuarioEditable.estado) {
                mapa += "ESTADO::S&" + (usuarioCtrl.usuarioEditable.estado?usuarioCtrl.usuarioEditable.estado:null) + "|";
             }
             if( usuarioCtrl.usuarioSeleccionado.pais != usuarioCtrl.usuarioEditable.pais) {
                mapa += "PAIS::S&" + (usuarioCtrl.usuarioEditable.pais?usuarioCtrl.usuarioEditable.pais:null) + "|";
             }
             if( usuarioCtrl.usuarioSeleccionado.referencia != usuarioCtrl.usuarioEditable.referencia) {
                mapa += "REFERENCIA::S&" + (usuarioCtrl.usuarioEditable.referencia?usuarioCtrl.usuarioEditable.referencia:null);
             }


            var datosMapa = {
                pcAccion:  "UPDATE",
                pcTextoEdit: mapa,
                pnIdUsuario: usuarioCtrl.usuarioSeleccionado.idUsuario
            };

            var promesa = serviciosRest.crudTblUsuario(datosMapa).$promise;
            promesa.then(function (respuesta) {
                usuarioCtrl.usuarioSeleccionado = null;
                activarControlador();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }
        
        function noHaCambiado() {
            return !angular.equals(usuarioCtrl.usuarioSeleccionado, usuarioCtrl.usuarioEditable)
        }

        function eliminarUsuario() {
            var datosMapa = {
                pcAccion:  "DELETE",
                pnIdUsuario: usuarioCtrl.usuarioSeleccionado.idUsuario
            };

            var promesa = serviciosRest.crudTblUsuario(datosMapa).$promise;
            promesa.then(function (respuesta) {
                usuarioCtrl.usuarioSeleccionado = null;
                activarControlador();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

    }
})();
