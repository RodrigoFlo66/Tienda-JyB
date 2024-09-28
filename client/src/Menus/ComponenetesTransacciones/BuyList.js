import { Affix, Table, Popconfirm, Button, message, Form, Typography, Input, DatePicker, Layout } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import moment from "moment";
import EditableCell from "./EditableCell";
import "./BuyList.css";
import defaultLogo from '../../Imagenes/Logo Peq.png';

const { Search } = Input;

const BuyList = ({ setRefresh, isRefresh }) => {

  const aux = useState(isRefresh);
  const [search, setSearch] = useState('');

  const [form] = Form.useForm();

  //Para la seleccion de fechas
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [editingid_lote, setEditingid_lote] = useState('');
  const isEditing = (record) => record.id_lote === editingid_lote;
  const edit = (record) => {
    record.fecha_caducidad = record.fecha_caducidad ? dayjs(record.fecha_caducidad).format('YYYY-MM-DD') : "";
    record.fecha_compra = record.fecha_compra ? dayjs(record.fecha_compra).format('YYYY-MM-DD') : "";
    form.setFieldsValue({
      name: '',
      ...record,
    });
    setEditingid_lote(record.id_lote);
  };

  const cancel = () => {
    setEditingid_lote('');
  };

  const [dataSource, setDataSource] = useState([]);
  const [copia, setCopia] = useState([]);
  const [dataSoureceProveedor, setDataSourceProveedor] = useState([]);


  useEffect(() => {
    if (isRefresh) {
      fetchData();
      setRefresh(false);
    }
  }, [aux, dataSource, setDataSource]);

  async function fetchData() {
    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/store/products/allbuy/1`);
    const jsonData = await response.json();
    for (var clave in jsonData) {
      jsonData[clave]['fecha_caducidad'] = moment(jsonData[clave]['fecha_caducidad']).add(1, 'day');
      jsonData[clave]['fecha_compra'] = moment(jsonData[clave]['fecha_compra']).add(1, 'day');
    }
    for (var clave in jsonData) {
      if (!moment(jsonData[clave]['fecha_caducidad']).isValid()) {
        jsonData[clave]['fecha_caducidad'] = null;
      }
      if (!moment(jsonData[clave]['fecha_compra']).isValid()) {
        jsonData[clave]['fecha_compra'] = null;
      }
    }
    setDataSource(jsonData);
    setCopia(jsonData);
  }

  useEffect(() => {
    if (isRefresh) {
      fetchData2();
      setRefresh(false);
    }
  }, []);
  async function fetchData2() {
    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/store/providers/`);
    const jsonData = await response.json();
    setDataSourceProveedor(jsonData);
  }

  const handleDateChange = (date, dateString) => {
    if (dateString !== null) {
      dateString = moment(dateString).add(1, 'day')
      dateString = dayjs(dateString).format('YYYY-MM-DD')
      setDesde(dateString);
      filterData(dateString, hasta)
    }
  };

  const handleDateChange2 = (date, dateString) => {
    if (dateString !== null) {
      dateString = moment(dateString).add(1, 'day')
      dateString = dayjs(dateString).format('YYYY-MM-DD')
      setHasta(dateString);
      filterData(desde, dateString)
    }
  };

  const filterData = (start, end) => {
    console.log(start);
    console.log(end);
    const filtered = copia.filter((item) => {
      const itemDate = new Date(item.fecha_compra); // Asume que hay una propiedad "date" en cada objeto del JSON
      // Filtrar si la fecha está dentro del rango seleccionado
      if (start !== "" && end === "") {
        return itemDate >= new Date(start);
      } else if (end !== "" && start === "") {
        return itemDate <= new Date(end);
      } else if (start !== "" && end !== "") {
        return itemDate >= new Date(start) && itemDate <= new Date(end);
      }
    });
    setDataSource(filtered);
  };

  const handleDelete = async (id_lote) => {
    const res = await deleteProductDB(id_lote);
    if (res.status === 200) {
      const newData = dataSource.filter((item) => item.id_lote !== id_lote);
      setDataSource(newData);
      message.success("La compra se eliminó correctamente");
    } else {
      message.warning('Problemas de comunicaion con el server');
    }

  };

  const deleteProductDB = async (id_lote) => {
    //Ruta para server en localhost: "http://localhost:8080/store/products/buy/"
    //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/products/buy/`
    const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/products/buy/` + id_lote, {
      method: "DELETE"
    });
    return res;
  }

  const save = async (id_lote) => {
    var res;
    const row = await form.validateFields();
    let numero = (row.costo_total / row.cantidad).toFixed(2);
    row.costo_unitario = numero;
    if (row.fecha_caducidad === '') {
      row.fecha_caducidad = null;
    }

    //Ruta para server en localhost: "http://localhost:8080/store/products/buy/"
    //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/products/buy/`
    res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/products/buy/` + id_lote, {
      method: "PUT",
      body: JSON.stringify(row),
      headers: { "Content-Type": "application/json" }
    });

    //fetchBuys();
    if (res.status === 200) {
      try {

        const newData = [...dataSource];
        const index = newData.findIndex((item) => id_lote === item.id_lote);

        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setDataSource(newData);
          setEditingid_lote('');

        } else {
          newData.push(row);
          setDataSource(newData);
          setEditingid_lote('');
        }
      } catch (errInfo) {
        console.log('Error en la validación:', errInfo);
      }

      message.success("La compra se modificó correctamente");
    } else {
      message.warning('Problemas de comunicaion con el server');
    }

  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearch(value);

    if (value === '') {
      fetchData();
    } else {
      const filteredData = dataSource.filter((item) =>
        item.nombre_producto.toLowerCase().includes(value.toLowerCase())
      );
      setDataSource(filteredData);
    }
  };


  const columns = [
    {
      title: '',
      dataIndex: 'imagen',
      width: '10%',
      editable: false,
      render: (_, record) => {
        return (
          <span>
            <img src= {record.imagen === "Sin imagen" ? defaultLogo : record.imagen} alt="Imagen_Producto" className="img" />
          </span>
        );
      },      
    },
	
    {
      title: 'Producto',
      dataIndex: 'nombre_producto',
      width: '15%',
      editable: false,
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      width: '10%',
      editable: true,
    },
    {
      title: 'Costo unitario(Bs.)',
      dataIndex: 'costo_unitario',
      width: '10%',
      editable: false,
    },
    {
      title: 'Fecha de compra',
      dataIndex: 'fecha_compra',
      width: '13%',
      editable: false,
      render: (fecha) => dayjs(fecha).format('YYYY-MM-DD')
    },
    {
      title: 'Fecha de caducidad',
      dataIndex: 'fecha_caducidad',
      width: '13%',
      editable: true,
      render: (fecha) => dayjs(fecha).format('YYYY-MM-DD') === 'Invalid Date' ?
        "Sin fecha" : dayjs(fecha).format('YYYY-MM-DD')
    },
    {
      title: 'Proveedor',
      dataIndex: 'nombre_proveedor',
      width: '15%',
      editable: true,
    },
    {
      title: 'Costo total',
      dataIndex: 'costo_total',
      width: '15%',
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>

            <Popconfirm
              title="¿Estas seguro de editar la compra?"
              onConfirm={async () => {
                try {
                  await save(record.id_lote);
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
            <Typography.Link disabled={editingid_lote !== ''} onClick={() => edit(record)}>
              <Button name="editar" ><EditOutlined /></Button>
            </Typography.Link>

            <Typography.Link >
              <Popconfirm title={"¿Estas seguro de eliminar esta compra?"} onConfirm={() => handleDelete(record.id_lote)}>
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
        col.dataIndex === "imagen"
            ? "image"
          : col.dataIndex === "costo_total"
            ? "number"
            : col.dataIndex === "fecha_caducidad"
              ? "date"
              : col.dataIndex === "nombre_proveedor"
                ? "proveedor"
                : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        dataSoureceProveedor,
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
        <div><h1 style={{ fontSize: 50, textAlign: 'center', background: '#ecdde1', textShadow: "2px 2px white" }}>Compras</h1></div>

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
            <Search
              className='search'
              placeholder="Buscar producto"
              bordered={false}
              onChange={handleInputChange}
              style={{
                display: 'flex',
                width: 200,
                border: '2px solid #d9d9d9',
                borderRadius: 8,
                backgroundColor: '#ecdde1'

              }}
              maxLength='20'
            />

            <DatePicker placeholder="Fecha Desde:" onChange={handleDateChange} />
            <DatePicker placeholder="Hasta:" onChange={handleDateChange2} />
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
              left: '-20%',
              marginTop: '0%'
            }}
          />
        </Form>
      </Content>
    </div>
  );

};
export default BuyList;