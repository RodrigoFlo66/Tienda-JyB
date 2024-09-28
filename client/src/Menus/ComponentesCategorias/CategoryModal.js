import { Button, Modal, message} from 'antd';
import { useState } from 'react';
import CategoryForm from './CategoryForm';
import CreateCategoryModal from './CreateCategoryModal';
import { EditOutlined } from '@ant-design/icons';

const values = {
    nombreCategoria: ""

}



const setIdCategoria = (id_categoria) => {
    values.id_categoria = id_categoria;
}

const CategoryModal = ({ setRefresh,idCategoria,nombreCategoria}) => {

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
                message.error("La categoría " + values.nombreCategoria + " ya existe ");
            } else {
                message.success("Categoría creada exitosamente");
                document.getElementById("categoryForm").reset();         
            }
        } else {
            message.warning('Todos los campos obligatorios deben llenarse correctamente');
        }
    };

    function validData() {
        var valid = true;
        var nombre = document.getElementById("nombre").value;
        if (!nombre || nombre.length < 3) {
            valid = false;
        }
        return valid;
    }

    const saveData = () => {
        values.nombreCategoria = document.getElementById("nombre").value;
    }

    const uploadDB = async () => {
        //Ruta para server en localhost: "http://localhost:8080/store/categories/"
        //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/categories/`
        const res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/categories/`, {
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
            <Button type={idCategoria ? "default" : "primary"} onClick={showModal}>
                {idCategoria ? <EditOutlined /> : "Añadir Categoría"}
            </Button>
            <Modal
                title={idCategoria ? "Editar Categoría" : "Añadir Categoría"}
                style={{
                    top: 0,
                    left: "37%",
                }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width="25%"
                footer={[
                    <CreateCategoryModal
                        handleOk={handleOk}
                        isModalOpen={false}
                        setRefresh={setRefresh}
                        isEdit={idCategoria ? true : false}
                    />,
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>
                ]}
                destroyOnClose="true"
            >
                <CategoryForm
                    nombreCategoria={nombreCategoria}
                    setIdCategoria={setIdCategoria}
                />
            </Modal>
        </>
    );
};

export default CategoryModal;