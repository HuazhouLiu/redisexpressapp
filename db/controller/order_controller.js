const { connectToClient, closeClient, getDB } = require("../../mongoUtils");

//get the orders
async function getOrders(start) {
  const client = connectToClient();
  try {
    const db = getDB(client);
    //Display 10 orders
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ _id: -1 })
      .skip(start)
      .limit(10 - start)
      .toArray();
    return orders;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    closeClient(client);
  }
}

//get order by id
async function getOrder(order_id) {
  const client = connectToClient();
  try {
    const db = getDB(client);
    const order = await db
      .collection("orders")
      .findOne({ order_id: +order_id });
    return order;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    closeClient(client);
  }
}

//updatde an order
async function updateOrder(order_id, order) {
  const client = connectToClient();
  try {
    const db = getDB(client);
    const update = {
      $set: {
        order_date: order.order_date,
        total_amount: order.total_amount,
        customer_id: order.customer_id,
      },
    };
    const result = await db
      .collection("orders")
      .updateOne({ order_id: +order_id }, update);
    return result;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    closeClient(client);
  }
}

//delete an order by id
async function deleteOrder(order_id) {
  const client = connectToClient();
  try {
    const db = getDB(client);
    const result = await db
      .collection("orders")
      .deleteOne({ order_id: +order_id });
    return result;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    closeClient(client);
  }
}

// add an order
async function addOrder(order) {
  const newOrder = {
    order_id: +order.id,
    order_date: order.order_date,
    total_amount: order.total_amount,
    customer_id: order.customer_id,
  };
  const client = connectToClient();
  try {
    const db = getDB(client);
    const result = await db.collection("orders").insertOne(newOrder);
    return result;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    closeClient(client);
  }
}

module.exports = {
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  addOrder,
};
