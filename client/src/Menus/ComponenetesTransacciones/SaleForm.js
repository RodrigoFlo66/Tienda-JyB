import { Form, Select, InputNumber, Radio } from 'antd';
import { useEffect, useState } from 'react';

const SaleForm = ({ nombreProducto, precioUnitario, cantidadMax, setCliente, setFiado }) => {

    const [cantidad, setCantidad] = useState(1);
    const [value, setValue] = useState(1);
    const [enable, setEnable] = useState(false);
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        fetchClientes();
    },[]);

    async function fetchClientes() {
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/store/clients`);
        const jsonData = await response.json();
        const updatedData = jsonData.filter(item => item.id_cliente !== 7);
        setClientes(updatedData);
    }

    const numberInputKeyDown = (e) => {
        const key = e.key;
        if (!(/^[0-9]+$/.test(key) || key === 'Backspace' || key === 'Delete' || key === 'Tab' || key === 'ArrowLeft' || key === 'ArrowRight')) {
            e.preventDefault();
        }
    };

    const onChange = (e) => {
        setValue(e.target.value);
        if (e.target.value === 1) {
            setFiado(false);
            setEnable(false);
        } else {
            setFiado(true);
            setEnable(true);
        }
    };

    return (
        <>
            <Form
                id="saleForm"
                initialValues={{
                    remember: true,
                }}
                autoComplete="off"
            >
                <Form.Item
                    labelCol={{ span: 12 }}
                    name="nombreProducto"
                >
                    <p>Producto: {nombreProducto}</p>
                    <p>Precio unitario: {precioUnitario} Bs.</p>
                </Form.Item>

                <Form.Item
                    label="Cantidad"
                    labelCol={{ span: 24 }}
                    name="cantidad"
                    initialValue={1}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese la cantidad del producto!'
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        prefix="U."
                        id="cantidad"
                        min={1}
                        max={cantidadMax}
                        maxLength={6}
                        onKeyDown={numberInputKeyDown}
                        onChange={setCantidad}
                    />
                </Form.Item>

                <Form.Item
                    label="Forma de pago"
                    labelCol={{ span: 24 }}
                    name="costoTotal"
                    initialValue={1}
                    rules={[{ required: true, },]}
                >
                    <Radio.Group onChange={onChange} value={value}>
                        <Radio value={1}>Al contado</Radio>
                        <Radio value={2}>Credito</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="Cliente"
                    labelCol={{ span: 24 }}
                    name="fechaCaducidad"
                    rules={[
                        {
                            required: enable,
                            message: 'Por favor seleccione un cliente!'
                        },
                    ]}
                >
                    <Select
                        id="cliente"
                        listHeight={150}
                        //defaultValue={value === 1 ? 7 : undefined}
                        showSearch 
                        style={{ width: '100%' }}
                        placeholder="Buscar cliente"
                        optionFilterProp="children"
                        onChange={setCliente}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {clientes.map(cat => (
                                <Select.Option key={cat.id_cliente} value={cat.id_cliente} label={cat.nombre_cliente}>
                                    {cat.nombre_cliente}
                                </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    name="costoTotal"
                >
                    <p>Costo total: {Math.round((precioUnitario * cantidad) * 100) / 100} Bs.</p>
                </Form.Item>

            </Form>
        </>
    );
};

export default SaleForm;