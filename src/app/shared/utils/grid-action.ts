import { ColDef } from "ag-grid-community";

export class GridActions{
    public static readonly ADD='Agregar';
    public static readonly EDIT='Editar';
    public static readonly DELETE='Eliminar';


    public static readonly DEFAULT_COLUMN: ColDef = 
    {
        headerName: '',
        field: '',
        cellClass: 'center-ag',
        cellRenderer: 'gridActionButton',
        width: 44,
        resizable: false,
        sortable: false,
        filter: false,
        suppressMovable: true,
        lockPosition: true,
        pinned: 'right'
    }
}