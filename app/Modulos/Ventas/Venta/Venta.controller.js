(function () {
    'use strict';

    angular
        .module('app')
        .controller('Venta', Venta);

    Venta.$inject = [ '$log', 'tblsServicios', 'serviciosRest', '$timeout', '$scope', '$rootScope', '$filter',
        '$location', 'webStorage', 'alertasServicios'];

    function Venta( $log, tblsServicios, serviciosRest, $timeout, $scope, $rootScope, $filter, $location,
                    webStorage, alertasServicios ) {

        /* jshint validthis: true */
        var ventaCtrl = this;

        ventaCtrl.producto = null;
        ventaCtrl.usuarioSesion = null;
        ventaCtrl.fechaCompra = new Date();

        $rootScope.ocultarBuscarMenuSuperior = false;

        var producto = serviciosRest.getDatosProducto();
        ventaCtrl.datosSesion = serviciosRest.getDatosSesion();

        $scope.$watch('ventaCtrl.datosSesion', function (registro) {
            console.log(registro);
            console.log(registro);
            console.log(registro);
            if(registro){
                ventaCtrl.usuarioSesion = registro;
                ventaCtrl.nuevaVenta = registro;
            }
        }, true);

        $scope.$watch('$rootScope.usuarioSesion', function (registro) {
            console.log(registro);
            console.log(registro);
            console.log(registro);
            if(registro){
                ventaCtrl.usuarioSesion = registro;
                ventaCtrl.nuevaVenta = registro;
            }
        }, true);

        activarControlador();

        ventaCtrl.iniciarSesion = iniciarSesion;
        ventaCtrl.abrirModalVenta = abrirModalVenta;
        ventaCtrl.agregarVenta = agregarVenta;
        ventaCtrl.mdlSoloResgistro = mdlSoloResgistro;
        ventaCtrl.generarPDF = generarPDF;
        ventaCtrl.iniciosesionUsuario = iniciosesionUsuario;

        function activarControlador() {
            ventaCtrl.usuarioSesion = null;

            window.scrollBy(0, 0);

            if(producto) {
                ventaCtrl.producto = producto;
            } else {
                $timeout(function () {
                    serviciosRest.setDatosProducto(null);
                    $location.path('/inicio');
                }, 100);
            }

            if($rootScope.usuarioSesion) {
                $timeout(function () {
                    ventaCtrl.nuevaVenta = angular.copy($rootScope.usuarioSesion);
                }, 100);

            }

        }

        function iniciarSesion() {
            var mapa = {
                pcUsuario: ventaCtrl.usr.username,
                pcPassword: ventaCtrl.usr.password
            };
            var promesa = serviciosRest.getUsuarios(mapa).$promise;
            promesa.then(function (respuesta) {
                if(respuesta.length > 0) {
                    ventaCtrl.usuarioSesion = respuesta[0];
                    $rootScope.usuarioSesion = respuesta[0];
                    webStorage.session.add("ecommercejc.usuario", JSON.stringify(respuesta[0]));
                    serviciosRest.setDatosSesion(ventaCtrl.usuarioSesion);
                    ventaCtrl.nuevaVenta = angular.copy(ventaCtrl.usuarioSesion);
                } else ventaCtrl.usuarioSesion = null;
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function mdlSoloResgistro() {
            angular.element("#mdlSoloResgistro").modal("show");
        }

        function abrirModalVenta() {
            angular.element("#mdlRegistroVenta").modal("show");
        }

        function agregarVenta() {

            var mapa = {
                pnIdProducto: ventaCtrl.producto.idProducto
            };
            var promesa = serviciosRest.getProductos(mapa).$promise;
            promesa.then(function (respuestaPro) {
                if(respuestaPro.length > 0 && respuestaPro[0].noExistencias != 0) {
                    var mapa = 0 + ",";
                    mapa += ventaCtrl.usuarioSesion.idUsuario + ","; //ID_USUARIO
                    mapa += ventaCtrl.producto.idProducto + ","; //ID_PRODUCTO
                    mapa += ventaCtrl.producto.precio + ","; //MTOVENTA
                    mapa += (ventaCtrl.nuevaVenta.calle?ventaCtrl.nuevaVenta.calle:null) + ","; //NOEXT
                    mapa += (ventaCtrl.nuevaVenta.noExt?ventaCtrl.nuevaVenta.noExt:null) + ",";
                    mapa += (ventaCtrl.nuevaVenta.noInterior?ventaCtrl.nuevaVenta.noInterior:null) + ",";
                    mapa += (ventaCtrl.nuevaVenta.codPos?ventaCtrl.nuevaVenta.codPos:null) + ",";
                    mapa += (ventaCtrl.nuevaVenta.colonia?ventaCtrl.nuevaVenta.colonia:null) + ",";
                    mapa += (ventaCtrl.nuevaVenta.municipio?ventaCtrl.nuevaVenta.municipio:null) + ",";
                    mapa += (ventaCtrl.nuevaVenta.ciudad?ventaCtrl.nuevaVenta.ciudad:null) + ",";
                    mapa += (ventaCtrl.nuevaVenta.estado?ventaCtrl.nuevaVenta.estado:null) + ",";
                    mapa += (ventaCtrl.nuevaVenta.pais?ventaCtrl.nuevaVenta.pais:null) + ",";
                    mapa += ventaCtrl.nuevaVenta.referencia + " Fec Ref " + $filter('fechaSimple')(new Date);

                    var idVenta = ventaCtrl.nuevaVenta.referencia + " Fec Ref " + $filter('fechaSimple')(new Date);

                    var datosMapa = {
                        pcAccion:  "INSERT",
                        pcTextoAdd:  mapa
                    };
                    var promesa = serviciosRest.crudTblVenta(datosMapa).$promise;
                    promesa.then(function (respuesta) {
                        ventaCtrl.ventaCompletada = null;
                        consultarVentaEfectuada(idVenta);
                        $timeout(function () {
                            var mapa = "";
                            mapa += "NO_EXISTENCIAS::S&" + (respuestaPro[0].noExistencias - 1) + "|";
                            mapa += "NO_VENDIDAS::S&" + (respuestaPro[0].noVendidas + 1) + "|";
                            var datosMapa = {
                                pcAccion:  "UPDATE",
                                pcTextoEdit: mapa,
                                pnIdUsuario: ventaCtrl.producto.idProducto
                            };
                            var promesa = serviciosRest.crudTblProducto(datosMapa).$promise;
                            promesa.then(function (respuestaSS) { });
                            promesa.catch(function (error) { alertasServicios.desplegarMensaje(error); });
                        })
                    });
                    promesa.catch(function (error) {
                        alertasServicios.desplegarMensaje(error);
                    });
                }
                else alertasServicios.desplegarMensaje("No hay suficientes existencias del producto para completar la venta");
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });


        }

        function consultarVentaEfectuada(idVenta) {
            var datosMapa = { };
            var promesa = serviciosRest.getVentas(datosMapa).$promise;
            promesa.then(function (respuesta) {
                ventaCtrl.ventaCompletada = _.filter(respuesta, function (venta) {
                    return venta.idProducto == ventaCtrl.producto.idProducto &&
                           venta.idUsuario == ventaCtrl.usuarioSesion.idUsuario &&
                           venta.referencia == idVenta;
                });

                $timeout(function () {
                    angular.element("#mdlVentaCompletada").modal("show");
                });
            });
            promesa.catch(function (error) {
                alertasServicios.desplegarMensaje(error);
            });
        }

        function generarPDF() {
            $log.info("Entra a metodo generarPDF() de CotizadorControlador");
            var htmlcontentMdl = angular.element('#pdf-recibo-compra');
            var contentMdl = '<html>';
            contentMdl += '<style>@media print {  html {  zoom: ';
            contentMdl += 100;
            contentMdl += '%; } }</style>';
            contentMdl += '<link rel="stylesheet" href="css/estilosPdf.css" />';
            contentMdl += '<div id="container"><div id="left"><span class="textNegro">';
            contentMdl += "Tienda Online JC";
            contentMdl += '</span><br/><br/>';
            contentMdl += '<br/></div><br/><br/><br/><br/><br/>';
            contentMdl += '<div style="margin-top: 20px">';
            contentMdl += htmlcontentMdl[0].outerHTML;
            contentMdl += '</div></html>';
            $timeout(function (){
                //Realizar la estrucutura HTML
                var doc = document.getElementById('print-iframe').contentWindow.document;
                doc.open();
                doc.write(contentMdl);
                doc.close();
                $timeout(function (){
                    $("#print-iframe").get(0).contentWindow.print();
                    angular.element("#mdlVentaCompletada").modal("hide");
                    $timeout(function () {
                        $location.path('/producto');
                    }, 1000);
                },500);
            },100);

        }

        function iniciosesionUsuario() {
            $timeout(function () {
                ventaCtrl.usuarioSesion = angular.copy($rootScope.usuarioSesion);
                ventaCtrl.nuevaVenta = angular.copy($rootScope.usuarioSesion);
            }, 200)
        }

    }
})();
