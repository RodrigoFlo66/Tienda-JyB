import { Form, Select, InputNumber, Input } from 'antd';
import Upload from '../ComponentesInventario/Upload';
import { useEffect, useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

const FormProducto = ({ getImgUrlForm, imagen, nombreProducto, idCategoria, precioU, setIdCategoria, descripcion }) => {

    var imgUrl = imagen;
    const [categoria, setCategoria] = useState([]);

    const getImgUrlUpload = (data) => {
        imgUrl = data;
        getImgUrlForm(imgUrl);
    }

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const DecimalInput = (e) => {

        const key = e.key;
        if (!(/^[0-9.]+$/.test(key) || key === 'Backspace' || key === 'Delete' || key === 'Tab' || key === 'ArrowLeft' || key === 'ArrowRight')) {
            e.preventDefault();
        }
    };

    useEffect(() => {
        fetchCategoria();
    }, []);

    async function fetchCategoria() {
    //Ruta para server en localhost: "http://localhost:8080/store/categories"
    //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/categories/`
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/store/categories/`);
        const jsonData = await response.json();
        setCategoria(jsonData);
    }

    function getIdCategory(){
        if(idCategoria){
            setIdCategoria(idCategoria);
            return idCategoria;
        }
        return 2;
    }


    return (
        <>
            <Form
                id="productForm"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Añadir Imagen"
                    labelCol={{ span: 24 }}
                    name="img"
                    rules={[{ required: false, }
                    ]}
                >
                    <Upload getImgUrlUpload={getImgUrlUpload} imagenUrl={imagen} />
                </Form.Item>

                <Form.Item
                    label="Nombre del Producto"
                    labelCol={{ span: 24 }}
                    name="nombre"
                    initialValue={nombreProducto ? nombreProducto : ""}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese el nombre del Producto!',
                        },
                        {
                            min: 3,
                            message: 'El nombre del producto debe tener al menos 3 caracteres!',
                        },
                        {
                            max: 39,
                            message: 'El nombre del producto no puede tener más de 40 caracteres!',
                        },

                    ]}
                >
                    <Input id="nombre"
                        className="inputs"
                        placeholder='Ingrese nombre del producto'
                        maxLength='40'
                        type='text'
                    />
                </Form.Item>

                <Form.Item
                    label="Precio Unitario"
                    labelCol={{ span: 24 }}
                    name="precioUnitario"
                    initialValue={precioU ? precioU : 1}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese el precio unitario del producto!'
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        prefix="Bs."
                        className="inputs"
                        id="precio"
                        min={1}
                        maxLength={6}
                        precision={2}
                        step={0.5}
                        onKeyDown={DecimalInput} />
                </Form.Item>

                <Form.Item
                    label="Categoria"
                    labelCol={{ span: 24 }}
                    name="cat"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese el precio unitario del producto!'
                        },
                    ]}
                >
                    <Select
                        defaultValue={getIdCategory()}
                        listHeight={150}
                        id='categoria'
                        showSearch
                        onChange={(value) => {
                            setIdCategoria(value);
                        }}
                        style={{ width: '100%' }}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {categoria.map(cat => (
                            <Option key={cat.id_categoria} value={cat.id_categoria} label={cat.nombre_categoria}>
                                {cat.nombre_categoria}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Descripción"
                    labelCol={{ span: 24 }}
                    name="descripcion"
                    initialValue={descripcion ? descripcion : ""}
                    rules={[{ required: false, },
                    {
                        max: 99,
                        message: 'La descripción no puede tener más de 100 caracteres!',
                    },

                    ]}
                >
                    <TextArea id="descripcion" className="inputs" rows={3}
                        placeholder='Ingrese una descripción del producto'
                        maxLength={100}
                        style={{ resize: 'none' }}
                    />
                </Form.Item>

            </Form>
        </>
    );
};

export default FormProducto;