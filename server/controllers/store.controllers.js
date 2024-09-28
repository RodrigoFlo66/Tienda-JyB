const pool = require("../db");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { createAndUploadFile } = require('../uploadImg');
const { auth } = require('../auth');

const uploadImg = (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return next(err);
    } else if (err) {
      return next(err);
    }

    const file = req.file;

    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }

    console.log("Archivo recibido: ", file.originalname);
    const url = await createAndUploadFile(auth, req.file)
    res.json({ imgUrl: url });
  });
};

const getDbTime = async (req, res) => {
  const result = await pool.query("SELECT now()");
  console.log(result);
  res.json(result.rows);
}

const getAllCategories = async (req, res) => {
  const result = await pool.query("SELECT * FROM categorias ORDER BY nombre_categoria ASC;");
  console.log(result);
  res.json(result.rows);
};

const getACategorie = async (req, res) => {
  const id = req.params.id;
  try {
    const { rows } = await pool.query("SELECT nombre_categoria FROM categorias WHERE id_categoria = $1", [id]);
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error obteniendo la categoria");
  }
};
const createACategorie = async (req, res) => {
  const { nombreCategoria } = req.body;
  try {
    const nameProduct = await pool.query(
      "SELECT * FROM categorias WHERE LOWER(nombre_categoria) = LOWER($1);",
      [nombreCategoria]
    );
    if (nameProduct.rows.length > 0) {
      return res.status(200).json({ data: 1 });
    }
    const result = await pool.query(
      "INSERT INTO categorias (nombre_categoria) VALUES ($1)",
      [nombreCategoria]
    );
    return res.json({dato : result.rows[0]});
  } catch (error) {
    console.log("Error añadiendo categoria");
    return res.json({ error: error.message });
  }
};

const deleteACategorie = (req, res) => {
  const id = req.params.id;

  pool.query('BEGIN', (error) => {
    if (error) {
      return res.status(500).send('Error iniciando transacción: ' + error);
    }

    pool.query('UPDATE productos SET id_categoria = 2 WHERE id_categoria = $1', [id], (error, result) => {
      if (error) {
        return pool.query('ROLLBACK', () => {
          res.status(500).send('Error actualizando productos: ' + error);
        });
      }

      pool.query('DELETE FROM categorias WHERE id_categoria = $1', [id], (error, result) => {
        if (error) {
          return pool.query('ROLLBACK', () => {
            res.status(500).send('Error eliminando categoría: ' + error);
          });
        }

        pool.query('COMMIT', (error) => {
          if (error) {
            return res.status(500).send('Error finalizando transacción: ' + error);
          }
          return res.status(200).send(`Eliminado ${result.rowCount} categoría`);
        });
      });
    });
  });
};

const updateACategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_categoria } = req.body;
    const existingProduct = await pool.query(
      "SELECT * FROM categorias WHERE LOWER(nombre_categoria) = LOWER($1) AND id_categoria != $2",
      [nombre_categoria, id]
    );
    if (existingProduct.rows.length > 0) {
      return res.status(200).json({ data: 1 });
    }

    const newCategorie = await pool.query(
      "UPDATE categorias SET nombre_categoria = $1 WHERE id_categoria = $2",
      [nombre_categoria, id]
    );
    return res.json({categoria: newCategorie.rows[0]});
  } catch (error) {
    console.log("Error modificando categoria");
    return res.json({ error: error.message });
  }

};

const getProductOfCategorie = async (req, res) => {
  const id = req.params.id;
  try {
    const { rows } = await pool.query(`
    SELECT DISTINCT id_producto, nombre_producto, precio_unitario, id_categoria, descripcion, total, imagen 
    FROM productos
    WHERE id_categoria = $1 
    ORDER BY nombre_producto ASC;`,
      [id]);
    console.log(rows);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).send("Error obteniendo los productos");
  }
}



