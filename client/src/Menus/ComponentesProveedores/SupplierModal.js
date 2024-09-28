import { Button, Modal, message} from 'antd';
import { useState } from 'react';
import SupplierForm from './SupplierForm';
import CreateSupplierModal from './CreateSupplierModal';
import { EditOutlined } from '@ant-design/icons';

const values = {
    nombreProveedor: "",
    numProveedor: "",
    idProveedor: 2,
    descProveedor: ""

}



const setIdProveedor = (id_proveedor) => {
    values.idProveedor = id_proveedor;
}

const SupplierModal = ({ setRefresh, idProveedor, nombreProveedor, numProveedor, descripcion}) => {

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
                message.error("El proveedor " + values.nombreProveedor + " ya existe");
            }else if(respuesta === 2){
                message.error("Ya tiene un contacto con el número " + values.numProveedor );
            }else {
                message.success("Proveedor creado exitosamente");
                document.getElementById("supplierForm").reset();          
            }
        } else {
            var tel = document.getElementById("referencia").value
            if(!verificarPrimerDigito(tel)){
                message.warning('El número a registrar debe comenzar con 6-7');
            }
            message.warning('Todos los campos obligatorios deben llenarse correctamente');
        }
    };

    function validData() {
        var valid = true;
        var nombre = document.getElementById("nombre").value;
        var tel = document.getElementById("referencia").value;
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
        values.nombreProveedor = document.getElementById("nombre").value;
        values.numProveedor = document.getElementById("referencia").value;
        values.descProveedor = document.getElementById("descripcion").value;
    }

    const uploadDB = async () => {
        //Ruta para server en localhost: "http://localhost:8080/store/categories/"
        //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/categories/`
        console.log(JSON.stringify(values))
        const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/providers/`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: { "Content-Type": "application/json" }
        });
        const jsonData = await res.json();
        if (jsonData.data === 1) {
            return 1;
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button type={idProveedor ? "default" : "primary"} onClick={showModal}>
                {idProveedor ? <EditOutlined /> : "Añadir Proveedor"}
            </Button>
            <Modal
                title={idProveedor ? "Editar Proveedor" : "Añadir Proveedor"}
                style={{
                    top: 0,
                    left: "37%",
                }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width="25%"
                footer={[
                    <CreateSupplierModal
                        handleOk={handleOk}
                        isModalOpen={false}
                        setRefresh={setRefresh}
                        isEdit={idProveedor ? true : false}
                    />,
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>
                ]}
                destroyOnClose="true"
            >
                <SupplierForm
                    nombreProveedor={nombreProveedor}
                    numProveedor={numProveedor}
                    setIdProveedor={setIdProveedor}
                />
            </Modal>
        </>
    );
};

export default SupplierModal;