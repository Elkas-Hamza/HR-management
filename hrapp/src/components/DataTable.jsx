import React from 'react';
import { useTranslation } from 'react-i18next';

const DataTable = ({ columns, data, onEdit, onDelete, onView }) => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                {col.header}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
              {t('common.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-4 text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 border-b">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm text-gray-900">
                    {col.render ? col.render(row) : row[col.field]}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        className="text-blue-600 hover:text-blue-800"
                        title={t('common.view')}
                      >
                        👁️
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-green-600 hover:text-green-800"
                        title={t('common.edit')}
                      >
                        ✏️
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="text-red-600 hover:text-red-800"
                        title={t('common.delete')}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
