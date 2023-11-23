import { ColDef, Column, ColumnApi, GridApi, ICellRendererParams, IRowNode } from 'ag-grid-community';
export class CustomCellRendererParams implements ICellRendererParams{
    value: any;
    valueFormatted: string | null | undefined;
    fullWidth?: boolean | undefined;
    pinned?: 'right' | 'left' | null | undefined;
    data: any;
    node: IRowNode<any>;
    rowIndex: number;
    colDef?: ColDef<any, any> | undefined;
    column?: Column<any> | undefined;
    eGridCell: HTMLElement;
    eParentOfValue: HTMLElement;
    getValue?: (() => any) | undefined;
    setValue?: ((value: any) => void) | undefined;
    formatValue?: ((value: any) => string) | undefined;
    refreshCell?: (() => void) | undefined;
    registerRowDragger: (rowDraggerElement: HTMLElement, dragStartPixels?: number | undefined, value?: string | undefined, suppressVisibilityChange?: boolean | undefined) => void;
    api: GridApi<any>;
    columnApi: ColumnApi;
    context: any;

    // Personalizados
    action: string;
    icon: string = '';
    disabled: boolean = false;
    title: string;
}