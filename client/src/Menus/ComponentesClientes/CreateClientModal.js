import { Modal, Button } from 'antd';
import { useState } from 'react';

const CreateClientModal = ({handleOk,setRefresh}) => {

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
                {"Crear"}
            </Button>
            <Modal
                title={"¿Estás seguro de registrar al cliente?"}
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

export default CreateClientModal;