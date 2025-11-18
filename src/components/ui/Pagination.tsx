'use client';

import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50],
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-dark-700">
      {/* Info y selector de items por página */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
        <span>
          Mostrando <span className="font-medium text-gray-100">{startItem}</span> a{' '}
          <span className="font-medium text-gray-100">{endItem}</span> de{' '}
          <span className="font-medium text-gray-100">{totalItems}</span> registros
        </span>
        
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span>Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-dark-700 border border-dark-600 text-gray-100 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Controles de navegación */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2">
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden xs:inline">Anterior</span>
          </Button>

          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`min-w-10 h-10 px-3 rounded text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-300 hover:bg-dark-700 hover:text-gray-100'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="px-2 text-gray-500">
                  {page}
                </span>
              )
            ))}
          </div>

          {/* Indicador de página para móviles */}
          <div className="sm:hidden flex items-center px-3 text-sm text-gray-400">
            Página {currentPage} de {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className="gap-1"
          >
            <span className="hidden xs:inline">Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
