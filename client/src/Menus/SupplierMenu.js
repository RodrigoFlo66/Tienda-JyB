import React from 'react';
import SupplierList from './ComponentesProveedores/SupplierList';
import { useState } from 'react';


function SupplierMenu() {

    const [isRefresh, setIsRefresh] = useState(true);
    const setRefresh = (status) => {
        setIsRefresh(status);
    }

    return (
        <div>
            <SupplierList setRefresh={setRefresh} isRefresh={isRefresh} />
        </div>
    );
}

export default SupplierMenu;