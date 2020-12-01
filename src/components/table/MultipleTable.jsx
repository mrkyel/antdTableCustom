import React, { useEffect, useState } from 'react';
import { Table, Button, Menu, Dropdown, Checkbox } from 'antd';
import Popup from './Popup';
import TableData from './TableData';
import EditableCell from './EditableCell';
import EditableRow from './EditableRow';

const MultipleTable = () => {
  const [data, setData] = useState(TableData);
  const [tableState, setTableState] = useState({
    popup: {
      visible: false,
      x: 0,
      y: 0,
    },
    checkedColumns: [],
    visibleMenuSettings: false,
    initialColumns: [],
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        width: 120,
        editable: true,
        type: 'text',
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Age',
        dataIndex: 'age',
        width: 10,
        editable: true,
        type: 'number',
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Address',
        dataIndex: 'address',
        width: 200,
        editable: true,
        type: 'text',
        sorter: (a, b) => a.address.localeCompare(b.address),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'RegDate',
        dataIndex: 'regdate',
        width: 100,
        editable: true,
        type: 'date',
        sorter: (a, b) => a.regdate.localeCompare(b.regdate),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'RegTime',
        dataIndex: 'regtime',
        width: 100,
        editable: true,
        type: 'time',
        sorter: (a, b) => a.regtime.localeCompare(b.regtime),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Product',
        dataIndex: 'product',
        width: 100,
        editable: true,
        type: 'select',
      },
    ],
  });

  const [rowArrays, setRowArrays] = useState([]);
  console.log(rowArrays);

  useEffect(() => {
    setTableState(prev => ({ ...prev, initialColumns: tableState.columns }));
  }, []);

  const handleVisibleChange = flag => {
    setTableState(prev => ({ ...prev, visibleMenuSettings: flag }));
  };

  const handleChange = row => {
    const newData = [...data];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setData(newData);
  };

  const saveEdit = () => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].rowStatus === 'C' || data[i].rowStatus === 'U')
        console.log('수정할 목록이 존재함');
    }
  };

  const onChange = e => {
    let { checkedColumns } = tableState;
    if (e.target.checked) {
      checkedColumns = checkedColumns.filter(el => {
        return el !== e.target.id;
      });
    } else if (!e.target.checked) {
      checkedColumns.push(e.target.id);
    }

    let filtered = tableState.initialColumns;
    for (let i = 0; i < checkedColumns.length; i++) {
      filtered = filtered.filter(el => {
        return el.dataIndex !== checkedColumns[i];
      });
    }
    setTableState(prev => ({ ...prev, columns: filtered, checkedColumns }));
  };

  const menu = (
    <Menu>
      <Menu.ItemGroup title="Columns">
        {tableState.initialColumns.map(el => (
          <Menu.Item key={el.dataIndex + el.title}>
            <Checkbox id={el.dataIndex} onChange={onChange} defaultChecked>
              {el.title}
            </Checkbox>
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    </Menu>
  );

  const rowSelection = {
    onSelect: (selectedRows, selected) => {
      console.log('개별');
      if (selected) rowArrays.push(selectedRows);
      else setRowArrays([]);
      console.log(rowArrays);
    },
    onSelectAll: (selected, changeRows) => {
      console.log(changeRows);
      const changedRows = changeRows.filter(item => {
        return item !== null && item !== undefined;
      });
      if (selected) {
        for (let i = 0; i < changedRows.length; i++) {
          rowArrays.push(changedRows[i]);
        }
      } else {
        console.log(rowArrays.length);
        setRowArrays([]);
      }
      console.log(rowArrays);
    },
  };

  const editableColumns = tableState.columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        type: col.type,
        dataIndex: col.dataIndex,
        title: col.title,
        handleChange,
        editable: col.editable,
      }),
    };
  });

  const handleDelete = () => {
    console.log(rowArrays.length);
    for (let i = 0; i < rowArrays.length; i++) {
      setData(prev => prev.filter(item => item.key !== rowArrays[i].key));
    }
  };

  const handleAdd = () => {
    const newData = {
      rowStatus: 'C',
      key: data.length,
      name: `한결 ${data.length}`,
      age: 33,
      address: `서울 서울 ${data.length}`,
      regdate: '2020-09-26',
      regtime: '00:00:00',
      product: `Product ${data.length}`,
    };
    setData([...data, newData]);
  };

  const onRow = record => ({
    onContextMenu: e => {
      e.preventDefault();
      if (!tableState.popup.visible) {
        document.addEventListener(`click`, function onClickOutside() {
          setTableState(prev => ({ ...prev, popup: { visible: false } }));
          document.removeEventListener(`click`, onClickOutside);
        });
      }
      setTableState(prev => ({
        ...prev,
        popup: { record, visible: true, x: e.clientX, y: e.clientY },
      }));
    },
  });

  return (
    <>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a Row
      </Button>
      <Dropdown
        overlay={menu}
        onVisibleChange={handleVisibleChange}
        visible={tableState.visibleMenuSettings}
      >
        <Button>보이기/숨기기</Button>
      </Dropdown>
      <Button
        onClick={saveEdit}
        type="primary"
        style={{ marginBottom: 16, float: 'right' }}
      >
        수정
      </Button>
      <Button
        onClick={handleDelete}
        type="primary"
        style={{ marginBottom: 16, float: 'right' }}
      >
        삭제
      </Button>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        rowSelection={rowSelection}
        rowClassName="editable-row"
        bordered
        columns={editableColumns}
        dataSource={data}
        pagination={{ position: ['bottomCenter'] }}
        onRow={onRow}
        // scroll={{ x: '120%' }}
        // scroll={{ y: '100%' }}
        size="big"
      />
      <Popup {...tableState.popup} />
    </>
  );
};

export default MultipleTable;
