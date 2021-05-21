(function () {
    'use strict';

    angular
        .module('app')
        .controller('Promocion', Promocion);

    Promocion.$inject = [ '$log', 'tblsServicios' , 'serviciosRest', 'urlArchivos', 'alertasServicios'];

    function Promocion( $log, tblsServicios, serviciosRest, urlArchivos, alertasServicios) {

        /* jshint validthis: true */
        var promocionCtrl = this;

        promocionCtrl.cbxCategoria = {
            placeholder: "Seleccione",
            dataTextField: "nombreCategoria",
            dataValueField: "idCategoria"
        };

        promocionCtrl.cbxProducto = {
            placeholder: "Seleccione",
            dataTextField: "nombreProducto",
            dataValueField: "idProducto"
        };

        promocionCtrl.tblPromociones = tblsServicios.getTabla('tblsGenerales', 'tblPromociones');


        activarControlador();
        promocionCtrl.seleccionarPromociones = seleccionarPromociones;
        promocionCtrl.agregarPromociones = agregarPromociones;
        promocionCtrl.editarPromociones = editarPromociones;
        promocionCtrl.noHaCambiado = noHaCambiado;
        promocionCtrl.eliminarPromociones = eliminarPromociones;
        promocionCtrl.consultarProductosFront = consultarProductosFront;

        promocionCtrl.nuevaPromocion = {};

        function activarControlador() {
            consultarCategorias();
        }

        function consultarCategorias() {
            var mapa = new Object();
            var promesa = serviciosRest.getCategorias(mapa).$promise;
            promesa.then(function (respuesta) {
                promocionCtrl.categorias =  respuesta;
                consultarProductos();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function consultarProductosFront(idCategoria) {
            var mapa = {
                pnIdGenerico: idCategoria
            };
            var promesa = serviciosRest.getProductosActivos(mapa).$promise;
            promesa.then(function (respuesta) {
                promocionCtrl.productos =  respuesta;
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function consultarProductos() {
            var promesa = serviciosRest.getProductos({}).$promise;
            promesa.then(function (respuesta) {
                promocionCtrl.productosList =  respuesta;
                consultarPromociones();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function consultarPromociones(nombre, nomImagen) {
            promocionCtrl.promociones = [];
            promocionCtrl.promocionesSeleccionado = null;
            var mapa = new Object();
            var promesa = serviciosRest.getPromociones(mapa).$promise;
            promesa.then(function (respuesta) {
                angular.forEach(respuesta, function (promo) {
                    promo.urlImagen = urlArchivos + "promociones/" + promo.idPromocion + "/" + promo.imagen;
                    if(nombre && nomImagen && promo.nombrePromocion == nombre && promo.imagen == nomImagen) {
                        crudArchivoGenerico(promo.idPromocion);
                    }
                    var index = _.findIndex(promocionCtrl.productosList, function (person) {
                        return person.idProducto == promo.idProducto;
                    });
                    if (index >= 0) {
                        promo.descripcionProducto = promocionCtrl.productosList[index].nombreProducto;
                        var indexC = _.findIndex(promocionCtrl.categorias, function (persons) {
                            return persons.idCategoria == promocionCtrl.productosList[index].idCategoria;
                        });
                        console.log(indexC);
                        console.log(indexC);
                        if (indexC >= 0) {
                            promo.idCategoria = promocionCtrl.categorias[indexC].idCategoria;
                            promo.descripcionCategoria = promocionCtrl.categorias[indexC].nombreCategoria;
                        }
                    }

                });
                promocionCtrl.promociones =  respuesta;
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function seleccionarPromociones(row) {
            promocionCtrl.promocionesSeleccionado = row;
            promocionCtrl.promocionesEditable = angular.copy(promocionCtrl.promocionesSeleccionado);
            promocionCtrl.imagenRow = [ {thumb: row.urlImagen, img: row.urlImagen, nombre: row.imagen} ];
            consultarProductosFront(promocionCtrl.promocionesSeleccionado.idCategoria);
        }

        function agregarPromociones() {

            var nameImagen = angular.copy(promocionCtrl.archivoPromocion.name);
            var nombrePromocion = angular.copy(promocionCtrl.nuevaPromocion.nombrePromocion);

            var mapa = 0 + ",";
            mapa += promocionCtrl.nuevaPromocion.orden + ",";
            mapa += promocionCtrl.nuevaPromocion.nombrePromocion + ",";
            mapa += promocionCtrl.nuevaPromocion.descripcion + ",";
            mapa += (promocionCtrl.archivoPromocion?promocionCtrl.archivoPromocion.name:"SN") + ",";
            mapa += (promocionCtrl.nuevaPromocion.idVigente?promocionCtrl.nuevaPromocion.idVigente:'N') + ",";
            mapa += (promocionCtrl.nuevaPromocion.idProducto?promocionCtrl.nuevaPromocion.idProducto:null);
            var datosMapa = {
                pcAccion:  "INSERT",
                pcTextoAdd:  mapa
            };

            var promesa = serviciosRest.crudTblPromocion(datosMapa).$promise;
            promesa.then(function (respuesta) {
                promocionCtrl.nuevaPromocion = {};
                promocionCtrl.idProducto = null;
                promocionCtrl.idCategoria = null;
                consultarPromociones(nombrePromocion, nameImagen);
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });


        }

        function editarPromociones() {
            var mapa = "";

            if( promocionCtrl.promocionesSeleccionado.orden != promocionCtrl.promocionesEditable.orden) {
                mapa += "ORDEN::N&" + (promocionCtrl.promocionesEditable.orden?promocionCtrl.promocionesEditable.orden:null) + "|" ;
            }
            if( promocionCtrl.promocionesEditable.nombrePromocion != promocionCtrl.promocionesEditable.nombrePromocion) {
                mapa += "NOMBREPROMOCION::S&" + (promocionCtrl.promocionesEditable.nombrePromocion?promocionCtrl.promocionesEditable.nombrePromocion:null) + "|";
            }
            if( promocionCtrl.promocionesSeleccionado.descripcion != promocionCtrl.promocionesEditable.descripcion) {
                mapa += "DESCRIPCION::S&" + (promocionCtrl.promocionesEditable.descripcion?promocionCtrl.promocionesEditable.descripcion:null) + "|";
            }
            if( promocionCtrl.promocionesSeleccionado.indVigente != promocionCtrl.promocionesEditable.indVigente) {
                mapa += "INDVIGENTE::S&" + (promocionCtrl.promocionesEditable.indVigente?promocionCtrl.promocionesEditable.indVigente:null) + "|";
            }
            if( promocionCtrl.promocionesSeleccionado.idProducto != promocionCtrl.promocionesEditable.idProducto) {
                mapa += "ID_PRODUCTO::N&" + (promocionCtrl.promocionesEditable.idProducto?promocionCtrl.promocionesEditable.idProducto:null) + "|";
            }

            if(promocionCtrl.archivoPromocionE){
                mapa += "IMAGEN::S&" + promocionCtrl.archivoPromocionE.name;
            }

            var datosMapa = {
                pcAccion:  "UPDATE",
                pcTextoEdit: mapa,
                pnIdUsuario: promocionCtrl.promocionesSeleccionado.idPromocion
            };
            var idPromo = angular.copy(promocionCtrl.promocionesSeleccionado);

            var promesa = serviciosRest.crudTblPromocion(datosMapa).$promise;
            promesa.then(function (respuesta) {
                promocionCtrl.promocionesSeleccionado = null;
                if(promocionCtrl.archivoPromocionE){
                    var ruta = "promociones/" + idPromo.idPromocion + "/" + idPromo.imagen;
                    var promesaArchivo = serviciosRest.subirArchivoGenerico(ruta, null, 'delete');
                    promesaArchivo.then(function (respuesta) {
                        crudArchivoGenerico(idPromo.idPromocion);
                    });
                    promesaArchivo.catch(function (respuesta) {
                        alertasServicios.desplegarMensaje(error);
                    });
                }
                consultarPromociones();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });

        }

        function noHaCambiado() {
            return !angular.equals(promocionCtrl.promocionesSeleccionado, promocionCtrl.promocionesEditable)
        }

        function eliminarPromociones() {
            var datosMapa = {
                pcAccion:  "DELETE",
                pnIdUsuario: promocionCtrl.promocionesSeleccionado.idPromocion
            };
            var promesa = serviciosRest.crudTblPromocion(datosMapa).$promise;
            promesa.then(function (respuesta) {

                var ruta = "promociones/" + promocionCtrl.promocionesSeleccionado.idPromocion + "/" + promocionCtrl.promocionesSeleccionado.imagen;
                var promesaArchivo = serviciosRest.subirArchivoGenerico(ruta, null, 'delete');
                promesaArchivo.then(function (respuesta) {
                    promocionCtrl.promocionesSeleccionado = null;
                    crudArchivoGenerico();
                });
                promesaArchivo.catch(function (respuesta) {
                    alertasServicios.desplegarMensaje(error);
                });


            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }


       function crudArchivoGenerico(idPromocion) {
           var ruta = "promociones/" + idPromocion + "/" ;
           var promesaArchivo = serviciosRest.subirArchivoGenerico(ruta, (promocionCtrl.archivoPromocion?promocionCtrl.archivoPromocion:promocionCtrl.archivoPromocionE), 'insert');
           promesaArchivo.then(function (respuesta) {
               promocionCtrl.archivoPromocion = null;
               promocionCtrl.archivoPromocionE = null;
           });
           promesaArchivo.catch(function (respuesta) {
               alertasServicios.desplegarMensaje(error);
           });
       }

    }
})();
