import React, { useMemo, useState } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import '../../styles/TableComponent.css';

const PresenterTableComponent = ({data, refreshTable}) => {
    const [formData, setFormData] = useState({
        name: '',
        organization: '',
        interest: '',
        google_scholar_id: ''
    });
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }; 
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleFocus = () => {
    setIsInputFocused(true);
  };
  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const [selectedRow, setSelectedRow] = useState(null);
  

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Organization', accessor: 'organization' },
      { Header: 'Google Scholar ID', accessor: 'google_scholar_id' },
      {
        Header: 'Interests',
        accessor: 'interest',
        Cell: ({ row }) => (
          <div>
            {Array.isArray(row.original.interest)
              ? row.original.interest.join(', ')
              : row.original.interest}
          </div>
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <button onClick={() => handleDelete(row.original.id, row.original.name)}>Delete</button>
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
    setFormData({
        name:row.values.name, 
        organization:row.values.organization, 
        google_scholar_id:row.values.google_scholar_id, 
        interest:row.values.interest,
    })
    console.log(row)
  };

  const handleDelete = async (id, name) => {
    // 处理删除按钮点击事件
    console.log('Delete button clicked for id:%d, name:%s', id, name);
    // 弹出确认对话框
    const isConfirmed = window.confirm(`Are you sure to delete this presenter "${name}"?`);

    // 如果用户点击确认，则执行删除操作
    if (isConfirmed) {
        // 执行删除逻辑
        // 可以调用删除用户的 API 或其他相应的操作
        const response = await axios.post('http://localhost:3001/presenter/delete', {id: id});
        console.log('Deleted ', response);
        refreshTable();
    } else {
        // 用户点击取消，不执行删除操作
        console.log('Cancelled');
    }
    
  };

  const handleUpdate = async (id) => {
    try {
      // 验证邮箱
      if (!formData.name) {
        alert('Name is required');
        return;
      }
      // 弹出确认对话框
      const isConfirmed = window.confirm('Are you sure to update this presenter?');

      if(isConfirmed){
        // transform string array to string, ONLY FOR INTEREST
        if (Array.isArray(formData.interest)){
            formData.interest = formData.interest.join(', ')
        }
        // 发送update请求到服务器
        const response = await axios.post('http://localhost:3001/presenter/update', {formData,id:id}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 处理update成功的逻辑
        console.log('User updated:', response.data);
        refreshTable();
      } else {
        // 用户点击取消，不执行删除操作
        console.log('Cancelled');
    }

    } catch (error) {
      console.error('Error updating user', error);
      alert('Error updating user');
    }
  }


  return (
    <div className='table-container'>
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
                  onClick={() => {
                      if (!isInputFocused){
                          handleRowClick(row)
                      }
                      
                  }}
                >

                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} style={{ padding: '10px' }} 
                          onClick={()=> {
                          console.log(cell);
                      }}>
                      {cell.render("Cell")}
                      {/* {cell.isEditable ? (
                          <div>
                              {console.log('Cell Info:', cell)}
                          </div>
                      //   <EditableCell value={cell.value} row={row} column={cell.column} />
                      ) : (
                          cell.render('Cell')
                      )} */}
                      {isSelected && (

                              <tr>
                                  <td colSpan={columns.length}>
                                      {cell.column.Header === "Actions" ? (
                                              <button onClick={() => handleUpdate(row.original.id)}>Update</button>
                                          ):(
                                            cell.column.Header === "ID" ? null :(
                                          <textarea name={cell.column.id} cols={cell.column.id==="interest"?50:25} rows="5" value={formData[cell.column.id]} onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur}/>
                                            ))
                                      }
                                      
                                  </td>
                              </tr>

                      )}
                    </td>
                  ))}
                </tr>

              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PresenterTableComponent;
