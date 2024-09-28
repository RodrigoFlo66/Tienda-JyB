import { Affix, Button, Table, message, Form, Popconfirm, Typography, Input, InputNumber, Layout } from 'antd';
import { EditOutlined, DeleteOutlined,WhatsAppOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import SupplierModal from './SupplierModal';
import './SupplierList.css';
const { Search } = Input;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'text' ?
    (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `Ingrese el nombre del proveedor!`,
          },
          {
            max: 29,
            message: `Has alcanzado el límite de caracteres!`,
          },
        ]}
      >
        <Input
          style={{ width: '100%' }}
          className="SupplierInput"
          id="descripcion"
          maxLength={30}
          onKeyDown={validationText}
        />
      </Form.Item>
    ) : inputType === "number" ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `Ingrese el ${title}!`,
          },
        ]}
      >
        <InputNumber
          min={4000000}
          id='telf'
          className="SupplierInput"
          style={{
            width: '100%', margin: '0 auto', textAlign: 'center'
          }}
          onKeyDown={validationNumber}
          minLength={7}
          maxLength={8}
        />

      </Form.Item>
    ) : inputType === "text2" ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: false,
          },
          {
            max: 59,
            message: `Has alcanzado el límite de caracteres!`,
          },
        ]}
      >
        <Input
          style={{ width: '100%' }}
          className="SupplierInput"
          id="descripcion"
          maxLength={60}
        />
      </Form.Item>
    ) : (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: false,
          },
        ]}

      >
        <Input
          style={{ width: '100%' }}
          className="SupplierInput"
          id="default"
          maxLength={60}
        />
      </Form.Item>
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const validationNumber = (e) => {
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
const validationText = (e) => {
  const key = e.key;
  if (!(/^[A-Z a-z À-ÿ - # % $ ' -]+$/.test(key)
    || key === 'Backspace'
    || key === 'Delete'
    || key === 'Tab'
    || key === 'ArrowLeft'
    || key === 'ArrowRight')) {
    e.preventDefault();
  }
};

const SupplierList = ({ setRefresh, isRefresh }) => {
  const [form] = Form.useForm();
  const [search, setSearch] = useState('');
  const aux = useState(isRefresh);
  const [editingId_Proveedor, setEditingId_Proveedor] = useState('');
  const isEditing = (record) => record.id_proveedor === editingId_Proveedor;
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      referenceNumber: '',
      description: '',
      ...record,
    });
    setEditingId_Proveedor(record.id_proveedor);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    if (value === '') {
      fetchData();
    } else {
      const filteredData = dataSource.filter((item) => item.nombre_proveedor.toLowerCase().includes(search.toLowerCase()));
      setDataSource(filteredData);
    }
  };

  const cancel = () => {
    setEditingId_Proveedor('');
  };

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (isRefresh) {
      fetchData();
      setRefresh(false);
    }
  }, [aux, dataSource, setDataSource]);

  async function fetchData() {
    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/store/providers/`);
    const jsonData = await response.json();
    const updatedData = jsonData.filter(item => item.id_proveedor !== 7);
    setDataSource(updatedData);
  }

  const handleDelete = async (idProvider) => {
    const res = await deleteProvider(idProvider);
    if (res.status === 200) {
      const newData = dataSource.filter((item) => item.id_proveedor !== idProvider);
      setDataSource(newData);
      message.success("El contacto del proveedor se eliminó correctamente");
    } else {
      message.warning('Problemas de comunicación con el server');
    }
  };

  const deleteProvider = async (idProvider) => {
    const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/providers/` + idProvider, {
      method: "DELETE"
    });
    return res;
  }

  const updateProviderDB = async (id_proveedor, row) => {
    const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/providers/` + id_proveedor, {
      method: "PUT",
      body: JSON.stringify(row),
      headers: { "Content-Type": "application/json" }
    });
    return res;
  }

  const save = async (idProvider) => {
    try {
      const row = await form.validateFields();
      const res = await updateProviderDB(idProvider, row);
      const jsonData = await res.json();
      if (jsonData.data === 1) {
        message.error("El proveedor " + row['nombre_proveedor'] + " ya existe ");
      } else {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => idProvider === item.id_proveedor);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setDataSource(newData);
          setEditingId_Proveedor('');
        } else {
          newData.push(row);
          setDataSource(newData);
          setEditingId_Proveedor('');
        }
        message.success("Los datos del proveedor se modificaron correctamente");
      }
    } catch (errInfo) {
      console.log('Error en la validación:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Nombre del proveedor',
      dataIndex: 'nombre_proveedor',
      width: '25%',
      editable: true,
    },
    {
      title: 'Número de Celular',
      dataIndex: 'num_proveedor',
      width: '15%',
      editable: true,
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion_proveedor',
      width: '32%',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'num_proveedor',
      width: '0.05%',
      render: (_, record) => {
        return (
          <Button href={`https://api.whatsapp.com/send?phone=${record.num_proveedor}`} 
          className='whatsapp' target='_blank' 
          style={{backgroundColor:'#ecdde1'}}><WhatsAppOutlined 
          style={{color:'#0df053', fontSize:'18px'}}/></Button>
        );
      },      
    },
    {
      title: '',

      dataIndex: 'operation',
      width: '15%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Popconfirm title="¿Está seguro de guardar los cambios?" onConfirm={() => save(record.id_proveedor)}>
              <Button name="guardar" >Guardar</Button>
            </Popconfirm>
            <Button name="cancelar" onClick={cancel}>Cancelar</Button>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingId_Proveedor !== ''} onClick={() => edit(record)}>
              <Button name="editar" ><EditOutlined /></Button>
            </Typography.Link>

            <Typography.Link >
              <Popconfirm title={"¿Estás seguro de eliminar al proveedor?"} onConfirm={() => handleDelete(record.id_proveedor)}>
                <Button name="eliminar"><DeleteOutlined /></Button>
              </Popconfirm>
            </Typography.Link>
          </span>
        )
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType
          : col.dataIndex === 'num_proveedor' ? 'number'
            : col.dataIndex === 'descripcion_proveedor' ? 'text2'
              : col.dataIndex === 'nombre_proveedor' ? 'text' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const { Header, Content } = Layout;

  return (
    <div>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          background: '#ecdde1'
        }}
        className='header'
        theme
      >
        <div><h1 style={{ fontSize: 50, textAlign: 'center', background: '#ecdde1', textShadow: "2px 2px white" }}>Proveedores</h1></div>
      </Header>

      <Content style={{ marginTop: '0%', marginLeft: '3%' }}>
        <Affix offsetTop={64}>
          <div style={{
            background: '#f5f5f5',
            display: 'flex',
            flexDirection: 'row',
            gap: '8%',
            alignItems: 'center',
            height: '75px',
            marginLeft: '0%'
          }}>
            <SupplierModal setRefresh={setRefresh}></SupplierModal>
            <Search
              placeholder="Buscar Proveedor"
              onChange={handleInputChange}
              style={{
                display: 'inline-block',
                width: 200,
              }}
            />
          </div>
        </Affix>
        <Form form={form} component={false}>
          <Table
            style={{
              marginRight: "8%",
              marginTop: "0%"
            }}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={dataSource}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: page => {
              }, pageSize: 10,
            }}
          />
        </Form>
      </Content>
    </div>
  );
}
export default SupplierList;