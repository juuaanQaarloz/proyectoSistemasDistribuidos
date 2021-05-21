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
            $http.get("ApiPHP/consultaGenerica.php")
                .then(function (response) {
                    console.log(response);
                    console.log(response);
                    console.log(response);
                });
        }


    }
})();
