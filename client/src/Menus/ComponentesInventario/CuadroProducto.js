import { DeleteOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Card, Button, Tooltip } from 'antd';
import EditarModal from './ProductModal'
import DeleteModal from './DeleteModal';
import BuyModal from '../ComponenetesTransacciones/BuyModal';
import SaleModal from '../ComponenetesTransacciones/SaleModal';
import React, { useState } from 'react';
import defaultLogo from '../../Imagenes/Logo Peq.png'

function Productos({ title, imagen, precio, cantidad, idProducto, idCategoria, descripcion, setRefresh, setElegido }) {

  const [modalBorrar, setBorrar] = useState(false);
  const [buyModal, setBuy] = useState(false);
  const [saleModal, setSale] = useState(false);

  const openBuyModal = () => {
    setBuy(true);
  }

  const openSaleModal = () => {
    setSale(true);
  }

  const abrirModalBorrar = () => {
    setBorrar(true);
  }

  const closeBuyModal = () => {
    setBuy(false);
  }

  const closeSaleModal = () => {
    setSale(false);
  }

  const cerrarModalBorrar = () => {
    setBorrar(false);
  }

  return (
    <Card
      style={{
        width: 210,
        textAlign: 'center'
      }}
      cover={
        <Tooltip title={descripcion} placement="right">
          <img
            style={{
              width: 110,
              height: 150,
              objectFit: 'cover',
              margin: 'auto',
              marginTop: '20px'
            }}
            alt="Algo salio mal..."
            src={imagen === "Sin imagen" ? defaultLogo : imagen}
          />
        </Tooltip>

      }
      actions={[
        <>
          <Tooltip title="Venta">
            <Button name="modalSale" onClick={openSaleModal} disabled={cantidad === 0}><ShoppingCartOutlined /></Button>
          </Tooltip>
          <SaleModal
            visible={saleModal}
            onClose={closeSaleModal}
            idProducto={idProducto}
            nombreProducto={title}
            precioUnitario={precio}
            cantidad={cantidad}
            setRefresh={setRefresh}
            closeModal={closeSaleModal}
          />
        </>,

        <>
          <Tooltip title="Compra">
            <Button name="modalBuy" onClick={openBuyModal}><DollarOutlined /></Button>
          </Tooltip>
          <BuyModal
            visible={buyModal}
            onClose={closeBuyModal}
            idProducto={idProducto}
            nombreProducto={title}
            setRefresh={setRefresh}
            closeModal={closeBuyModal}
          />
        </>,
        <>
          <EditarModal
            idProducto={idProducto}
            nombreProducto={title}
            imagen={imagen}
            precioU={precio}
            idCategoria={idCategoria}
            descripcion={descripcion}
            setRefresh={setRefresh}
            setElegido={setElegido}
          />
        </>,
        <>
          <Tooltip title="Eliminar">
            <Button name="modalBorrar" onClick={abrirModalBorrar}><DeleteOutlined /></Button>
          </Tooltip>
          <DeleteModal
            visible={modalBorrar}
            onClose={cerrarModalBorrar}
            idProducto={idProducto}
            nombreProducto={title}
            setRefresh={setRefresh}
            cerrarModal={cerrarModalBorrar}
          />
        </>
      ]}
      title={title}
    >
      <p><b>Precio U: </b>{precio} Bs.</p>
      <p><b>Cantidad: </b>{cantidad} U.</p>
      <p></p>
    </Card>
  );
};

export default Productos;