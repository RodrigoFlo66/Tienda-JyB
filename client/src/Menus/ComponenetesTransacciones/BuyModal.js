import { Button, Modal, message } from 'antd';
import BuyForm from './BuyForm'
import ConfirmBuyModal from './ConfirmBuyModal';

const values = {
    cantidad: "",
    fechaCaducidad: "",
    costo_total: "",
    id_proveedor: 7,
}

function setProveedor(proveedor) {
    values.id_proveedor = proveedor;
}

const ProductModal = ({ setRefresh, nombreProducto, idProducto, visible, onClose, closeModal }) => {

    const handleOk = async () => {
        if (validData()) {
            saveData();
            const respuesta = await uploadDB();
            setRefresh(true);
            message.success("Compra realizada exitosamente");
            closeModal();
        } else {
            message.warning('Todos los campos obligatorios deben llenarse correctamente');
        }
    };

    function validData() {
        var valid = true;
        if (!document.getElementById("cantidad").value) {
            valid = false;
        }
        if (!document.getElementById("costoTotal").value) {
            valid = false;
        }
        return valid;
    }

    const saveData = () => {
        values.cantidad = document.getElementById("cantidad").value;
        values.cantidad = parseInt(values.cantidad);
        values.costo_total = document.getElementById("costoTotal").value;
        values.fechaCaducidad = document.getElementById("fechaCad").value;
        if (!values.fechaCaducidad) {
            values.fechaCaducidad = null;
        }
    }

    const uploadDB = async () => {
        const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/products/buy/` + idProducto, {
            method: "POST",
            body: JSON.stringify(values),
            headers: { "Content-Type": "application/json" }
        });
        const jsonData = await res.json();
        if (jsonData.data === 1) {
            return 1;
        }
        return jsonData;
    }

    const handleCancel = () => {
        setProveedor(7);
        closeModal();
    };

    return (
        <Modal
            title="Realizar compra"
            style={{
                top: 0,
                left: "37%",
            }}
            open={visible}
            onCancel={onClose}
            width="25%"
            footer={[
                <ConfirmBuyModal
                    handleOk={handleOk}
                    isModalOpen={false}
                    setRefresh={setRefresh} />,
                <Button key="cancel" onClick={handleCancel}>
                    Cancelar
                </Button>
            ]}
            destroyOnClose="true"
        >
            <BuyForm
                nombreProducto={nombreProducto}
                setProveedor={setProveedor}
            />
        </Modal>
    );
};

export default ProductModal;