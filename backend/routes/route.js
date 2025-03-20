const express = require("express");
const { CreateProducts,fetchAllProducts, fetchProductsById, updateProducts } = require("../controllers/CreateProducts");
const { fetchAllbrands } = require("../controllers/Brands");
const { fetchAllcategories } = require("../controllers/Categories");
const { updateUser, fetchUserById } = require("../controllers/UserDetails");
const { loginUser, UserSignUp, verifyemail, resendOTP, forgotPassword, resetPassword } = require("../controllers/Auth");
const {  fetchCartByUserId, deleteFromCart, updateCart, addToCart } = require("../controllers/Cart");
const { createOrder, fetchAllOrders, fetchAllOrdersAdmins, updateOrder } = require("../controllers/Order");
const { verifyToken } = require("../middleware/auth");

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
router.post("/verifyemail",verifyemail);
router.post("/resendotp",resendOTP);
router.post("/login",loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected cart routes
router.post("/cart", verifyToken, addToCart)
      .get("/cart", verifyToken, fetchCartByUserId)
      .delete("/cart/:id", verifyToken, deleteFromCart)
      .patch("/cart/:id", verifyToken, updateCart)

// Protected order routes
router.post("/orders", verifyToken, createOrder)
      .get("/orders/:id", verifyToken, fetchAllOrders)
      .get("/orders", verifyToken, fetchAllOrdersAdmins)
      .patch("/orders/:id", verifyToken, updateOrder)

module.exports = router;