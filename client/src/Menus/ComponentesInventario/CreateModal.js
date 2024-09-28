import { Modal, Button } from 'antd';
import { useState } from 'react';

const CreateModal = ({ handleOk, setRefresh, isEdit }) => {

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
                {isEdit ? "Editar" : "Crear"}
            </Button>
            <Modal
                title={isEdit ? "¿Está seguro de modificar la información del producto?" :
                    "¿Está seguro de agregar el nuevo producto?"}
                open={isModalOpen}
                onCancel={handleCancel}
                width={isEdit ? "35%" : "30%"}
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

export default CreateModal;