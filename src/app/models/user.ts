export interface User {
    isSelected: boolean;
    id: number;
    Area: string;
    Objetivo: string;
    Habilidad: string;
    Accion: string;
    fecha: string;
    isEdit: boolean;
    [key: string]: any; 
  }
  
  export const UserColumns = [
    {
      key: 'isSelected',
      type: 'isSelected',
      label: '',
    },
    {
      key: 'Area',
      type: 'text',
      label: 'Area de oportunidad',
      required: true,
    },
    {
      key: 'Objetivo',
      type: 'text',
      label: 'Objetivo',
      required: true,
    },
    {
      key: 'Habilidad',
      type: 'text',
      label: 'Habilidad a desarrollar',
      required: true,
    },
    {
      key: 'Accion',
      type: 'text',
      label: 'Accion a realizar',
      required: true,
    },
    {
      key: 'fecha',
      type: 'date',
      label: 'Fecha establecida',
      required: true,
    },
    {
      key: 'isEdit',
      type: 'isEdit',
      label: '',
    },
  ];