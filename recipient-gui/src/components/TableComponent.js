import React, { useMemo, useState } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';

const TableComponent = ({data, refreshTable}) => {
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

  const handleDelete = async (id) => {
    // 处理删除按钮点击事件
    console.log('Delete button clicked for id:', id);
    // 弹出确认对话框
    const isConfirmed = window.confirm('Are you sure to delete this recipient?');

    // 如果用户点击确认，则执行删除操作
    if (isConfirmed) {
        // 执行删除逻辑
        // 可以调用删除用户的 API 或其他相应的操作
        const response = await axios.post('http://localhost:3001/users/delete', {id: id});
        console.log('Confirmed...');
        refreshTable();
    } else {
        // 用户点击取消，不执行删除操作
        console.log('Cancelled');
    }
    
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
