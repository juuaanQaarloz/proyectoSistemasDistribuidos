(function () {
    'use strict';

    angular
        .module('app')
        .constant('urlServicios', 'http://localhost:8080/apiResteCommerce/')
        .constant('urlArchivos', 'http://localhost:8080/')
        .constant('tamanioPDF', 7168)
        .constant('tamanioIMG', 5120)
})();
