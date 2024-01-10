import React, { useMemo, useState } from 'react';
import { useTable } from 'react-table';

const TableComponent = ({data}) => {
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = useMemo(
    () => [
      { Header: 'Email', accessor: 'email' },
      { Header: 'Organization', accessor: 'organization' },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <button onClick={() => handleDelete(row.original.id)}>Delete</button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  const handleRowClick = (row) => {
    // 处理行点击事件
    setSelectedRow(row.id === selectedRow ? null : row.id);
  };

  const handleDelete = (id) => {
    // 处理删除按钮点击事件
    console.log('Delete button clicked for id:', id);
  };


  return (
    <table {...getTableProps()} style={{ border: '1px solid black' }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} style={{ padding: '10px', borderBottom: '1px solid black' }}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      
        {rows.map((row) => {
          prepareRow(row);
          const isSelected = row.id === selectedRow;
          return (
            <React.Fragment key={row.id}>
              <tr
                {...row.getRowProps()}
                style={{
                  borderBottom: '1px solid black',
                  cursor: 'pointer',
                  background: isSelected ? '#f0f0f0' : 'inherit',
                }}
                onClick={() => handleRowClick(row)}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} style={{ padding: '10px' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableComponent;
