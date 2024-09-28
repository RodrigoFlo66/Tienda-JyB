const { Router } = require("express");
const router = Router();

const {
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
  getAllSales,
  getSales,
  createSales,
  updateSales,
  deleteSales,
  getAllClients,
  getAClient,
  createAClient,
  deleteClient,
  updateAClient,
  getAllProviders,
  getAProvider,
  createAProvider,
  deleteProvider,
  updateAProvider
} = require("../controllers/store.controllers");

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post("/api/upload",uploadImg);

router.get("/time", getDbTime);

router.get("/store/categories", getAllCategories);

router.get("/store/categories/:id", getACategorie);

router.post("/store/categories", createACategorie);

router.delete("/store/categories/:id", deleteACategorie);

router.put("/store/categories/:id", updateACategorie);

router.get("/store/productsCategoria/:id", getProductOfCategorie);

router.get("/store/allproducts", getAllProducts);

router.get('/store/products/:idProduct', getProduct);

router.get('/store/products/buy/:idProduct', getBuy);

router.post("/store/products/:idCategory", createProduct);

router.post("/store/products/buy/:idProduct", createBuy);

router.delete("/store/products/:idProduct", deleteProduct);

router.delete("/store/products/buy/:idLot", deleteBuy);

router.put("/store/products/:idProduct", updateProduct);

router.put("/store/products/buy/:idLot", updateBuy);

router.get("/store/products/allbuy/1", getAllBuy);

/**Ventas*/
router.get("/store/products/allsales/1", getAllSales);
router.get("/store/products/sales/:idProduct", getSales);
router.post("/store/products/sales/:tipoVenta", createSales);
router.put("/store/products/sales/:id_venta/:tipoVenta", updateSales);
router.delete("/store/products/sales/:id_venta", deleteSales);
/**Clientes*/
router.get("/store/clients", getAllClients);
router.get("/store/clients/:idCliente", getAClient);
router.post("/store/clients", createAClient);
router.delete("/store/clients/:idCliente", deleteClient);
router.put("/store/clients/:idCliente", updateAClient);
/**Proveedores*/
router.get("/store/providers", getAllProviders);
router.get("/store/providers/:idProvider", getAProvider);
router.post("/store/providers", createAProvider);
router.delete("/store/providers/:idProvider", deleteProvider);
router.put("/store/providers/:idProvider", updateAProvider);
module.exports = router;
