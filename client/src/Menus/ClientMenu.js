import React from 'react';
import { useState } from 'react';
import ClientList from './ComponentesClientes/ClientList';

function ClientMenu() {

  const [isRefresh, setIsRefresh] = useState(true);
  const setRefresh = (status) => {
      setIsRefresh(status);
  }

  return (
      <div>
          <ClientList setRefresh={setRefresh} isRefresh={isRefresh}/>
      </div>
  );
}

export default ClientMenu;