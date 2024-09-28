import {Modal,Button,message} from 'antd';

const DeleteModal = ({visible,onClose,idProducto,nombreProducto, setRefresh,cerrarModal}) =>{
    
    const handleOk = async () => {
        await deleteProductDB();
        cerrarModal();
        setRefresh(true);
        message.success("El producto '" + nombreProducto + "' ha sido eliminado exitosamente.");
    };
    
    const deleteProductDB = async () => {
        //Ruta para server en localhost: "http://localhost:8080/store/products"
        //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/products/`
        const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/products/` + idProducto, {
            method: "DELETE"
        });
        return res;
    }
    return(
        <Modal
            title="Borrar Producto"
            open={visible}
            onCancel={onClose}
            width="25%"
            footer={[
                <Button id="boton" form="editForm" key="edit" type="primary" onClick={handleOk}>
                    Ok
                </Button>,
                <Button key="cancel" onClick={onClose}>
                    Cancelar
                </Button>
            ]}
            destroyOnClose="true"
        >
            <p>¿Está seguro de querer eliminar {nombreProducto}?</p>
        </Modal>
    );
}

export default DeleteModal;