/**
/**
 * Created by Rice on 15-02-05.
 * @description Filtros del sistema en general.
 */
(function () {
    angular
        .module('xsModulo')
        .filter('offset', offset)
        .filter('tipoUsuario', tipoUsuario)
        .filter('filtroDinamico', filtroDinamico)
        .filter('fechaSimple', fechaSimple)
        .filter('palomaotache', palomaotache);

    offset.$inject = [];
    function offset() {
        return function (input, inicio) {
            inicio = parseInt(inicio, 10);
            return input.slice(inicio);
        };
    }

    tipoUsuario.$inject = [];
    function tipoUsuario() {
        return function (input) {
            if(input == 'A')
                return 'Administrador de Pagina';
            else return 'Comprador';
        };
    }

    filtroDinamico.$inject = ['$log', '$filter'];
    function filtroDinamico($log, $filter) {
        return function (dato, filtro) {
            if (filtro == 'currency') {
                return $filter(filtro)(dato, ' ');
            } else if(filtro) {
                return $filter(filtro)(dato);
            } else {
                return dato;
            }
        };
    }

    palomaotache.$inject = [];
    function palomaotache() {
        return function (valorBoolenano) {
            if (valorBoolenano === 'S') {
                return '\u2713';
            } else if(valorBoolenano === 'M'){
                return '\u2718';
            } else {
                return '\u2718';
            }
        };
    }

    fechaSimple.$inject = ['$filter', '$log'];
    function fechaSimple($filter, $log) {
        return function (fechaOriginal) {
            if (fechaOriginal == undefined || fechaOriginal == null) {
                return "--/--/----"
            } else {
                var myDate = moment(fechaOriginal);
                var fec = myDate.format("DD/MM/YYYY");

                if (fec == 'Invalid date') {
                    return fechaOriginal;
                }
                else {
                    return fec;
                }
            }
        };
    }

})();
