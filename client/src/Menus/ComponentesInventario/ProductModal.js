import { Button, Modal, Tooltip, message } from 'antd';
import { useState } from 'react';
import ProductForm from './ProductForm'
import CreateModal from './CreateModal';
import { EditOutlined } from '@ant-design/icons';
import './ProductModal.css'

const values = {
    imagen: "Sin imagen",
    nombreProducto: "",
    precio: "",
    idCategory: 2,
    descripcion: ""
}

const getImgUrlForm = (data) => {
    values.imagen = data;
}

const setIdCategoria = (id_categoria) => {
    values.idCategory = id_categoria;
}

const ProductModal = ({ setRefresh, elegido, setElegido, imagen, idProducto, idCategoria, nombreProducto, precioU, descripcion }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        if (imagen) {
            values.imagen = imagen;
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        var indiceCat = 0;
        if (validData()) {
            saveData();
            const respuesta = await uploadDB();
            indiceCat = values.idCategory;
            if (respuesta === 1) {
                message.error("El producto " + values.nombreProducto + " ya existente ");
                return;
            }
            if (respuesta === 2) {
                indiceCat = 2;
                if (idProducto) {
                    message.warning("La categoría solicitada no existe. El producto se actualizo a la categoría: SIN CATEGORIA.");
                } else {
                    message.warning("La categoría solicitada no existe. El producto se creo en la categoría: SIN CATEGORIA.");
                }
            } else {
                if (idProducto) {
                    message.success("Producto actualizado exitosamente");
                } else {
                    message.success("Producto creado exitosamente");         
                }
            }
            document.getElementById("productForm").reset();
            values.imagen = "Sin imagen";
            values.idCategory = 2;
            setElegido(indiceCat);
            setRefresh(true);
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
        if (!document.getElementById("precio").value) {
            valid = false;
        }
        return valid;
    }

    const saveData = () => {
        values.nombreProducto = document.getElementById("nombre").value;
        values.precio = document.getElementById("precio").value;
        values.descripcion = document.getElementById("descripcion").value;
    }

    const uploadDB = async () => {
        //Ruta para server en localhost: "http://localhost:8080/store/products"
        //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/products/`
        var res;
        if (idProducto) {
            res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/products/` + idProducto, {
                method: "PUT",
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" }
            });
        } else {
            //Ruta para server en localhost: "http://localhost:8080/store/products"
            //Ruta para server deployado: `${process.env.REACT_APP_SERVERURL}/store/products/`
            res = await fetch(`${process.env.REACT_APP_SERVERURL}/store/products/` + values.idCategory, {
                method: "POST",
                body: JSON.stringify(values),
                headers: { "Content-Type": "application/json" }
            });
        }

        const jsonData = await res.json();
        if (jsonData.data === 1) {
            return 1;
        }
        if (jsonData.data === 2) {
            return 2;
        }
    }

    const handleCancel = () => {
        values.imagen = "Sin imagen";
        setIsModalOpen(false);
    };

    return (
        <>
            <Tooltip title={idProducto ? "Editar" : ""} >
            <Button  type={idProducto ? "default" : "primary"} onClick={showModal}>
                {idProducto ? <EditOutlined /> : "Añadir Producto"}
            </Button>
            </Tooltip>
            
            <Modal
                className="modal"
                title={idProducto ? "Editar Producto" : "Añadir Producto"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <CreateModal
                        handleOk={handleOk}
                        isModalOpen={false}
                        setRefresh={setRefresh}
                        isEdit={idProducto ? true : false}
                    />,
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>
                ]}
                destroyOnClose="true"
            >
                <ProductForm
                    getImgUrlForm={getImgUrlForm}
                    imagen={values.imagen}
                    descripcion={descripcion}
                    nombreProducto={nombreProducto}
                    setIdCategoria={setIdCategoria}
                    idCategoria={idCategoria}
                    precioU={precioU}
                />
            </Modal>
        </>
    );
};

export default ProductModal;