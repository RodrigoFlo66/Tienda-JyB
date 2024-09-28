import './InventarioMenu.css';
import React from 'react';
import { useState } from 'react';
import BuyList from './ComponenetesTransacciones/BuyList'

function MenuInventario() {

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

export default MenuInventario;