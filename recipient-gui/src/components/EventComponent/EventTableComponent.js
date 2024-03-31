import React, { useMemo, useState } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import '../../styles/TableComponent.css';

const PresenterTableComponent = ({data, refreshTable}) => {
    const [formData, setFormData] = useState({
        title: '',
        presenter_name: '',
        presenter_id: '',
        date: '',
        venue: '',
        description: '',
        keywords: '',
        url: '',
        is_seminar: '',
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
      { Header: 'Title', accessor: 'title'},
      { Header: 'Presenter Name', accessor: 'name' },
      { Header: 'Presenter ID', accessor: 'speaker'},
      { Header: 'Date & Time', accessor: 'date'},
      { Header: 'Location', accessor: 'venue'},
      { Header: 'Description', accessor: 'description'},
      { Header: 'Keywords', accessor: 'keywords'},
      { Header: 'Url', accessor: 'url'},
      { Header: 'Is Seminar', accessor: 'is_seminar',
        Cell: ({ row }) => (
        row.original.is_seminar ? 'true' : 'false'
      ),},

      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <button onClick={() => handleDelete(row.original.id, row.original.title)}>Delete</button>
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
        title:row.values.title, 
        speaker:row.values.speaker,  
        date:row.values.date,
        venue:row.values.venue,
        description:row.values.description,
        keywords:row.values.keywords,
        url:row.values.url,
        is_seminar:row.values.is_seminar.toString()
    })
    console.log(row)
  };

  const handleDelete = async (id, title) => {
    // 处理删除按钮点击事件
    console.log('Delete button clicked for id:%d, title:%s', id, title);
    // 弹出确认对话框
    const isConfirmed = window.confirm(`Are you sure to delete this seminar \n\n"${title}"? \n\n This is a cascading deletion, which will also delete the presenter of the event.`);

    // 如果用户点击确认，则执行删除操作
    if (isConfirmed) {
        // 执行删除逻辑
        // 可以调用删除用户的 API 或其他相应的操作
        const response = await axios.post('http://localhost:3001/event/delete', {id: id});
        console.log('Deleted ', response);
        refreshTable();
    } else {
        // 用户点击取消，不执行删除操作
        console.log('Cancelled');
    }
    
  };

  const handleUpdate = async (id) => {
    try {
      // verify existence of required fields
      if (!formData.title) {
        alert('Title is required');
        return;
      }
      if (!formData.speaker) {
        alert('Presenter ID is required');
        return;
      }
      if (!formData.date) {
        alert('Date & Time are required');
        return;
      }
      if (!formData.venue) {
        alert('Location is required');
        return;
      }
      if (!formData.description) {
        alert('Description is required');
        return;
      }
      if (!formData.keywords) {
        alert('Keywords are required');
        return;
      }
      if (!formData.url) {
        alert('Url is required');
        return;
      }
      if (!formData.is_seminar) {
        alert('Is Seminar is required');
        return;
      }
      // 弹出确认对话框
      const isConfirmed = window.confirm('Are you sure to update this event?');

      if(isConfirmed){
        // 发送update请求到服务器
        const response = await axios.post('http://localhost:3001/event/update', {formData,id:id}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 处理update成功的逻辑
        console.log('Event updated:', response.data);
        refreshTable();
      } else {
        // 用户点击取消，不执行删除操作
        console.log('Cancelled');
    }

    } catch (error) {
      console.error('Error updating event', error);
      alert('Error updating event');
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
                    <td {...cell.getCellProps()} style={{ padding: '10px' , borderRight: '1px solid black',borderBottom: '1px solid black',}} 
                          onClick={()=> {
                          console.log(cell);
                      }}>
                      {cell.render("Cell")}
                      {isSelected && (

                              <tr>
                                  <td colSpan={columns.length}>
                                      {cell.column.Header === "Actions" ? (
                                              <button onClick={() => handleUpdate(row.original.id)}>Update</button>
                                          ):(
                                            cell.column.Header === "Presenter Name" ? null :(
                                          <textarea name={cell.column.id} cols={cell.column.id==="description" || cell.column.id==="url"?60:25} rows="5" value={formData[cell.column.id]} onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur}/>
                                            ))
                                      }
                                      {cell.column.Header === "Presenter ID" ? (<div className='inline-notification'>Presenter ID should exist in Presenter table!<br/>Otherwise errors may occur!</div>):null}
                                      
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
