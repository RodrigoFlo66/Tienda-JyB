import './ListaBotones.css';
import { Affix, Table, Popconfirm, Button, message, Form, Typography, Input, Layout } from 'antd';
import { EditOutlined, DeleteOutlined,WhatsAppOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import ClientModal from './ClientModal';
import defaultLogo from '../../Imagenes/imgW.png'
import './ClientList.css';

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
          style={{ width: '100%' }}
          className="SupplierInput"
          id="descripcion"
          maxLength={30}
          onKeyDown={validationName}
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
            max: 8,
            message: `Has alcanzado el límite de caracteres!`,
          },
        ]}
      >
        <Input
          style={{ width: '100%' }}
          className="SupplierInput"
          id="descripcion"
          maxLength={8}
          minLength={7}
          onKeyDown={validation}
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
          rules={[
            {
              required: true,
              message: `Por favor ingrese los datos requeridos!`,
            },
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


const ClientList = ({ setRefresh, isRefresh }) => {

  const [search, setSearch] = useState('');
  const [form] = Form.useForm();
  const aux = useState(isRefresh);

  const [editingId_Client, setEditingId_Client] = useState('');
  const isEditing = (record) => record.id_cliente === editingId_Client;
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      referenceNumber: '',
      ...record,
    });
    setEditingId_Client(record.id_cliente);

  };

  const cancel = () => {
    setEditingId_Client('');
  };

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (isRefresh) {
      fetchData();
      setRefresh(false);
    }
  }, [aux, dataSource, setDataSource]);

  async function fetchData() {
    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/store/clients/`);
    const jsonData = await response.json();
    const updatedData = jsonData.filter(item => item.id_cliente !== 7);
    setDataSource(updatedData);
  }


  const handleDelete = async (idCliente) => {
    const res = await deleteClient(idCliente);
    if (res.status === 200) {
      const newData = dataSource.filter((item) => item.id_cliente !== idCliente);
      setDataSource(newData);
      message.success("El contacto del cliente se eliminó correctamente");
    } else {
      message.warning('Problemas de comunicacion con el server');
    }

  };

  const deleteClient = async (idCliente) => {
    const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/clients/` + idCliente, {
      method: "DELETE"
    });
    return res;
  }

  const save = async (idCliente) => {
    var res;
    const row = await form.validateFields();
    console.log(row);
    res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/clients/` + idCliente, {
      method: "PUT",
      body: JSON.stringify(row),
      headers: { "Content-Type": "application/json" }
    });

    console.log(res);
    if (res.status === 404) {
      message.warning('El Cliente no existe, por favor actualice la sección');
    } else if (res.status === 200) {
      try {

        const newData = [...dataSource];
        const index = newData.findIndex((item) => idCliente === item.id_cliente);

        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setDataSource(newData);
          setEditingId_Client('');
        } else {
          newData.push(row);
          setDataSource(newData);
          setEditingId_Client('');
        }
        message.success("El cliente se modificó correctamente");
      } catch (errInfo) {
        console.log('Error en la validación:', errInfo);
      }
    } else if (res.status === 202) {
      const jsonData = await res.json();
      if (jsonData.data === 1) {
        message.error("El cliente " + row['nombre_cliente'] + " ya existe ");
      }
      if (jsonData.data === 2) {
        message.error("El número " + row['num_cliente'] + " ya ha sido seleccionado ");
      }
    } else {
      message.warning('Problemas de comunicacion con el server');
    }

  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearch(value);

    if (value === '') {
      fetchData();
    } else {
      const filteredData = dataSource.filter((item) => item.nombre_cliente.toLowerCase().includes(search.toLowerCase()));
      setDataSource(filteredData);
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre_cliente',
      width: '15%',
      editable: true,
    },
    {
      title: 'Número de Celular',
      dataIndex: 'num_cliente',
      width: '15%',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'num_cliente',
      width: '0.05%',
      render: (_, record) => {
        return (
          <Button href={`https://api.whatsapp.com/send?phone=${record.num_cliente}`} 
          className='whatsapp' target='_blank' 
          style={{backgroundColor:'#ecdde1'}}><WhatsAppOutlined 
          style={{color:'#0df053', fontSize:'18px'}}/></Button>
        );
      },
    },

    {
      title: '',
      dataIndex: 'operation',
      width: '5%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>

            <Popconfirm
              title="¿Estás seguro de editar los datos del cliente?"
              onConfirm={async () => {
                try {
                  await save(record.id_cliente);
                } catch (error) {
                  console.error(error);
                  message.error("Por favor asegúrese que los valores en los campos sean correctos");
                }
              }}
              placement="bottom"
            >
              <Button name="guardar" >Guardar</Button>
            </Popconfirm>

            <Button name="cancelar" onClick={cancel}>Cancelar</Button>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingId_Client !== ''} onClick={() => edit(record)}>
              <Button name="editar" ><EditOutlined /></Button>
            </Typography.Link>

            <Typography.Link >
              <Popconfirm title={"¿Estás seguro de eliminar al Cliente?"} onConfirm={() => handleDelete(record.id_cliente)}>
                <Button name="eliminar"
                ><DeleteOutlined /></Button>
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
        inputType:
          col.dataIndex === 'nombre_cliente'
            ? 'text' :
            col.dataIndex === 'num_cliente'
              ? 'text2' :
              'text',
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
        <div><h1 style={{ fontSize: 50, textAlign: 'center', background: '#ecdde1', textShadow: "2px 2px white" }}>Clientes</h1></div>
      </Header>

      <Content style={{ marginTop: '0%', marginLeft: '3%', width: '90%' }}>
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
            <ClientModal setRefresh={setRefresh}>Añadir Cliente</ClientModal>

            <Search
              placeholder="Buscar Cliente"
              onChange={handleInputChange}
              style={{ width: 200 }}
            />
          </div>
        </Affix>
        <Form form={form} component={false}
        >
          <Table className='tabla'
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
              onChange: cancel,
            }}
            style={{
              width: '100%',
              left: '-20%'
            }}
          />
        </Form>
      </Content>

    </div>
  );

};
export default ClientList;