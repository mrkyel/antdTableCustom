import React, { useEffect, useState } from 'react';
import {
  Table,
  Popconfirm,
  Button,
  Menu,
  Dropdown,
  Checkbox,
  Form,
} from 'antd';
import Popup from './Popup';
import TableData from './TableData';
import EditableCell from './EditableCell';

const TableComponent = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = record => record.key === editingKey;
  const columns = [
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
    {
      title: 'operation',
      dataIndex: 'operation',
      width: '8%',
      render: (_, record) => {
        const editable = isEditing(record);
        console.log(editable);
        return editable ? (
          <span>
            <a
              role="button"
              tabIndex={0}
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <a
            role="button"
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          >
            Edit
          </a>
        );
      },
    },
    {
      title: 'delete',
      dataIndex: 'delete',
      width: '8%',
      render: (_, record) =>
        data.length >= 1 ? (
          <Popconfirm
            title="정말 지우시겠습니까?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>삭제</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const [tableState, setTableState] = useState({
    popup: {
      visible: false,
      x: 0,
      y: 0,
    },
    checkedColumns: [],
    visibleMenuSettings: false,
    initialColumns: [],
  });

  useEffect(() => {
    setTableState(prev => ({ ...prev, initialColumns: columns }));
  }, []);

  const handleVisibleChange = flag => {
    setTableState(prev => ({ ...prev, visibleMenuSettings: flag }));
  };

  const edit = record => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      regdate: '',
      regtime: '',
      product: '',
      ...record,
    });
    setEditingKey(record.key);
    console.log(`클릭${record.key}`);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
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

  const [data, setData] = useState(TableData);

  const rowSelection = {
    onSelect: selectedRows => {
      console.log(selectedRows);
    },
  };

  const editableColumns = columns.map(col => {
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
        editing: isEditing(record),
      }),
    };
  });

  const handleDelete = key => {
    setData(data.filter(item => item.key !== key));
  };

  const handleAdd = () => {
    const newData = {
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
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
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
      </Form>
      <Popup {...tableState.popup} />
    </>
  );
};

export default TableComponent;
