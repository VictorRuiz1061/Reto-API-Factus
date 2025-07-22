import { useState, useEffect, useMemo } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Input } from "@heroui/react";
import { ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { format } from 'date-fns';
import Botton from "../atomos/Botton";

// Tipo genérico para cualquier estructura de datos
export type Column<T> = {
  key: keyof T | "acciones" | "estado" | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean; // Indica si la columna se puede ordenar
  filterable?: boolean; // Indica si la columna se puede filtrar
};

type Props<T extends { key: React.Key }> = {
  columns: Column<T>[];
  defaultFilterableColumns?: boolean;
  data: T[];
  rowsPerPage?: number;
  defaultSortColumn?: keyof T; // Columna por defecto para ordenar
  defaultSortDirection?: 'asc' | 'desc'; // Dirección de ordenamiento por defecto
  // Propiedades para funcionalidad de estado y acciones
  onToggleEstado?: (item: T) => void;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  includeEstado?: boolean;
  includeAcciones?: boolean;
  estadoLabel?: string;
  accionesLabel?: string;
};

type SortDirection = 'asc' | 'desc' | null;


const GlobalTable = <T extends { key: React.Key }>({ 
  columns, 
  data, 
  rowsPerPage: initialRowsPerPage = 10,
  defaultSortColumn = "estado" as keyof T,
  defaultSortDirection = 'desc',
  onEdit,
  onView,
  includeAcciones = true,
  accionesLabel = "Acciones"
}: Props<T>) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(initialRowsPerPage);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(defaultSortColumn || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [filterValue, setFilterValue] = useState("");
  const [pagedData, setPagedData] = useState<T[]>([]);
  
  // Función para ordenar datos
  const sortData = (data: T[], column: keyof T, direction: SortDirection): T[] => {
    if (!column || !direction) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  // Función para filtrar datos
  const filterData = (data: T[], value: string): T[] => {
    if (!value) return data;
    const searchValue = value.toLowerCase();
    return data.filter(item => 
      columns.some(column => {
        if (column.key === 'acciones' || !column.filterable) return false;
        const val = item[column.key as keyof T];
        if (val === undefined) return false;
        // Si es fecha ISO, comparar contra ISO y contra formateada
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(val)) {
          const date = new Date(val);
          const formatted = format(date, 'dd/MM/yyyy');
          return val.toLowerCase().includes(searchValue) || formatted.includes(searchValue);
        }
        return String(val).toLowerCase().includes(searchValue);
      })
    );
  };

  // Crear columnas mejoradas con estado y acciones si es necesario
  const enhancedColumns = useMemo(() => {
    const newColumns = [...columns];
    
    
    // Agregar columna de acciones si se solicita y no existe ya
    if (includeAcciones && (onEdit || onView) && !newColumns.some(col => col.key === "acciones")) {
      const accionesColumn: Column<T> = {
        key: "acciones" as keyof T,
        label: accionesLabel,
        render: (item) => (
          <div className="flex gap-2">
            {onView && (
              <Botton
                onClick={() => onView(item)}
                className="bg-blue-500 text-white">
                <Eye size={18} />
              </Botton>
            )}
          </div>
        )
      };
      newColumns.push(accionesColumn);
    }
    
    return newColumns;
  }, [columns, includeAcciones, onEdit, onView, accionesLabel]);

  // Procesar datos con ordenamiento y filtrado
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Aplicar filtro
    result = filterData(result, filterValue);
    
    // Aplicar ordenamiento
    if (sortColumn && sortDirection) {
      result = sortData(result, sortColumn, sortDirection);
    }
    
    return result;
  }, [data, filterValue, sortColumn, sortDirection]);

  const pages = Math.ceil(processedData.length / rowsPerPage);

  // Actualizar datos paginados
  useEffect(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setPagedData(processedData.slice(start, end));
  }, [page, processedData, rowsPerPage]);

  // Manejar cambio de ordenamiento
  const handleSortChange = (column: keyof T) => {
    if (sortColumn === column) {
      // Si ya estamos ordenando por esta columna, cambiar dirección
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es una columna diferente, establecer como nueva columna de ordenamiento
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="w-full text-gray-800">
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-lg bg-gray-200 border border-gray-200">

        <div className="flex-1 max-w-xs">
          <div className="relative">
            <Input
              className="pl-10 text-gray-800"
              placeholder="Buscar..."
              
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <Table
        aria-label="Dynamic Table"
        bottomContent={
          <div className="flex justify-between items-center px-4 py-2 bg-white border-t border-blue-200">
            <div className="text-sm text-gray-500">
              Mostrando {((page - 1) * rowsPerPage) + 1} a {Math.min(page * rowsPerPage, processedData.length)} de {processedData.length} registros
            </div>
            <Pagination
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
              className="text-blue-600 [&_button]:!bg-blue-600 [&_button.active]:!bg-blue-600 [&_button:hover]:!bg-blue-500"
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px] rounded-xl shadow-lg bg-white border border-blue-200",
          th: "bg-gradient-to-r from-blue-800 to-indigo-900 text-white border-b border-blue-200 font-semibold",
          td: "py-3 border-blue-100 text-gray-800 group-hover:bg-blue-50 transition-colors"
        }}
      >
        <TableHeader>
          {enhancedColumns.map((col, index) => (
            <TableColumn 
              key={`header-${String(col.key)}-${index}`}
              className={col.sortable ? 'cursor-pointer select-none' : ''}
              onClick={() => col.sortable && handleSortChange(col.key as keyof T)}
            >
              <div className="flex items-center gap-1">
                {col.label}
                {col.sortable && sortColumn === col.key && (
                  sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </div>
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody 
          items={pagedData}
          emptyContent={<div className="text-gray-500">No se encontraron registros</div>}
        >
          {(item: T) => {
            // Usar directamente la clave del item que ya es única
            const itemKey = String(item.key);
            
            return (
              <TableRow key={`row-${itemKey}`} className="hover:bg-gray-50">
                {enhancedColumns.map((col, index) => {
                  const cellKey = `cell-${itemKey}-${index}`;
                  return (
                    <TableCell key={cellKey} className="group">
                      {col.render ? col.render(item) :
                        (() => {
                          const value = item[col.key as keyof T];
                          // Detectar si es una fecha ISO
                          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)) {
                            const date = new Date(value);
                            return format(date, 'dd/MM/yyyy');
                          }
                          // Manejar objetos para evitar el error "Objects are not valid as React child"
                          if (typeof value === 'object' && value !== null) {
                            return JSON.stringify(value);
                          }
                          return value !== undefined && value !== null ? String(value) : '';
                        })()
                      }
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
};

/**
 * Función de ayuda para crear una tabla con datos de entidad
 * Esta función simplifica la creación de tablas con las columnas comunes
 * @param data Array de datos de la entidad
 * @param columns Columnas personalizadas para la entidad
 * @param idField Campo que se usará como key en la tabla
 * @param handlers Manejadores para toggle y edición
 * @param options Opciones adicionales para la tabla
 */
export function createEntityTable<T extends { [key: string]: any }>({
  data,
  columns,
  handlers,
  options = {}
}: {
  data: T[];
  columns: Column<T & { key: React.Key }>[];
  idField: keyof T;
  handlers: {
    onToggleEstado?: (item: T & { key: React.Key }) => void;
    onEdit: (item: T & { key: React.Key }) => void;
    onView?: (item: T & { key: React.Key }) => void;
  };
  options?: {
    rowsPerPage?: number;
    defaultSortColumn?: keyof (T & { key: React.Key });
    defaultSortDirection?: 'asc' | 'desc';
    includeEstado?: boolean;
    includeAcciones?: boolean;
    estadoLabel?: string;
    accionesLabel?: string;
  };
}) {
  // Preparar los datos con la propiedad key
  const preparedData = data.map((item, index) => {
    let uniqueKey: string;
    
    // Siempre generar una clave única basada en el índice y timestamp
    uniqueKey = `item-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return { 
      ...item, 
      key: uniqueKey 
    };
  });
  
  // Configuración por defecto
  const defaultOptions = {
    rowsPerPage: 10,
    defaultSortColumn: "estado" as keyof (T & { key: React.Key }),
    defaultSortDirection: 'desc' as 'asc' | 'desc',
    includeEstado: true,
    includeAcciones: true,
    estadoLabel: "Estado",
    accionesLabel: "Acciones"
  };
  
  // Combinar opciones por defecto con las proporcionadas
  const tableOptions = { ...defaultOptions, ...options };
  
  // Retornar el componente GlobalTable configurado
  return (
    <GlobalTable
      columns={columns}
      data={preparedData}
      rowsPerPage={tableOptions.rowsPerPage}
      defaultSortColumn={tableOptions.defaultSortColumn}
      defaultSortDirection={tableOptions.defaultSortDirection}
      onToggleEstado={handlers.onToggleEstado || undefined}
      onEdit={handlers.onEdit}
      onView={handlers.onView || undefined}
      includeEstado={tableOptions.includeEstado}
      includeAcciones={tableOptions.includeAcciones}
      estadoLabel={tableOptions.estadoLabel}
      accionesLabel={tableOptions.accionesLabel}
    />
  );
}

export default GlobalTable;