(function () {
    'use strict';

    angular
        .module('xsModulo')
        .controller('FileController', FileController)
        .directive('ecommersFile', ecommersFile);

    FileController.$inject = ['$scope', 'alertasServicios', '$log', 'serviciosRest', 'tamanioPDF',
        'tamanioIMG', '$filter'];

    /* @ngInject */
    function FileController($scope, alertasServicios, $log, serviciosRest, tamanioPDF, tamanioIMG,
                            $filter) {
        /* jshint validthis: true */
        var fileCtrl = this;

        fileCtrl.idFile = getRandomId(1,9999999);

        fileCtrl.actualizar = actualizar;
        fileCtrl.limpiar = limpiar;
        $scope.limpiar = limpiar;

        /**
         * @ngdoc method
         * @name xsModulo.ecommersFile#getRandomId
         * @methodOf xsModulo.directive:ecommersFile
         * @description Funcion encargada de generar un id para el input
         */
        function getRandomId(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        /**
         * @ngdoc method
         * @name xsModulo.ecommersFile#actualizar
         * @methodOf xsModulo.directive:ecommersFile
         * @description Funcion encargada de actualizar el model
         */
        function actualizar() {
            if($scope.nombreArchivoEditable)
                if(!fileCtrl.nombreArchivoEditable)
                    fileCtrl.nombreArchivoEditable = angular.copy($scope.nombreArchivoEditable);
            if($scope.acepta){
                if(fileCtrl.file){
                    $log.info("fileCtrl.file ----------------->");
                    $log.info(fileCtrl.file);
                    if((angular.lowercase(fileCtrl.file.name).indexOf("pdf") > 0 ))fileCtrl.tamanioArchivo = tamanioPDF;
                    else fileCtrl.tamanioArchivo = tamanioIMG;
                    var arre = $scope.acepta.split(',');
                    var tfile = fileCtrl.file.type.split('/');
                    var encontrado = false;
                    var numeroMaximo = false;
                    for(var a in arre){
                        var acep = arre[a].trim().split('/');
                        if (acep[0] === tfile[0]){
                            if(acep[1] !== '*'){
                                if(acep[1]=== tfile[1]){
                                    if($scope.characterMaximo){
                                        if (fileCtrl.file.name.length < $scope.characterMaximo) {
                                            asignarFile();
                                            encontrado = true;
                                            break;
                                        }else {
                                            numeroMaximo = true;
                                        }
                                    } else {
                                            asignarFile();
                                            encontrado = true;
                                            break;
                                    }
                                }
                            }else{
                                if($scope.characterMaximo){
                                    if (fileCtrl.file.name.length < $scope.characterMaximo) {
                                        asignarFile();
                                        encontrado = true;
                                        break;
                                    }else {
                                        numeroMaximo = true;
                                    }
                                }else{
                                    asignarFile();
                                    encontrado = true;
                                    break;
                                }
                            }
                        }
                    }
                    if(!encontrado){
                        if(numeroMaximo){
                            //si el name del file es mayor a $scope.characterMaximo
                            alertasServicios.desplegarError("El Numero maximo de caracteres permitidos son " + $scope.characterMaximo + " y el archivo con el nombre " + fileCtrl.file.name + " tiene " + fileCtrl.file.name.length + " caracteres ");
                         } else if ((fileCtrl.file.size/1024) > fileCtrl.tamanioArchivo) {
                            alertasServicios.desplegarError("El tamaño permitido para el archivo es de " + (fileCtrl.tamanioArchivo/1024) + " MB, el archivo seleccionado es de " + $filter('number')((fileCtrl.file.size/1024), 2) + " MB");
                         } else {
                            alertasServicios.desplegarError("El tipo de archivo que selecciono no es valido");
                         }
                        limpiar();
                    } else if ((fileCtrl.file.size/1024) > fileCtrl.tamanioArchivo) {
                        //alertasServicios.desplegarError("El tamaño permitido para el archivo es de " + (fileCtrl.tamanioArchivo/1024) + " MB, el archivo seleccionado es de " + $filter('number')((fileCtrl.file.size/1024), 2) + " MB");
                        limpiar();
                    }
                } else limpiar();
            } else {
                asignarFile();
            }
        }

        function asignarFile() {
            var archivos = _.filter($scope.listArchivos, function (archvios) {
                if(serviciosRest.validarDato(archvios[$scope.descIdGenerico])){
                    return archvios[$scope.descIdGenerico].name == fileCtrl.file.name;
                } else if(serviciosRest.validarDato(archvios[$scope.descArchivo])){
                    return archvios[$scope.descArchivo] == fileCtrl.file.name;
                } else {
                    return null;
                }
            });
            if(archivos.length > 0){
                var nombre = angular.copy(fileCtrl.file.name);
                alertasServicios.desplegarError("El archivo con el nombre " + nombre + " ya se encuentra en la lista de archivos Seleccionados");
                limpiar();
            } else {
                $scope.file = fileCtrl.file;
                $scope.idFile = fileCtrl.idFile;
                $scope.nombreArchivoEditable && fileCtrl.file.name?$scope.nombreArchivoEditable = fileCtrl.file.name:"";
                $scope.agregoArchivo();
            }
        }

        /**
         * @ngdoc method
         * @name xsModulo.ecommersFile#limpiar
         * @methodOf xsModulo.directive:ecommersFile
         * @description Funcion encargada de limpiar los archivos file
         */
        function limpiar() {
            $log.info("limpiar archivo");

            var tipo = 'agregar';

            if($scope.nombreArchivoEditable){
                tipo = 'editar';
                $scope.nombreArchivoEditable = angular.copy(fileCtrl.nombreArchivoEditable);
            }
            angular.element('#'+tipo+'-documento'+fileCtrl.idFile)[0].value = null;
            fileCtrl.file = null;
            $scope.file = null;

        }



    } //Fin del controlador
    ecommersFile.$inject = [];

    /* @ngInject */
    function ecommersFile() {
        return {
            controller: FileController,
            controllerAs: 'fileCtrl',
            restrict: 'E',
            scope: {
                file: '=',
                acepta:'@?',
                agregoArchivo:'&?',
                limpiar:'=',
                requerido:'=',
                validacionForm:'=',
                nombreArchivoEditable:'=?',
                ocultarEtiqueda:'=?',
                characterMaximo:'=?',
                listArchivos:'=?',
                descIdGenerico:'=?',
                etiquetaAchivo:'=?',
                elimina:'=?',
                descArchivo:'=?',
                noClassSuccess:'=?'
            },
            templateUrl: 'Directivas/xsDirectivas/ecommersFile/ecommersFile.html'
        };
    }
})
();