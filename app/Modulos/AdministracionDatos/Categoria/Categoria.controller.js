(function () {
    'use strict';

    angular
        .module('app')
        .controller('Categoria', Categoria);

    Categoria.$inject = [ '$log', 'tblsServicios', 'urlArchivos', 'serviciosRest', 'alertasServicios' ];

    function Categoria( $log, tblsServicios, urlArchivos, serviciosRest, alertasServicios ) {

        /* jshint validthis: true */
        var categoriaCtrl = this;

        categoriaCtrl.tblCategorias = tblsServicios.getTabla('tblsGenerales', 'tblCategoria');
        categoriaCtrl.tblCategoriaProducto = tblsServicios.getTabla('tblsGenerales', 'tblProducto');

        categoriaCtrl.nuevoProducto = {};

        activarControlador();
        categoriaCtrl.seleccionarCategoria = seleccionarCategoria;
        categoriaCtrl.agregarCategoria = agregarCategoria;
        categoriaCtrl.editarCategoria = editarCategoria;
        categoriaCtrl.noHaCambiadoCategoria = noHaCambiadoCategoria;
        categoriaCtrl.eliminarCategoria = eliminarCategoria;

        categoriaCtrl.seleccionarProducto = seleccionarProducto;
        categoriaCtrl.agregarProducto = agregarProducto;
        categoriaCtrl.editarProducto = editarProducto;
        categoriaCtrl.noHaCambiadoProducto = noHaCambiadoProducto;
        categoriaCtrl.eliminarProducto = eliminarProducto;

        function activarControlador() {
            consultarCategorias();
        }

        function consultarCategorias(nombre, nomImagen) {
            categoriaCtrl.categorias = [];
            var mapa = new Object();
            var promesa = serviciosRest.getCategorias(mapa).$promise;
            promesa.then(function (respuesta) {
                angular.forEach(respuesta, function (catego) {
                    catego.urlImagen = urlArchivos + "categorias/" + catego.idCategoria + "/" + catego.imagen;
                    if(nombre && nomImagen && catego.nombreCategoria == nombre && catego.imagen == nomImagen) {
                        crudArchivoGenerico(catego.idCategoria, "categorias");
                    }
                });
                categoriaCtrl.categorias =  respuesta;
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function seleccionarCategoria(row) {
            categoriaCtrl.categoriaSeleccionado = row;
            categoriaCtrl.categoriaEditable = angular.copy(categoriaCtrl.categoriaSeleccionado);
            categoriaCtrl.imagenRow = [ {thumb: row.urlImagen, img: row.urlImagen, nombre: row.imagen} ];
            consultarProducto();
        }

        function agregarCategoria() {
            var nameImagen = angular.copy(categoriaCtrl.archivoCategoria.name);
            var nombrePromocion = angular.copy(categoriaCtrl.nuevaCategoria.nombreCategoria);
            var mapa = 0 + ",";
            mapa += categoriaCtrl.nuevaCategoria.nombreCategoria + ",";
            mapa += categoriaCtrl.nuevaCategoria.descripcion + ",";
            mapa += (categoriaCtrl.nuevaCategoria.indVigente?categoriaCtrl.nuevaCategoria.indVigente:'N') + ",";
            mapa += (categoriaCtrl.archivoCategoria?categoriaCtrl.archivoCategoria.name:"SN");
            var datosMapa = {
                pcAccion:  "INSERT",
                pcTextoAdd:  mapa
            };

            var promesa = serviciosRest.crudTblCategoria(datosMapa).$promise;
            promesa.then(function (respuesta) {
                categoriaCtrl.nuevaCategoria = {};
                consultarCategorias(nombrePromocion, nameImagen);
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function editarCategoria() {
            var mapa = "";
            if( categoriaCtrl.categoriaSeleccionado.nombreCategoria != categoriaCtrl.categoriaEditable.nombreCategoria) {
                mapa += "NOMBRECATEGORIA::S&" + (categoriaCtrl.categoriaEditable.nombreCategoria?categoriaCtrl.categoriaEditable.nombreCategoria:null) + "|";
            }
            if( categoriaCtrl.categoriaSeleccionado.descripcion != categoriaCtrl.categoriaEditable.descripcion) {
                mapa += "DESCRIPCION::S&" + (categoriaCtrl.categoriaEditable.descripcion?categoriaCtrl.categoriaEditable.descripcion:null) + "|";
            }
            if( categoriaCtrl.categoriaSeleccionado.indVigente != categoriaCtrl.categoriaEditable.indVigente) {
                mapa += "INDVIGENTE::S&" + (categoriaCtrl.categoriaEditable.indVigente?categoriaCtrl.categoriaEditable.indVigente:null) + "|";
            }
            if(categoriaCtrl.archivoCategoriaE){
                mapa += "IMAGEN::S&" + categoriaCtrl.archivoCategoriaE.name;
            }
            var datosMapa = {
                pcAccion:  "UPDATE",
                pcTextoEdit: mapa,
                pnIdUsuario: categoriaCtrl.categoriaSeleccionado.idCategoria
            };
            var categoria = angular.copy(categoriaCtrl.categoriaSeleccionado);
            var promesa = serviciosRest.crudTblCategoria(datosMapa).$promise;
            promesa.then(function (respuesta) {
                categoriaCtrl.categoriaSeleccionado = null;
                if(categoriaCtrl.archivoCategoriaE){
                    var ruta = "categorias/" + categoria.idCategoria + "/" + categoria.imagen;
                    var promesaArchivo = serviciosRest.subirArchivoGenerico(ruta, null, 'delete');
                    promesaArchivo.then(function (respuesta) {
                        crudArchivoGenerico(categoria.idCategoria, "categorias");
                    });
                    promesaArchivo.catch(function (respuesta) {
                        alertasServicios.desplegarMensaje(error);
                    });
                }
                consultarCategorias();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function noHaCambiadoCategoria() {
            return !angular.equals(categoriaCtrl.categoriaSeleccionado, categoriaCtrl.categoriaEditable);
        }

        function eliminarCategoria() {
            if(categoriaCtrl.productos.length == 0) {
                var datosMapa = {
                    pcAccion:  "DELETE",
                    pnIdUsuario: categoriaCtrl.categoriaSeleccionado.idCategoria
                };
                var promesa = serviciosRest.crudTblCategoria(datosMapa).$promise;
                promesa.then(function (respuesta) {

                    var ruta = "categorias/" + categoriaCtrl.categoriaSeleccionado.idCategoria + "/" + categoriaCtrl.categoriaSeleccionado.imagen;
                    var promesaArchivo = serviciosRest.subirArchivoGenerico(ruta, null, 'delete');
                    promesaArchivo.then(function (respuesta) {
                        categoriaCtrl.categoriaSeleccionado = null;
                        consultarCategorias();
                    });
                    promesaArchivo.catch(function (respuesta) {
                        alertasServicios.desplegarMensaje(error);
                    });
                });
                promesa.catch(function (error) {
                    alertasServicios.desplegarMensaje(error);
                });
            } else alertasServicios.desplegarMensaje("No se puede eliminar la categoria porque tiene productos registrados");
        }

        function consultarProducto(nombre, nomImagen) {
            categoriaCtrl.productos = [];
            var mapa = {
                pnIdGenerico: categoriaCtrl.categoriaSeleccionado.idCategoria
            };
            var promesa = serviciosRest.getProductos(mapa).$promise;
            promesa.then(function (respuesta) {
                angular.forEach(respuesta, function (produtc) {
                    produtc.urlImagen = urlArchivos + "productos/" + produtc.idProducto + "/" + produtc.imagen;
                    if(nombre && nomImagen && produtc.nombreProducto == nombre && produtc.imagen == nomImagen) {
                        crudArchivoGenericoProducto(produtc.idProducto, "productos");
                    }
                });
                categoriaCtrl.productos = respuesta;
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function seleccionarProducto(row) {
            categoriaCtrl.catProductoSeleccionado = row;
            categoriaCtrl.catProductoEditable = angular.copy(categoriaCtrl.catProductoSeleccionado);
            categoriaCtrl.imagenRowP = [ {thumb: row.urlImagen, img: row.urlImagen, nombre: row.imagen} ];
        }

        function agregarProducto() {

            var nameImagen = angular.copy(categoriaCtrl.archivoProducto.name);
            var nombrePromocion = angular.copy(categoriaCtrl.nuevaProducto.nombreProducto);

            var mapa = 0 + ",";
            mapa += categoriaCtrl.categoriaSeleccionado.idCategoria + ",";
            mapa += categoriaCtrl.nuevaProducto.orden + ",";
            mapa += categoriaCtrl.nuevaProducto.nombreProducto + ",";
            mapa += categoriaCtrl.nuevaProducto.descripcionProducto + ",";
            mapa += categoriaCtrl.nuevaProducto.noExistencias + ",";
            mapa += 0 + ",";
            mapa += (categoriaCtrl.archivoProducto?categoriaCtrl.archivoProducto.name:"SN") + ",";
            mapa += (categoriaCtrl.nuevaProducto.indVigente?categoriaCtrl.nuevaProducto.indVigente:'N') + ",";
            mapa += categoriaCtrl.nuevaProducto.precio;
            var datosMapa = {
                pcAccion:  "INSERT",
                pcTextoAdd:  mapa
            };
            var promesa = serviciosRest.crudTblProducto(datosMapa).$promise;
            promesa.then(function (respuesta) {
                categoriaCtrl.nuevaProducto = {};
                consultarProducto(nombrePromocion, nameImagen);
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function editarProducto() {
            var mapa = "";
            if( categoriaCtrl.catProductoSeleccionado.orden != categoriaCtrl.catProductoEditable.orden) {
                mapa += "ORDEN::S&" + (categoriaCtrl.catProductoEditable.orden?categoriaCtrl.catProductoEditable.orden:null) + "|";
            }
            if( categoriaCtrl.catProductoSeleccionado.nombreProducto != categoriaCtrl.catProductoEditable.nombreProducto) {
                mapa += "NOMBREPRODUCTO::S&" + (categoriaCtrl.catProductoEditable.nombreProducto?categoriaCtrl.catProductoEditable.nombreProducto:null) + "|";
            }
            if( categoriaCtrl.catProductoSeleccionado.descripcion != categoriaCtrl.catProductoEditable.descripcion) {
                mapa += "DESCRIPCION::S&" + (categoriaCtrl.catProductoEditable.descripcion?categoriaCtrl.catProductoEditable.descripcion:null) + "|";
            }
            if( categoriaCtrl.catProductoSeleccionado.noExistencias != categoriaCtrl.catProductoEditable.noExistencias) {
                mapa += "NO_EXISTENCIAS::S&" + (categoriaCtrl.catProductoEditable.noExistencias?categoriaCtrl.catProductoEditable.noExistencias:null) + "|";
            }
            if( categoriaCtrl.catProductoSeleccionado.noVendidas != categoriaCtrl.catProductoEditable.noVendidas) {
                mapa += "NO_VENDIDAS::S&" + (categoriaCtrl.catProductoEditable.noVendidas?categoriaCtrl.catProductoEditable.noVendidas:null) + "|";
            }
            if( categoriaCtrl.catProductoSeleccionado.indVigente != categoriaCtrl.catProductoEditable.indVigente) {
                mapa += "INDVIGENTE::S&" + (categoriaCtrl.catProductoEditable.indVigente?categoriaCtrl.catProductoEditable.indVigente:null) + "|";
            }
            if( categoriaCtrl.catProductoSeleccionado.precio != categoriaCtrl.catProductoEditable.precio) {
                mapa += "PRECIO::S&" + (categoriaCtrl.catProductoEditable.precio?categoriaCtrl.catProductoEditable.precio:null) + "|";
            }
            if(categoriaCtrl.archivoProductoE){
                mapa += "IMAGEN::S&" + categoriaCtrl.archivoProductoE.name;
            }
            var datosMapa = {
                pcAccion:  "UPDATE",
                pcTextoEdit: mapa,
                pnIdUsuario: categoriaCtrl.catProductoSeleccionado.idProducto
            };
            var producto = angular.copy(categoriaCtrl.catProductoSeleccionado);
            var promesa = serviciosRest.crudTblProducto(datosMapa).$promise;
            promesa.then(function (respuesta) {
                categoriaCtrl.catProductoSeleccionado = null;
                if(categoriaCtrl.archivoProductoE){
                    var ruta = "productos/" + producto.idProducto + "/" + producto.imagen;
                    var promesaArchivo = serviciosRest.subirArchivoGenerico(ruta, null, 'delete');
                    promesaArchivo.then(function (respuesta) {
                        crudArchivoGenericoProducto(producto.idProducto, "productos");
                    });
                    promesaArchivo.catch(function (respuesta) {
                        alertasServicios.desplegarMensaje(error);
                    });
                }
                consultarProducto();
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function noHaCambiadoProducto() {
            return !angular.equals(categoriaCtrl.catProductoSeleccionado, categoriaCtrl.catProductoEditable);
        }

        function eliminarProducto() {
            var datosMapa = {
                pcAccion:  "DELETE",
                pnIdUsuario: categoriaCtrl.catProductoSeleccionado.idProducto
            };
            var promesa = serviciosRest.crudTblProducto(datosMapa).$promise;
            promesa.then(function (respuesta) {

                var ruta = "productos/" + categoriaCtrl.catProductoSeleccionado.idProducto + "/" + categoriaCtrl.catProductoSeleccionado.imagen;
                var promesaArchivo = serviciosRest.subirArchivoGenerico(ruta, null, 'delete');
                promesaArchivo.then(function (respuesta) {
                    categoriaCtrl.catProductoSeleccionado = null;
                    consultarProducto();
                });
                promesaArchivo.catch(function (respuesta) {
                    alertasServicios.desplegarMensaje(error);
                });
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function crudArchivoGenerico(idPromocion, tipo) {
            var ruta = tipo + "/" + idPromocion + "/" ;
            var promesaArchivo = serviciosRest.subirArchivoGenerico(ruta, (categoriaCtrl.archivoCategoria?categoriaCtrl.archivoCategoria:categoriaCtrl.archivoCategoriaE),
                'insert');
            promesaArchivo.then(function (respuesta) {
                categoriaCtrl.archivoCategoria = null;
                categoriaCtrl.archivoCategoriaE = null;
            });
            promesaArchivo.catch(function (respuesta) {
                alertasServicios.desplegarMensaje(error);
            });
        }
        function crudArchivoGenericoProducto(idPromocion, tipo) {
            var ruta = tipo + "/" + idPromocion + "/" ;
            var promesaArchivo = serviciosRest.subirArchivoGenerico(ruta,
                (categoriaCtrl.archivoProducto?categoriaCtrl.archivoProducto:categoriaCtrl.archivoProductoE),
                'insert');
            promesaArchivo.then(function (respuesta) {
                categoriaCtrl.archivoProducto = null;
                categoriaCtrl.archivoProductoE = null;
            });
            promesaArchivo.catch(function (respuesta) {
                alertasServicios.desplegarMensaje(error);
            });
        }

    }
})();
