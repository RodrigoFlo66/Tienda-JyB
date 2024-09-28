import './InventarioMenu.css';
import React from 'react';
import { useState } from 'react';
import BuyList from './ComponenetesTransacciones/SaleList'

function MenuVentas() {

    const [isRefresh, setIsRefresh] = useState(true);

    const setRefresh = (status) => {
        setIsRefresh(status);
    }

    return (
        <div>
            <BuyList setRefresh={setRefresh} isRefresh={isRefresh} />
        </div>
    );
}

export default MenuVentas;