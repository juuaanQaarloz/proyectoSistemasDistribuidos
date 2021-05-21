/**
 * Created by Israel Guzman on 2014-08-21.
 * @description Archivo donde se encuentra las configuraciones de todas las tablas del modulo de objsGenerales.
 */
(function () {
    /**
     * @type {module|*} "tablas" Módulo de tablas generales de eAspayb.
     */
    angular.module('objsGenerales')

        .value('tblAutor', {
            id: 'idTablaAutor',
            paginacion: [10, 30, 50, 100],
            permisos: {agregar: true, borrar: true, modificar: true, consultar: true},
            modals: {agregar: 'mdlAutorA', borrar: 'mdlAutorB', modificar: 'mdlAutorM'},
            columnas: [
                {valor: 'id', tipo: 'string', descripcion: 'No.'},
                {valor: 'nombre', tipo: 'string', descripcion: 'Nombre'},
                {valor: 'nacionalidad', tipo: 'string', descripcion: 'Nacionalidad'},
            ]
        })
    ;
})();
