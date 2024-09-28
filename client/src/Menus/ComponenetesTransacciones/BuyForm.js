import { Form, DatePicker, InputNumber, Select } from 'antd';
import moment from 'moment';
import { useState, useEffect } from 'react';

const BuyForm = ({ nombreProducto, setProveedor }) => {

    const [cantidad, setCantidad] = useState(1);
    const [costoTotal, setCostoTotal] = useState(1);
    const [proveedores, setProveedores] = useState([]);

    useEffect(() => {
        fetchProveedores();
    },);

    async function fetchProveedores() {
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/store/providers`);
        const jsonData = await response.json();
        setProveedores(jsonData);
    }

    const numberInputKeyDown = (e) => {

        const key = e.key;
        if (!(/^[0-9]+$/.test(key) || key === 'Backspace' || key === 'Delete' || key === 'Tab' || key === 'ArrowLeft' || key === 'ArrowRight')) {
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
                id="buyForm"
                initialValues={{
                    remember: true,
                }}
                autoComplete="off"
            >
                <Form.Item
                    labelCol={{ span: 24 }}
                    name="nombreProducto"
                >
                    <p>{nombreProducto}</p>
                </Form.Item>

                <Form.Item
                    label="Cantidad"
                    labelCol={{ span: 24 }}
                    name="cantidad"
                    initialValue={1}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor la cantidad del producto!'
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        prefix="U."
                        className="inputs"
                        id="cantidad"
                        min={1}
                        maxLength={6}
                        onKeyDown={numberInputKeyDown}
                        onChange={setCantidad}
                    />
                </Form.Item>

                <Form.Item
                    label="Costo Total"
                    labelCol={{ span: 24 }}
                    name="costoTotal"
                    initialValue={1}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor ingrese el costo total del producto!'
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        prefix="Bs."
                        className="inputs"
                        id="costoTotal"
                        min={1}
                        maxLength={6}
                        precision={2}
                        step={0.5}
                        onKeyDown={DecimalInput}
                        onChange={setCostoTotal}
                    />
                </Form.Item>

                <Form.Item
                    label="Seleccionar Fecha de Caducidad"
                    labelCol={{ span: 24 }}
                    name="fechaCaducidad"
                    rules={[{ required: false, },

                    ]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        id="fechaCad"
                        className="inputs"
                        placeholder='Inserte la fecha'
                        disabledDate={(current) => {
                            return moment().add(-1, 'days') >= current;
                        }}
                        onKeyDown={(e) => {
                            const maxCharacters = 10;
                            const currentValue = e.target.value || '';
                            const key = e.key;

                            // Permite solo números y guión (-) y permite borrar incluso después de alcanzar el número máximo de caracteres
                            if (!(/^[0-9-]+$/.test(key) || key === 'Backspace' || key === 'Delete')) {
                                e.preventDefault();
                            }

                            // Verifica que la longitud del texto no exceda el número máximo de caracteres
                            if (currentValue.length >= maxCharacters && key !== 'Backspace' && key !== 'Delete') {
                                e.preventDefault();
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Proveedor"
                    labelCol={{ span: 24 }}
                    name="proveedor"
                >
                    <Select
                        id="cliente"
                        listHeight={150}
                        defaultValue={7}
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Buscar proveedor"
                        optionFilterProp="children"
                        onChange={setProveedor}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {proveedores.map(cat => (
                            <Select.Option key={cat.id_proveedor} value={cat.id_proveedor} label={cat.nombre_proveedor}>
                                {cat.nombre_proveedor}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    name="descripcion"
                    rules={[{ required: false, },
                    {
                        max: 99,
                        message: 'La descripción no puede tener más de 100 caracteres!',
                    },

                    ]}
                >
                    <p>Costo unitario: {Math.round((costoTotal / cantidad) * 100) / 100} Bs.</p>
                </Form.Item>

            </Form>
        </>
    );
};

export default BuyForm;