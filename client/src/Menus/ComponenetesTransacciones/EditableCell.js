import React from "react";
import { Form, Input, InputNumber, Select } from "antd";
import moment from "moment";
import './EditableCell.css';
const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  dataSourceCliente,
  dataSoureceProveedor,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
 
  const inputNode = inputType === 'date' ? (
    <Form.Item
      style={{ margin: 0 }}
      name={dataIndex}
      rules={[
        {
          validator: (_, value) => {
            if (!value) {
              return Promise.resolve();
            }
            const fech = record.fecha_compra;
            const maxDate = moment(fech, 'YYYY-MM-DD').add(5, 'years');
            const isValidDate = moment(value, 'YYYY-MM-DD', true).isValid();
            const minDate = moment(fech, 'YYYY-MM-DD');
            const inputDate = moment(value, 'YYYY-MM-DD');

            if (!isValidDate) {
              return Promise.reject('Dato invalido. Por favor use el formato YYYY-MM-DD.');
            } else if (inputDate.isBefore(minDate)) {
              return Promise.reject('La fecha no puede ser menor a ' + fech);
            } else if (inputDate.isAfter(maxDate)) {
              return Promise.reject('La fecha no puede ser mayor a ' + maxDate.format('YYYY-MM-DD'));
            }

            return Promise.resolve();
          },
        },
        
      ]}
    >
      <Input
        style={{
          backgroundColor: "#fff6ed"
        }}
        onKeyDown={validationf}
        maxLength={10}
      />

    </Form.Item>


  ) : inputType === "number" ? (
    <Form.Item
      style={{ margin: 0}}
      name={dataIndex}
      rules={[

        {
          validator: (_, value) => {
            const isValidNumber = /^[0-9]+([.][0-9]+)?$/.test(value);
            if (isValidNumber) {
              return Promise.resolve();
            }
            return Promise.reject('Por favor ingrese un valor valido');
          },
        },
      ]}


    >
      <InputNumber
        style={{ width: '100%', margin: '0 auto', textAlign: 'center'}}
        prefix="Bs."
        className="inputNumber"
        id="precio"
        min={1}
        maxLength={9}
        precision={2}
        step={0.5}
        onKeyDown={DecimalInput} />
    </Form.Item>
  ) : inputType === "pago" ? (
    <Form.Item
      style={{ margin: 0}}
      name={dataIndex}
      rules={[
        {
          required: true,
          message: 'Select something!',
        },
      ]}
      >
        <Select className="select" style={{ width: 120 }} bordered={false}>
          <Option value='Contado'>
            Contado
          </Option>
          <Option value='Credito' >Credito</Option>
        </Select>
        
       
    </Form.Item>
    
  ) : inputType === "cliente" ? (
    <Form.Item
      style={{ margin: 0 }}
      name={dataIndex}
      rules={[
        {
          //required: true,
          //message: `Por favor llene el campo  ${title}!`,
        },
        {
          validator: (rule, value) => {
            if (value == null) {
              return Promise.resolve();
            } else if (/\s{2,}/.test(value)) {
              return Promise.reject("No se permiten más de un espacio consecutivo");
            } else if (/^(?:[a-zA-Z][\w\s]*[a-zA-Z]|[a-zA-Z]?)$/.test(value)) {
              return Promise.resolve();
            } else {
              return Promise.reject("El primer y último carácter deben ser una letra");
            }
          }
        },
      ]}
    >
      <Input
        style={{
          backgroundColor: "#fff6ed"
        }}
        onKeyDown={validationName}
        maxLength={30}
      />

    </Form.Item>
  ) : inputType === "cliente2" ? (
    <Form.Item
  style={{ margin: 0}}
  name={dataIndex}
  rules={[
    {
      required: true,
      message: 'Select something!',
    },
  ]}
>
  <Select className="select" style={{ width: 220 }} bordered={false}>
    {dataSourceCliente.map((cliente) => (
      <Option key={cliente.id_cliente} value={cliente.nombre_cliente}>
        {cliente.nombre_cliente}
      </Option>
    ))}
  </Select>
</Form.Item>
  ) : inputType === "proveedor" ? (
    <Form.Item
  style={{ margin: 0}}
  name={dataIndex}
  rules={[
    {
      required: true,
      message: 'Select something!',
    },
  ]}
>
  <Select className="select" style={{ width: 220 }} bordered={false}>
    {dataSoureceProveedor.map((proveedor) => (
      <Option key={proveedor.id_proveedor} value={proveedor.nombre_proveedor}>
        {proveedor.nombre_proveedor}
      </Option>
    ))}
  </Select>
</Form.Item>
  ) : (
    <Form.Item
      style={{ margin: 0 }}
      name={dataIndex}
      rules={[
        {
          required: true,
          message: `Por favor llene el campo  ${title}!`,
        },
      ]}
    >
      <InputNumber
        min={1}
        style={{
          backgroundColor: "#fff6ed",
          width: '100%', margin: '0 auto', textAlign: 'center'
        }}
        onKeyDown={validation}
        maxLength={6}
      />

    </Form.Item>
  );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};



const DecimalInput = (e) => {

  const key = e.key;
  if (!(/^[0-9.]+$/.test(key)
    || key === 'Backspace'
    || key === 'Delete'
    || key === 'Tab'
    || key === 'ArrowLeft'
    || key === 'ArrowRight')) {
    e.preventDefault();
  }
};

const validation = (e) => {

  const key = e.key;
  if (!(/^[0-9]+$/.test(key)
    || key === 'Backspace'
    || key === 'Delete'
    || key === 'Tab'
    || key === 'ArrowLeft'
    || key === 'ArrowRight')) {
    e.preventDefault();
  }
};

const validationf = (e) => {

  const key = e.key;
  if (!(/^[0-9-]+$/.test(key)
    || key === 'Backspace'
    || key === 'Delete'
    || key === 'Tab'
    || key === 'ArrowLeft'
    || key === 'ArrowRight')) {
    e.preventDefault();
  }
};
const validationName = (e) => {

  const key = e.key;
  if (!(/^[A-Za-z\s]+$/.test(key)
    || key === 'Backspace'
    || key === 'Delete'
    || key === 'Tab'
    || key === 'ArrowLeft'
    || key === 'ArrowRight')) {
    e.preventDefault();
  }
};


export default EditableCell;