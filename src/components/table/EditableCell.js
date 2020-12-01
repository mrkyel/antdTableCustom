import { DatePicker, Form, Input, InputNumber, Select, TimePicker } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { EditableContext } from './EditableRow';

const EditableCell = ({
  title,
  type,
  children,
  dataIndex,
  record,
  editable,
  handleChange,
  ...restProps
}) => {
  const dateFormat = 'YYYY-MM-DD';
  const timeFormat = 'HH:mm:ss';
  const form = useContext(EditableContext);
  const inputRef = useRef();
  const [editing, setEditing] = useState(false);

  const toggleEdit = () => {
    setEditing(!editing);
    // eslint-disable-next-line no-param-reassign
    record.rowStatus = 'U';
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  useEffect(() => {
    if (editing && type === 'text') {
      inputRef.current.focus();
    }
  }, [editing]);

  const dateChange = (_, dateString) => {
    // eslint-disable-next-line no-param-reassign
    record.regdate = dateString;
  };

  const timeChange = (_, timeString) => {
    console.log(timeString);
    // eslint-disable-next-line no-param-reassign
    record.regtime = timeString;
  };

  const onChange = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleChange({ ...record, ...values });
    } catch (errInfo) {
      console.log('Change failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable && type === 'date') {
    childNode = editing ? (
      <DatePicker
        defaultValue={moment(record[dataIndex], dateFormat)}
        format={dateFormat}
        onChange={dateChange}
        onBlur={onChange}
      />
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  if (editable && type === 'time') {
    childNode = editing ? (
      <TimePicker
        value={moment(record[dataIndex], timeFormat)}
        format={timeFormat}
        onChange={timeChange}
        onBlur={onChange}
      />
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  if (editable && type === 'text') {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input onBlur={onChange} ref={inputRef} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  if (editable && type === 'number') {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <InputNumber onBlur={onChange} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  if (editable && type === 'select') {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Select style={{ width: 150 }} onBlur={onChange}>
          {[...Array(11).keys()]
            .filter(x => x > 0)
            .map(c => `Product ${c}`)
            .map((p, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Select.Option value={p} key={index}>
                {p}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
