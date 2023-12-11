let express = require("express");
let router = express.Router();

const { getCachedOrders } = require("../db/controller/order_cache");

//home page to display the orders
router.get("/", async function (req, res) {
  const orders = await getCachedOrders();
  res.render("index", { title: "10 orders", orders });
});

module.exports = router;