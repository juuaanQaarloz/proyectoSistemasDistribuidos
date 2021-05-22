(function () {
    angular
        .module('app')
        .controller('AppControlador', AppControlador);

    AppControlador.$inject = ['$log', '$http'];

    /* @ngInject */
    function AppControlador($log, $http) {
        /* jshint validthis: true */
        var appCtrl = this;

        activarControlador();

        function activarControlador() {
            /*$http.get("ApiPHP/consultaGenerica.php")
                .then(function (response) {
                    var respuesta = JSON.parse(response.data+"}");
                    console.log(respuesta.datos);
                    console.log(respuesta.datos);
                    console.log(respuesta.datos);
                });*/
        }


    }
})();
