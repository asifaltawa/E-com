const express = require("express");
const { CreateProducts,fetchAllProducts, fetchProductsById, updateProducts } = require("../controllers/CreateProducts");
const { fetchAllbrands } = require("../controllers/Brands");
const { fetchAllcategories } = require("../controllers/Categories");
const { updateUser, fetchUserById } = require("../controllers/UserDetails");
const { loginUser, UserSignUp } = require("../controllers/Auth");
const {  fetchCartByUserId, deleteFromCart, updateCart, addToCart } = require("../controllers/Cart");
const { createOrder, fetchAllOrders, fetchAllOrdersAdmins, updateOrder } = require("../controllers/Order");

const router = express.Router();


//define APi routes
router.post("/products",CreateProducts)
      .get("/products",fetchAllProducts)
      .get("/products/:id",fetchProductsById)
      .patch("/products/:id",updateProducts)
router.get("/brands",fetchAllbrands)
router.get("/categories",fetchAllcategories)
router.patch("/user/:id",updateUser).get("/user/:id",fetchUserById)
router.post("/signup",UserSignUp);
router.post("/login",loginUser);
router.post("/cart",addToCart)
      .get("/cart",fetchCartByUserId)
      .delete("/cart/:id",deleteFromCart)
      .patch("/cart/:id",updateCart)
router.post("/orders",createOrder)
      .get("/orders/:id",fetchAllOrders)
      .get("/orders",fetchAllOrdersAdmins)
      .patch("/orders/:id",updateOrder)
module.exports = router;