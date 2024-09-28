import './InventarioMenu.css';
import React from 'react';
import { useState } from 'react';
import ProductList from './ComponentesInventario/ProductList'

function MenuInventario() {

  const [isRefresh, setIsRefresh] = useState(true);

  const setRefresh = (status) => {
    setIsRefresh(status);
  }

  return (
      <div>
        <ProductList setRefresh={setRefresh} isRefresh={isRefresh} />
      </div>
  );
}

export default MenuInventario;