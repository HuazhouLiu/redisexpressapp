let express = require("express");
let router = express.Router();

const {
  getCachedOrderById,
  updateCachedOrderById,
  deleteCachedOrderById,
  addCachedOrder,
} = require("../db/controller/order_cache");

//display edit form
router.get("/:order_id/edit", async function (req, res) {
  const order_id = req.params.order_id;
  const order = await getCachedOrderById(order_id);
  res.render("orderForm", { title: "Order details", order });
});

//post the edit result
router.post("/:order_id/edit", async function (req, res) {
  const order_id = req.params.order_id;
  const order = req.body;
  await updateCachedOrderById(order_id, order);
  res.redirect("/");
});

//delete by id
router.get("/:order_id/delete", async function (req, res) {
  const order_id = req.params.order_id;
  await deleteCachedOrderById(order_id);
  res.redirect("/");
});

//display add form
router.get("/add", async function (req, res) {
  res.render("orderForm", { title: "Add an order", order: null });
});

//add the new order
router.post("/add", async function (req, res) {
  const order = req.body;
  await addCachedOrder(order);
  res.redirect("/");
});

module.exports = router;
