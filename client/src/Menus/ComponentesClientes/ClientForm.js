import { Form,Input,Select } from 'antd';
import { useEffect, useState } from "react";

const ClientForm = ({nombreCliente,telefono}) => {

    const [clientes, setClientes] = useState([]);

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        fetchClientes();
    },[]);


    async function fetchClientes() {
    //Ruta para server en localhost: "http://localhost:8080/store/categories"
    //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/categories`
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/store/clients`);
        const jsonData = await response.json();
        setClientes(jsonData);
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

    const DecimalInput = (e) => {

        const key = e.key;
        if (!(/^[0-9.]+$/.test(key) || key === 'Backspace' || key === 'Delete' || key === 'Tab' || key === 'ArrowLeft' || key === 'ArrowRight')) {
            e.preventDefault();
        }
    };

    return (
        <>
            <Form
                id="clientForm"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                

                <Form.Item
                    label="Nombre de contacto de Cliente"
                    labelCol={{ span: 24 }}
                    name="nombre"
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese el nombre del contacto!',
                        },
                        {
                            min: 3,
                            message: 'El nombre del contacto debe tener al menos 3 caracteres!',
                        },
                        {
                            max: 39,
                            message: 'El nombre del contacto no puede tener más de 30 caracteres!',
                        },

                    ]}
                >
                    <Input id="nombre"
                        className="inputs"
                        placeholder='Ingrese nombre del contacto a registrar'
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
                    label="Número de Contacto"
                    labelCol={{ span: 24 }}
                    name="numero"
                    maxLength={8}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese un número para el contacto!',
                        },
                        {
                            min: 8,
                            message: 'El número del contacto debe tener 8 dígitos ',
                        },
                    ]}
                >
                    <Input id="numero"
                        className="inputs"
                        placeholder='Ingrese el número del Contacto'
                        maxLength='8'
                        minLength='7'
                        type='text'
                        onKeyDown={DecimalInput}
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
            </Form>
        </>
    );
};

export default ClientForm;