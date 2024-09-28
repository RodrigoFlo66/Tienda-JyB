import { Button, Modal, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ClientForm from './ClientForm'
import CreateClientModal from './CreateClientModal';

const values = {
    nombre_cliente: "",
    num_cliente: ""
}

const setIdCliente = (id_cliente) => {
    values.id_cliente = id_cliente;
}


const ClientModal = ({ setRefresh,idCliente,nombreCliente,telefono}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        if (validData()) {
            saveData();
            const respuesta = await uploadDB();
            setRefresh(true);
            if (respuesta === 1) {
                message.error("Ya tiene un contacto con el nombre " + values.nombre_cliente);
            }else if(respuesta === 2){
                message.error("Ya tiene un contacto con el número " + values.num_cliente);
            }else {
                message.success("Contacto creado exitosamente");
                document.getElementById("clientForm").reset();          
            }
        } else {
            var tel = document.getElementById("numero").value
            if(!verificarPrimerDigito(tel)){
                message.warning('El número a registrar debe comenzar con 6-7');
            }
            message.warning('Todos los campos obligatorios deben llenarse correctamente');
        }
    };

    function validData() {
        var valid = true;
        var nombre = document.getElementById("nombre").value;
        var tel = document.getElementById("numero").value;
        //recuerda validar el telefono
        if (!nombre || nombre.length < 3) {
            valid = false;
        }

        if(!verificarPrimerDigito(tel)){
            valid = false;
        }
        return valid;
    }

    function verificarPrimerDigito(string) {
        if (/^[67]/.test(string)) {
          return true;
        } else {
          return false;
        }
      }

    const saveData = () => {
        values.nombre_cliente = document.getElementById("nombre").value;
        values.num_cliente = document.getElementById("numero").value;
        console.log(values)
    }

    const uploadDB = async () => {
        console.log(JSON.stringify(values))
        const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/clients/`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: { "Content-Type": "application/json" }
        });
        const jsonData = await res.json();
        console.log(jsonData)
        if (jsonData.data === 1) {
            return 1;
        }
        if (jsonData.data === 2) {
            return 2;
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button 
                style={{display:'flex'}}
                type={idCliente ? "default" : "primary"} 
                onClick={showModal}
            >
                Añadir Cliente
            </Button>
            <Modal
                title="Añadir Cliente"
                style={{
                    top: 0,
                    left: "37%",
                }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width="25%"
                footer={[
                    <CreateClientModal
                        handleOk={handleOk}
                        isModalOpen={false}
                        setRefresh={setRefresh}
                        isEdit={idCliente ? true : false}
                    />,
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>
                ]}
                destroyOnClose="true"
            >
                <ClientForm
                    nombreCliente={nombreCliente}
                    telefono={telefono}
                    setIdCliente={setIdCliente}
                />
            </Modal>
        </>
    );
};

export default ClientModal;