const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT id_producto, nombre_producto, precio_unitario, id_categoria, descripcion, total, imagen FROM productos ORDER BY nombre_producto ASC;");
    console.log(result);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error obteniendo los productos");
  }
};
const getProduct = async (req, res) => {
  const idProduct = req.params.idProduct;
  try {
    const resultProduct = await pool.query("SELECT * FROM productos WHERE id_producto = $1", [idProduct]);
    res.json(resultProduct.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error obteniendo el producto");
  }
};
const getBuy = async (req, res) => {
  const idProduct = req.params.idProduct;
  try {
    const result = await pool.query("SELECT id_lote, cantidad, fecha_caducidad, costo_unitario, costo_total, fecha_compra FROM lotes WHERE id_producto = $1", [idProduct]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error obteniendo compras");
  }
}

const createProduct = async (req, res) => {
  try {
    const { nombreProducto, precio, descripcion, imagen } = req.body;
    let { idCategory } = req.params;
    const nameProduct = await pool.query(
      "SELECT * FROM productos WHERE LOWER(nombre_producto) = LOWER($1);",
      [nombreProducto]
    );
    if (nameProduct.rows.length > 0) {
      return res.status(200).json({ data: 1 });
    }
    const category = await pool.query(
      "SELECT id_categoria FROM categorias WHERE id_categoria = $1",
      [idCategory]
    );
    if (category.rows.length === 0) {
      const idCategoria = 2;
      await pool.query(
        "INSERT INTO productos (nombre_producto, precio_unitario, descripcion,total, imagen, id_categoria) VALUES ($1, $2, $3, 0, $4, $5)",
        [nombreProducto, precio, descripcion, imagen, idCategoria]
      );
      return res.status(200).json({ data: 2 });
    }
    const newProduct = await pool.query(
      "INSERT INTO productos (nombre_producto, precio_unitario, descripcion,total, imagen, id_categoria) VALUES ($1, $2, $3, 0, $4, $5)",
      [nombreProducto, precio, descripcion, imagen, idCategory]
    );
    return res.status(200).json(`Añadidos ${newProduct.rowCount} registros de productos`);
  } catch (error) {
    return res.status(500).json(`Error añadiendo producto: ${error.toString()} \n ${error.stack}`);
  }
};


const createBuy = async (req, res) => {
  try {
    const idProduct = req.params.idProduct;
    const {
      cantidad,
      fechaCaducidad,
      costo_total,
      id_proveedor
    } = req.body;
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
    const day = ('0' + fechaActual.getDate()).slice(-2);
    const fechaCompra = `${year}-${month}-${day}`;
    const costoUnitarioNum = (parseFloat(costo_total) / parseInt(cantidad)).toFixed(2);
    const costoUnitario = parseFloat(costoUnitarioNum);
    const provider = await pool.query(
      "SELECT id_proveedor FROM proveedores WHERE id_proveedor = $1",
      [id_proveedor]
    );
    if (provider.rows.length === 0) {
      const idProveedor = 2;
      await pool.query(
        "INSERT INTO lotes (id_producto, cantidad, fecha_caducidad, costo_unitario, costo_total, fecha_compra, id_proveedor) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [idProduct, cantidad, fechaCaducidad, costoUnitario, costo_total, fechaCompra, idProveedor]
      );
      return res.status(200).json({ data: 2 });
    }
    const newLot = await pool.query(
      "INSERT INTO lotes (id_producto, cantidad, fecha_caducidad, costo_unitario, costo_total, fecha_compra, id_proveedor) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [idProduct, cantidad, fechaCaducidad, costoUnitario, costo_total, fechaCompra, id_proveedor]
    );
    const cantTotal = (await pool.query("SELECT total FROM productos WHERE id_producto = $1", [
      idProduct
    ])).rows[0].total;
    const total = parseInt(cantidad) + parseInt(cantTotal);
    await pool.query("UPDATE productos SET total = $1 WHERE id_producto = $2", [total, idProduct]);

    res.json({ message: "El lote ha sido creado exitosamente", lot: newLot.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo crear el lote." });
  }
};
const deleteProduct = async (req, res) => {

  const id = req.params.idProduct;
  try {
    const result1 = await pool.query('DELETE FROM lotes WHERE id_producto = $1', [id]);
    const result2 = await pool.query('DELETE FROM ventas WHERE id_producto = $1', [id]);
    const result3 = await pool.query('DELETE FROM productos WHERE id_producto = $1', [id]);
    return res.status(200).json({ message: `Eliminados ${result1.rowCount} registros de compras, ${result2.rowCount} registros de ventas y ${result3.rowCount} registros de productos` });
  } catch (error) {
    return res.status(500).json({ message: 'Error eliminando producto: ' + error });
  }
};

const deleteBuy = async (req, res) => {
  const idLot = req.params.idLot;
  try {
    const cantidad = (await pool.query("SELECT cantidad FROM lotes WHERE id_lote = $1", [idLot])).rows[0].cantidad;
    const idProduct = (await pool.query("SELECT id_producto FROM lotes WHERE id_lote = $1", [idLot])).rows[0].id_producto;
    const total = (await pool.query("SELECT total FROM productos WHERE id_producto = $1", [
      idProduct
    ])).rows[0].total;
    const nuevoTotal = parseInt(total)-parseInt(cantidad);
    await pool.query("UPDATE productos SET total = $1 WHERE id_producto = $2", [nuevoTotal, idProduct]);
    const result1 = await pool.query('DELETE FROM lotes WHERE id_lote = $1', [idLot]);
    return res.status(200).send(`Eliminados ${result1.rowCount} registros de compras`);
  } catch (error) {
    return res.status(500).send('Error eliminando compras: ' + error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { idProduct } = req.params;
    const { nombreProducto, precio, descripcion, imagen, idCategory } = req.body;
    //const { idCategory } = req.params;

    const existingProduct = await pool.query(
      "SELECT * FROM productos WHERE LOWER(nombre_producto) = LOWER($1) AND id_producto != $2",
      [nombreProducto, idProduct]
    );
    if (existingProduct.rows.length > 0) {
      return res.status(200).json({ data: 1 });
    }
    const category = await pool.query(
      "SELECT id_categoria FROM categorias WHERE id_categoria = $1",
      [idCategory]
    );
    if (category.rows.length === 0) {
      const idCategoria = 2;
        await pool.query(
        "UPDATE productos SET nombre_producto = $1, precio_unitario = $2, descripcion = $3, imagen = $4, id_categoria= $5  WHERE id_producto = $6 ",
        [nombreProducto, precio, descripcion, imagen, idCategoria, idProduct]
      );
      return res.status(200).json({ data: 2 });
    }
    const newProduct = await pool.query(
      "UPDATE productos SET nombre_producto = $1, precio_unitario = $2, descripcion = $3, imagen = $4, id_categoria= $5  WHERE id_producto = $6 ",
      [nombreProducto, precio, descripcion, imagen, idCategory, idProduct]
    );
    if (newProduct.rowCount === 0)
      return res.status(404).json({ message: "OK" });

    return res.status(200).json({ message: `El producto con ID ${idProduct} ha sido actualizado correctamente` });
  } catch (error) {
    return res.status(500).json({ message: `Error actualizando producto: ${error.message}` });
  }
};

const updateBuy = async (req, res) => {
  try {
    const { idLot } = req.params;
    const {
      cantidad,
      fecha_caducidad,
      costo_total,
      nombre_proveedor
    } = req.body;

    const idProduct = (await pool.query("SELECT id_producto FROM lotes WHERE id_lote = $1", [idLot])).rows[0].id_producto;
    const costoUnitarioNum = (parseFloat(costo_total) / parseInt(cantidad)).toFixed(2);
    const costoUnitario = parseFloat(costoUnitarioNum);
    const cantlot = (await pool.query("SELECT cantidad FROM lotes WHERE id_lote = $1", [idLot])).rows[0].cantidad;
    
    const provider = await pool.query(
      "SELECT id_proveedor FROM proveedores WHERE nombre_proveedor = $1",
      [nombre_proveedor]
    );

    let idProveedor;
    if (provider.rows.length === 0) {
      // Si el proveedor no existe, asignar un valor por defecto
      idProveedor = 7; // ID del proveedor "SIN PROVEEDOR"
    } else {
      idProveedor = provider.rows[0].id_proveedor;
    }

    await pool.query(
      "UPDATE lotes SET cantidad = $1, fecha_caducidad = $2, costo_total = $3, costo_unitario = $4, id_proveedor = $5 WHERE id_lote = $6 AND id_producto = $7",
      [cantidad, fecha_caducidad, costo_total, costoUnitario, idProveedor, idLot, idProduct]
    );

    const cantTotal = (await pool.query("SELECT total FROM productos WHERE id_producto = $1", [idProduct])).rows[0].total;
    const total = parseInt(cantTotal) - parseInt(cantlot) + parseInt(cantidad);

    await pool.query("UPDATE productos SET total = $1 WHERE id_producto = $2", [total, idProduct]);

    return res.status(200).json({ data: 2 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
const getAllBuy = async (req, res) => {

  try {
    const getBuy = await pool.query("SELECT DISTINCT l.id_lote, p.nombre_producto, l.cantidad, l.fecha_caducidad, l.costo_unitario, l.costo_total, l.fecha_compra, pr.nombre_proveedor, p.imagen FROM productos p, lotes l, proveedores pr WHERE p.id_producto = l.id_producto and l.id_proveedor = pr.id_proveedor ORDER BY fecha_compra DESC;");
    console.log(getBuy.rows);
    res.json(getBuy.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }

};
/**Ventas*/
const createSales = async (req, res) => {
  try {
    const { tipoVenta } = req.params; 
    const {
      id_producto,
      cantidad,
      id_cliente,
      precio_unitario
    } = req.body;
   
    // Verificar si el cliente existe antes de realizar la venta
    const clienteExistente = await pool.query("SELECT nombre_cliente, num_cliente FROM clientes WHERE id_cliente = $1", [id_cliente]);
    if (clienteExistente.rows.length > 0) {
      
    }else{
      return res.status(404).json({ data: 2 });
    }
    
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
    const day = ('0' + fechaActual.getDate()).slice(-2);
    const fechaVenta = `${year}-${month}-${day}`;
    const precioTotal = (parseFloat(precio_unitario) * parseInt(cantidad)).toFixed(2);
    const precio_total = parseFloat(precioTotal);
    const newsale = await pool.query(
      "INSERT INTO ventas (id_producto, id_cliente, cantidad_venta, tipo_venta, precio_total, fecha_venta) VALUES ($1, $2, $3, $4, $5, $6)",
      [id_producto, id_cliente, cantidad, tipoVenta, precio_total, fechaVenta]
    );
    const cantTotal = (await pool.query("SELECT total FROM productos WHERE id_producto = $1", [
      id_producto
    ])).rows[0].total;
    const newTotal = parseInt(cantTotal) - parseInt(cantidad);
    await pool.query("UPDATE productos SET total = $1 WHERE id_producto = $2", [newTotal, id_producto]);

    res.json({ message: "Venta exitosa", sale: newsale.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo realizar la venta." });
  }

};

const updateSales = async (req, res) => {
  try {
    const { id_venta, tipoVenta } = req.params; 
    const {
      cantidad_venta,
      nombre_cliente
    } = req.body;
    const id_producto = (await pool.query("SELECT id_producto FROM ventas WHERE id_venta = $1", [id_venta])).rows[0].id_producto;
    const precio_unitario = (await pool.query("SELECT precio_unitario FROM productos WHERE id_producto = $1", [id_producto])).rows[0].precio_unitario;
    const idCliente = (await pool.query("SELECT id_cliente FROM clientes WHERE nombre_cliente = $1",[nombre_cliente])).rows[0].id_cliente;
    const precioTotal = (parseFloat(precio_unitario) * parseInt(cantidad_venta)).toFixed(2);
    const precio_total = parseFloat(precioTotal);
    const cantVenta = (await pool.query("SELECT cantidad_venta FROM ventas WHERE id_venta = $1", [
      id_venta
    ])).rows[0].cantidad_venta;

    const newSale = await pool.query(
      "UPDATE ventas SET id_cliente = $1, cantidad_venta = $2, tipo_venta = $3, precio_total = $4 WHERE id_venta = $5 AND id_producto = $6",
      [idCliente, cantidad_venta, tipoVenta, precio_total, id_venta, id_producto]
    );
    const cantTotal = (await pool.query("SELECT total FROM productos WHERE id_producto = $1", [
      id_producto
    ])).rows[0].total;
    const newTotal = parseInt(cantTotal) + parseInt(cantVenta) - parseInt(cantidad_venta);
    await pool.query("UPDATE productos SET total = $1 WHERE id_producto = $2", [newTotal, id_producto]);

    return res.status(200).json(newSale.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


const deleteSales = async (req, res) => {
  try {
    const id_venta = req.params.id_venta;
    const cantidad = (await pool.query("SELECT cantidad_venta FROM ventas WHERE id_venta = $1", [id_venta])).rows[0].cantidad_venta;
    const idProduct = (await pool.query("SELECT id_producto FROM ventas WHERE id_venta = $1", [id_venta])).rows[0].id_producto;
    const total = (await pool.query("SELECT total FROM productos WHERE id_producto = $1", [
      idProduct
    ])).rows[0].total;
    const newTotal = parseInt(total)+parseInt(cantidad);
    await pool.query("UPDATE productos SET total = $1 WHERE id_producto = $2", [newTotal, idProduct]);
    const result1 = await pool.query('DELETE FROM ventas WHERE id_venta = $1', [id_venta]);
    return res.status(200).send(`Eliminados ${result1.rowCount} registros de ventas`);
  } catch (error) {
    return res.status(500).send('Error eliminando ventas: ' + error);
  }
};
const getSales = async (req, res) => {
  const idProduct = req.params.idProduct;
  try {
    const result = await pool.query("SELECT id_venta, id_cliente, cantidad_venta, tipo_venta , precio_total, fecha_venta FROM ventas WHERE id_producto = $1", [idProduct]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error obteniendo ventas");
  }
};
const getAllSales = async (req, res) => {
  try {
    const getAllSales = await pool.query("SELECT DISTINCT v.id_venta, p.nombre_producto, c.id_cliente, c.nombre_cliente, v.cantidad_venta, v.tipo_venta, v.precio_total, p.precio_unitario, v.fecha_venta, p.imagen FROM productos p, ventas v, clientes c WHERE p.id_producto = v.id_producto and v.id_cliente = c.id_cliente ORDER BY fecha_venta desc;");
    console.log(getAllSales.rows);
    res.json(getAllSales.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }

};

/**Clientes*/
const getAllClients = async (req, res) => {
  const result = await pool.query("SELECT * FROM clientes ORDER BY nombre_cliente ASC;");
  console.log(result);
  res.json(result.rows);
};

const getAClient = async (req, res) => {
  const idCliente = req.params.idCliente;
  try {
    const { rows } = await pool.query("SELECT nombre_cliente, num_cliente FROM clientes WHERE id_cliente = $1", [idCliente]);
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error obteniendo al cliente");
  }
};

const createAClient = async (req, res) => {
  const { nombre_cliente, num_cliente } = req.body;
  try {
    const nameClient = await pool.query(
      "SELECT * FROM clientes WHERE LOWER(nombre_cliente) = LOWER($1);",
      [nombre_cliente]
    );
    const numberClient = await pool.query(
      "SELECT * FROM clientes WHERE LOWER(num_cliente) = LOWER($1);",
      [num_cliente]
    );

    if (nameClient.rows.length > 0) {
      return res.status(200).json({ data: 1 });
    }

    if(numberClient.rows.length > 0){
      return res.status(200).json({ data: 2 });
    }
    const result = await pool.query(
      "INSERT INTO clientes (nombre_cliente, num_cliente) VALUES ($1, $2)",
      [nombre_cliente, num_cliente]
    );
    return res.json({dato : result.rows[0]});
  } catch (error) {
    console.log("Error añadiendo cliente");
    return res.json({ error: error.message });
  }
};


const deleteClient = async (req, res) => {
  const idCliente = req.params.idCliente;
  try {
    const newClientId = 7; 
    const updateSales = `UPDATE ventas SET id_cliente = $1 WHERE id_cliente = $2`;
    await pool.query(updateSales, [newClientId, idCliente]);
    const deleteClient = `DELETE FROM clientes WHERE id_cliente = $1`;
    const result = await pool.query(deleteClient, [idCliente]);

    return res.status(200).json({ message: `Eliminados ${result.rowCount} clientes` });
  } catch (error) {
    return res.status(500).json({ message: 'Error eliminando cliente: ' + error });
  }
};

const updateAClient = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const { nombre_cliente, num_cliente } = req.body;
    const existingClientResult = await pool.query("SELECT * FROM clientes WHERE id_cliente = $1",[idCliente]);
    if (existingClientResult.rows.length>0) {
    }else{return res.status(404).json({ error: 'Cliente no encontrado' });}
    const duplicateClientResult = await pool.query(
      "SELECT * FROM clientes WHERE LOWER(nombre_cliente) = LOWER($1) AND id_cliente != $2",
      [nombre_cliente, idCliente]
    );
    const duplicateClient = duplicateClientResult.rows[0];
    if (duplicateClient) {
      return res.status(202).json({ data: 1 });
    }
    const duplicateTelephoneResult = await pool.query(
      "SELECT * FROM clientes WHERE LOWER(num_cliente) = LOWER($1) AND id_cliente != $2",
      [num_cliente, idCliente]
    );
    const duplicateTelephone = duplicateTelephoneResult.rows[0];
    if (duplicateTelephone) {
      return res.status(202).json({ data: 2 });
    }

    const updatedClient = await pool.query(
      "UPDATE clientes SET nombre_cliente = $1, num_cliente = $2 WHERE id_cliente = $3",
      [nombre_cliente, num_cliente, idCliente]
    );
    return res.json({ cliente: updatedClient.rows[0] });
  } catch (error) {
    console.log("Error modificando cliente", error);
    return res.status(500).json({ error: error.message });
  }
};


/**Proveedores*/

const getAllProviders = async (req, res) => {
  const result = await pool.query("SELECT * FROM proveedores ORDER BY nombre_proveedor ASC;");
  console.log(result);
  res.json(result.rows);
};

const getAProvider = async (req, res) => {
  const idProvider = req.params.idProvider;
  try {
    const { rows } = await pool.query("SELECT nombre_proveedor, num_proveedor FROM proveedores WHERE id_proveedor = $1", [idProvider]);
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error obteniendo al proveedor");
  }
};

const createAProvider = async (req, res) => {
  const { nombreProveedor, numProveedor, descProveedor } = req.body;
  try {
    const nameProvider = await pool.query(
      "SELECT * FROM proveedores WHERE LOWER(nombre_proveedor) = LOWER($1);",
      [nombreProveedor]
    );
    if (nameProvider.rows.length > 0) {
      return res.status(200).json({ data: 1 });
    }
    const result = await pool.query(
      "INSERT INTO proveedores (nombre_proveedor, num_proveedor, descripcion_proveedor) VALUES ($1, $2, $3)",
      [nombreProveedor, numProveedor, descProveedor]
    );
    return res.json({dato : result.rows[0]});
  } catch (error) {
    console.log("Error añadiendo proveedor");
    return res.json({ error: error.message });
  }
};

const deleteProvider = async (req, res) => {
  const idProvider = req.params.idProvider;
  try {
    const providerNew = 7; 
    const newLote = `UPDATE lotes SET id_proveedor = $1 WHERE id_proveedor = $2`;
    await pool.query(newLote, [providerNew, idProvider]);
    const deleteProvider= `DELETE FROM proveedores WHERE id_proveedor = $1`;
    const result = await pool.query(deleteProvider, [idProvider]);

    return res.status(200).json({ message: `Eliminados ${result.rowCount} proveedores` });
  } catch (error) {
    return res.status(500).json({ message: 'Error eliminando proveedor: ' + error });
  }
};



const updateAProvider = async (req, res) => {
  try {
    const { idProvider } = req.params;
    const { nombre_proveedor, num_proveedor, descripcion_proveedor } = req.body;
    const existingProviderResult = await pool.query(
      "SELECT * FROM proveedores WHERE id_proveedor = $1",
      [idProvider]
    );
    const existingProvider = existingProviderResult.rows[0];
    if (!existingProvider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    const duplicateProviderResult = await pool.query(
      "SELECT * FROM proveedores WHERE LOWER(nombre_proveedor) = LOWER($1) AND id_proveedor != $2",
      [nombre_proveedor, idProvider]
    );
    const duplicateProvider = duplicateProviderResult.rows[0];
    if (duplicateProvider) {
      return res.status(200).json({ data: 1 });
    }
    const updatedProvider = await pool.query(
      "UPDATE proveedores SET nombre_proveedor = $1, num_proveedor = $2, descripcion_proveedor = $3 WHERE id_proveedor = $4",
      [nombre_proveedor, num_proveedor, descripcion_proveedor, idProvider]
    );
    return res.json({ proveedor: updatedProvider.rows[0] });
  } catch (error) {
    console.log("Error modificando proveedor", error);
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllCategories,
  getACategorie,
  createACategorie,
  deleteACategorie,
  updateACategorie,
  getProductOfCategorie,
  getAllProducts,
  getProduct,
  getBuy,
  createProduct,
  createBuy,
  deleteProduct,
  deleteBuy,
  updateProduct,
  updateBuy,
  getDbTime,
  uploadImg,
  getAllBuy,
  /**Ventas*/
  getAllSales,
  getSales,
  createSales,
  updateSales,
  deleteSales,
  /**Clientes*/
  getAllClients,
  getAClient,
  createAClient,
  deleteClient,
  updateAClient,
  /**Proveedores*/
  getAllProviders,
  getAProvider,
  createAProvider,
  deleteProvider,
  updateAProvider
};
