import { Modal, Button } from 'antd';
import { useState } from 'react';

const CreateSupplierModal = ({handleOk,setRefresh}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleOkModal = async () => {
        await handleOk();
        handleCancel();
        setRefresh(true);
    }

    return (
        <>
            <Button onClick={showModal}>
                {"Confirmar"}
            </Button>
            <Modal
                title={"¿Está seguro de registrar al proveedor?"}
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOkModal}
                width="30%"
                footer={[
                    <Button id="boton" form="editForm" key="edit" type="primary" onClick={handleOkModal}>
                        Ok
                    </Button>,
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>
                ]}
                destroyOnClose="true"
            >

            </Modal>
        </>

    );
}

export default CreateSupplierModal;