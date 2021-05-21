(function () {
    'use strict';

    angular
        .module('app')
        .controller('Productos', Productos);

    Productos.$inject = [ '$log', 'tblsServicios', 'serviciosRest', '$timeout', '$location', 'urlArchivos',
        '$rootScope', 'alertasServicios'];

    function Productos( $log, tblsServicios, serviciosRest, $timeout, $location, urlArchivos, $rootScope,
                        alertasServicios) {

        /* jshint validthis: true */
        var productoCtrl = this;

        productoCtrl.producto = null;
        $rootScope.ocultarBuscarMenuSuperior = true;

        productoCtrl.tblProductoVenta = tblsServicios.getTabla('tblsGenerales', 'tblProductoVenta');

        productoCtrl.cbxRangoPrecios = {
            placeholder: "Seleccione",
            dataTextField: "tipo",
            dataValueField: "idTipo"
        };

        productoCtrl.rangoPrecios = [
            {tipo: "100", idTipo: "100"},
            {tipo: "200", idTipo: "200"},
            {tipo: "300", idTipo: "300"},
            {tipo: "400", idTipo: "400"},
            {tipo: "500", idTipo: "500"},
            {tipo: "1000", idTipo: "1000"},
            {tipo: "2000", idTipo: "2000"},
            {tipo: "3000", idTipo: "3000"},
            {tipo: "4000", idTipo: "4000"},
            {tipo: "5000", idTipo: "5000"},
        ];

        var producto = angular.copy(serviciosRest.getDatosProducto());
        var categoria = angular.copy(serviciosRest.getDatosProductoCat());
        var buscraText = angular.copy(serviciosRest.getTextoBuscar());

        activarControlador();

        productoCtrl.irADetalleProducto = irADetalleProducto;
        productoCtrl.irADetalleVenta = irADetalleVenta;
        productoCtrl.buscarProductos = buscarProductos;
        productoCtrl.buscarPorCategoria = buscarPorCategoria;
        productoCtrl.buscarProductosConText = buscarProductosConText;
        productoCtrl.buscarProductosVentas = buscarProductosVentas;

        function activarControlador() {
            window.scrollBy(0, 0);
            productoCtrl.categoriaSeleccionado = null;
            productoCtrl.busqueda = {};
            productoCtrl.rangoPreciosAl = null;
            productoCtrl.rangoPreciosDe = null;
            if(producto) {
                productoCtrl.producto = producto;
                buscarProductosVentas(productoCtrl.producto.idProducto);
            } else if (categoria){
                buscarPorCategoria(categoria);
            } else if (buscraText){
                productoCtrl.busqueda.textBuscar = buscraText;
                buscarProductosConText();
            } else {
                buscarCategoria();
            }

            $timeout(function () {
                serviciosRest.setDatosProducto();
                serviciosRest.getDatosProductoCat();
                serviciosRest.getTextoBuscar();
            });

        }

        function buscarProductosVentas(idProducto) {
            productoCtrl.ventasPorProducto = [];
            var mapa = {
                pnIdProducto: idProducto
            };
            var promesa = serviciosRest.getVentas(mapa).$promise;
            promesa.then(function (respuesta) {
                productoCtrl.ventasPorProducto =  respuesta;
                var promesa = serviciosRest.getUsuarios({}).$promise;
                promesa.then(function (respuesta) {
                    angular.forEach(productoCtrl.ventasPorProducto, function (venta) {
                        angular.forEach(respuesta, function (user) {
                            if(venta.idUsuario == user.idUsuario) {
                                venta.nombreUsuario = user.nombreUsuario;
                            }
                        });
                    })
                });
                promesa.catch(function (error) {
                    alertasServicios.desplegarMensaje(error);
                });
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function buscarCategoria() {
            productoCtrl.categoriaSeleccionado = null;

            productoCtrl.categorias = [];
            var mapa = new Object();
            var promesa = serviciosRest.getCategorias(mapa).$promise;
            promesa.then(function (respuesta) {
                angular.forEach(respuesta, function (catego) {
                    catego.urlImagen = urlArchivos + "categorias/" + catego.idCategoria + "/" + catego.imagen;
                });
                productoCtrl.categorias =  respuesta;
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function buscarPorCategoria(categoria) {
            console.log(categoria);
            productoCtrl.categoriaSeleccionado = categoria;
            productoCtrl.productosList = [];
            var mapa = {
                pnIdGenerico: productoCtrl.categoriaSeleccionado.idCategoria
            };
            var promesa = serviciosRest.getProductos(mapa).$promise;
            promesa.then(function (respuesta) {
                angular.forEach(respuesta, function (produtc) {
                    produtc.urlImagen = urlArchivos + "productos/" + produtc.idProducto + "/" + produtc.imagen;
                });
                productoCtrl.productosList = respuesta;
                productoCtrl.categorias = [];
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function buscarProductos() {
            var mapa = {
                pcWhereBase: productoCtrl.categoriaSeleccionado.idCategoria
            };
            productoCtrl.productosList = [];
            var promesa = serviciosRest.getProductos(mapa).$promise;
            promesa.then(function (respuesta) {
                angular.forEach(respuesta, function (produtc) {
                    produtc.urlImagen = urlArchivos + "productos/" + produtc.idProducto + "/" + produtc.imagen;
                });
                productoCtrl.productosList = respuesta;
                productoCtrl.categorias = [];
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }
        function buscarProductosConText(rango) {
            if(!rango) {
                var mapa = {
                    pcTextBuscar: buscraText
                };
            } else {
                var mapa = {
                    pcTextBuscar: (productoCtrl.busqueda.textBuscar?productoCtrl.busqueda.textBuscar:null),
                    pcRangoPrecioAl: productoCtrl.busqueda.rangoPreciosAl,
                    pcRangoPrecioDe: productoCtrl.busqueda.rangoPreciosDe
                };
            }
            productoCtrl.productosList = [];
            productoCtrl.categorias = [];
            productoCtrl.producto = null;
            var promesa = serviciosRest.getProductosActivos(mapa).$promise;
            promesa.then(function (respuesta) {
                angular.forEach(respuesta, function (produtc) {
                    produtc.urlImagen = urlArchivos + "productos/" + produtc.idProducto + "/" + produtc.imagen;
                });
                productoCtrl.productosList = respuesta;
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function irADetalleProducto(producto) {
            productoCtrl.producto = null;
            $timeout(function () {
                productoCtrl.producto = producto;
                buscarProductosVentas(productoCtrl.producto.idProducto);
            })
        }

        function irADetalleVenta(producto) {
            serviciosRest.setDatosProducto(producto);
            $timeout(function () {
                $location.path('/venta');
            }, 100);
        }

    }
})();
