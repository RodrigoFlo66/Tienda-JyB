import { Button, Table, message, Form, Popconfirm, Typography, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';


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
    const inputNode = inputType === 'text' ? <Input /> :
        <Input
            style={{
                backgroundColor: "#fff6ed"
            }}
            onKeyDown={validation}
            maxLength={30}
            autoComplete='Off'
            onCopy={(Event)=>{
                Event.preventDefault();
            }}
            onPaste={(Event)=>{
                Event.preventDefault();
            }}
            onDrop={(Event)=>{
                Event.preventDefault();
            }}
            />;
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
                            message: `Ingrese el nombre de la categoría!`,
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

const validation = (e) => {

    const key = e.key;
    if (!(/^[A-Z a-z À-ÿ\u00f1\u00d1]+$/.test(key)
        || key === 'Backspace'
        || key === 'Delete'
        || key === 'Tab'
        || key === 'ArrowLeft'
        || key === 'ArrowRight')) {
        e.preventDefault();
    }
    
};

const CategoryList = ({ setRefresh, isRefresh }) => {
    const [form] = Form.useForm();
    const aux = useState(isRefresh);
    //const [categoria, setCategoria] = useState([]);

    const [editingid_Categoria, setEditingid_Categoria] = useState('');
    const isEditing = (record) => record.id_categoria === editingid_Categoria;
    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            ...record,
        });
        setEditingid_Categoria(record.id_categoria);
    };

    const cancel = () => {
        setEditingid_Categoria('');
    };

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        if (isRefresh) {
            fetchCategoria();
            setRefresh(false);
        }
    }, [aux, dataSource, setDataSource]);

    async function fetchCategoria() {
        //Ruta para server en localhost: "http://localhost:8080/store/categories/"
        //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/categories/`
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/store/categories/`);
        const jsonData = await response.json();
        const updatedData = jsonData.filter(item => item.id_categoria !== 2);
        setDataSource(updatedData);
    }

    const handleDelete = async (id_categoria) => {
        // Borrar bd
        await deleteProductDB(id_categoria);
        // Borrar de la lista
        const newData = dataSource.filter((item) => item.id_categoria !== id_categoria);
        setDataSource(newData);
        message.success("La categoría se eliminó correctamente");
    };

    const deleteProductDB = async (id_categoria) => {
        //Ruta para server en localhost: "http://localhost:8080/store/categories/"
        //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/categories/`
        const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/categories/` + id_categoria, {
            method: "DELETE"
        });
        return res;
    }

    const updateCategoryDB = async (id_categoria, row) => {
        //Ruta para server en localhost: "http://localhost:8080/store/categories"
        //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/categories/`
        const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/categories/` + id_categoria, {
            method: "PUT",
            body: JSON.stringify(row),
            headers: { "Content-Type": "application/json" }
        });
        return res;
    }

    const save = async (id_categoria) => {
        try {
            const row = await form.validateFields();
            const res = await updateCategoryDB(id_categoria, row);
            const jsonData = await res.json();
            if (jsonData.data === 1) {
                message.error("La categoría " + row['nombre_categoria'] + " ya existe ");
            } else {
                const newData = [...dataSource];
                const index = newData.findIndex((item) => id_categoria === item.id_categoria);
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    setDataSource(newData);
                    setEditingid_Categoria('');
                } else {
                    newData.push(row);
                    setDataSource(newData);
                    setEditingid_Categoria('');
                    
                }
                message.success("La categoría se modificó correctamente");
            }

        } catch (errInfo) {
            console.log('Error en la validación:', errInfo);
        }
        

    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre_categoria',
            width: '65%',
            editable: true,
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Popconfirm title="¿Está seguro de guardar los cambios?" onConfirm={() => save(record.id_categoria)}>
                            <Button name="guardar" >Guardar</Button>
                        </Popconfirm>
                        <Button name="cancelar" onClick={cancel}>Cancelar</Button>
                    </span>
                ) : (
                    <span>
                        <Typography.Link disabled={editingid_Categoria !== ''} onClick={() => edit(record)}>
                            <Button name="editar" ><EditOutlined /></Button>
                        </Typography.Link>

                        <Typography.Link >
                            <Popconfirm title={"¿Está seguro de querer eliminar la categoría?"} onConfirm={() => handleDelete(record.id_categoria)}>
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
                inputType: col.dataIndex === 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <Table className='tabla'
                style={{
                    marginRight: "50%",
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
    );

}
export default CategoryList;