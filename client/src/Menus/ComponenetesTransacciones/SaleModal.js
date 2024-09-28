import { Button, Modal, message } from 'antd';
import SaleForm from './SaleForm'
import ConfirmSaleModal from './ConfirmSaleModal';

const values = {
    id_producto: "",
    cantidad: "",
    id_cliente: 7,
    precio_unitario: "",
}

var fiado = false;

function setFiado(esFiado) {
    fiado = esFiado;
}

function setCliente(cliente) {
    values.id_cliente = cliente;
}

const SaleModal = ({ setRefresh, nombreProducto, idProducto, precioUnitario, cantidad, visible, onClose, closeModal }) => {

    const handleOk = async () => {
        if (validData()) {
            saveData();
            const respuesta = await uploadDB();
            if (respuesta === 2) {
                message.warning('El cliente seleccionado no existe, por favor actualice la sección');
            } else {
                setRefresh(true);
                message.success("Venta realizada exitosamente");
                setFiado(false);
                setCliente(7);
                closeModal();
            }
        } else {
            message.warning('Todos los campos obligatorios deben llenarse correctamente');
        }
    };

    function validData() {
        var valid = true;
        if (!document.getElementById("cantidad").value) {
            valid = false;
        }
        if (values.id_cliente === 7 && fiado) {
            valid = false;
        }
        return valid;
    }

    const saveData = () => {
        values.id_producto = idProducto;
        values.cantidad = document.getElementById("cantidad").value;
        values.cantidad = parseInt(values.cantidad);
        values.precio_unitario = precioUnitario;
    }

    const uploadDB = async () => {
        const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/products/sales/` + (fiado ? 2 : 1), {
            method: "POST",
            body: JSON.stringify(values),
            headers: { "Content-Type": "application/json" }
        });
        const jsonData = await res.json();
        if (jsonData.data === 1) {
            return 1;
        }
        if (jsonData.data === 2) {
            return 2;
        }
        return jsonData;
    }

    const handleCancel = () => {
        setFiado(false);
        setCliente(7);
        closeModal();
    };

    return (
        <Modal
            title="Realizar venta"
            style={{
                top: 0,
                left: "37%",
            }}
            open={visible}
            onCancel={onClose}
            width="25%"
            footer={[
                <ConfirmSaleModal
                    handleOk={handleOk}
                    isModalOpen={false}
                    setRefresh={setRefresh} />,
                <Button key="cancel" onClick={handleCancel}>
                    Cancelar
                </Button>
            ]}
            destroyOnClose="true"
        >
            <SaleForm
                nombreProducto={nombreProducto}
                precioUnitario={precioUnitario}
                cantidadMax={cantidad}
                setCliente={setCliente}
                setFiado={setFiado} />
        </Modal>
    );
};

export default SaleModal;