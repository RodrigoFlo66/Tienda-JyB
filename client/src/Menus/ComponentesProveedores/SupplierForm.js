import { Form, InputNumber, Input } from 'antd';
import { useEffect, useState } from "react";

const { TextArea } = Input;

const SupplierForm = ({nombreProveedor, descripcion}) => {

    const [referencia, setReferencia] = useState([]);

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        fetchProveedor();
    },[]);


    async function fetchProveedor() {
    //Ruta para server en localhost: "http://localhost:8080/store/categories"
    //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/categories`
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/store/providers`);
        const jsonData = await response.json();
        setReferencia(jsonData);
    }

    const validation = (e) => {
        
        const key = e.key;
        if (!(/^[A-Z a-z À-ÿ\u00f1\u00d1]+$/.test(key) 
            || key === 'Backspace' 
            || key === 'Delete' 
            || key === 'Tab' 
            || key=== 'ArrowLeft' 
            || key=== 'ArrowRight' ))
        {
            e.preventDefault();
        }
    };
 
    const NumberInput = (e) => {

        const key = e.key;
        if (!(/^\d+$/.test(key) || key === 'Backspace' || key === 'Delete' || key === 'Tab' || key === 'ArrowLeft' || key === 'ArrowRight')) {
            e.preventDefault();
        }
    };

    return (
        <>
            <Form
                id="supplierForm"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                

                <Form.Item
                    label="Nombre del proveedor"
                    labelCol={{ span: 24 }}
                    name="nombre"
                    initialValue={nombreProveedor? nombreProveedor : ""}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese el nombre del proveedor!',
                        },
                        {
                            min: 3,
                            message: 'El nombre del proveedor debe tener al menos 3 caracteres!',
                        },
                        {
                            max: 39,
                            message: 'El nombre del proveedor no puede tener más de 30 caracteres!',
                        },

                    ]}
                >
                    <Input id="nombre"
                        className="inputs"
                        placeholder='Ingrese el nombre del proveedor'
                        maxLength='30'
                        type='text'
                        onKeyDown={validation}
                        onCopy={(Event)=>{
                            Event.preventDefault();
                        }}
                        onPaste={(Event)=>{
                            Event.preventDefault();
                        }}
                        onDrop={(Event)=>{
                            Event.preventDefault();
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Número de referencia"
                    labelCol={{ span: 24 }}
                    name="numReferencia"
                    initialValue={referencia ? referencia : 1}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese el número de referencia!'
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        className="inputs"
                        placeholder='Ingrese el número de referencia'
                        id="referencia"
                        min={1}
                        maxLength={8}
                        onKeyDown={NumberInput}
                         />
                </Form.Item>
                
                <Form.Item
                    label="Descripción"
                    labelCol={{ span: 24 }}
                    name="descripcion"
                    initialValue={descripcion ? descripcion : ""}
                    rules={[{ required: false, },
                    {
                        max: 59,
                        message: 'La descripción no puede tener más de 60 caracteres!',
                    },

                    ]}
                >
                    <TextArea id="descripcion" className="inputs" rows={3}
                        placeholder='Ingrese la descripción'
                        maxLength={60}
                        style={{ resize: 'none' }}
                    />
                </Form.Item>

            </Form>
        </>
    );
};

export default SupplierForm;