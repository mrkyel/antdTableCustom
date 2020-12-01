import { DatePicker, Form, Input, InputNumber, Select, TimePicker } from 'antd';
import React from 'react';
import moment from 'moment';

const EditableCell = ({
  title,
  type,
  children,
  dataIndex,
  record,
  editing,
  ...restProps
}) => {
  const dateFormat = 'YYYY-MM-DD';
  const timeFormat = 'HH:mm:ss';

  const dateChange = (_, dateString) => {
    // eslint-disable-next-line no-param-reassign
    record.regdate = dateString;
  };

  const timeChange = (_, timeString) => {
    console.log(timeString);
    // eslint-disable-next-line no-param-reassign
    record.regtime = timeString;
  };

  let childNode = children;

  if (editing && type === 'date') {
    childNode = editing ? (
      <DatePicker
        defaultValue={moment(record[dataIndex], dateFormat)}
        format={dateFormat}
        onChange={dateChange}
      />
    ) : (
      children
    );
  }

  if (editing && type === 'time') {
    childNode = editing ? (
      <TimePicker
        value={moment(record[dataIndex], timeFormat)}
        format={timeFormat}
        onChange={timeChange}
      />
    ) : (
      children
    );
  }

  if (editing && type === 'text') {
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
        <Input />
      </Form.Item>
    ) : (
      children
    );
  }

  if (editing && type === 'number') {
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
        <InputNumber />
      </Form.Item>
    ) : (
      children
    );
  }

  if (editing && type === 'select') {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Select style={{ width: 150 }}>
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
      children
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
