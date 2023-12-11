const {
  getOrders,
  updateOrder,
  deleteOrder,
  addOrder,
} = require("./order_controller");

const { getRedisClient } = require("../../redisUtils");

async function getCachedOrders() {
  const redisClient = await getRedisClient();
  try {
    const curLength = await redisClient.LLEN("cache:orders");
    if (curLength < 10) {
      const newOrders = await getOrders(curLength); 
      await cacheOrders(newOrders); //cache the newly got orders
    }
    const order_ids = await redisClient.lRange("cache:orders", 0, 9); //show 10
    const orders = Promise.all(
      order_ids.map(async (order_id) => {
        return await getCachedOrderById(order_id);
      })
    );
    return orders;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function cacheOrders(orders) {
  const redisClient = await getRedisClient();
  try {
    await orders.forEach(async (order) => {
      await redisClient.rPush(
        "cache:orders",
        order.order_id.toString()
      ); 
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

async function cacheOrder(order) {
  try {
    //covert the object to key-values
    await saveDetails(order.order_id, order);
  } catch (err) {
    console.error("Error:", err);
  }
}

async function saveDetails(order_id, order) {
  const redisClient = await getRedisClient();
  try {
    await redisClient.set(`order:${order_id}:order_date`, order.order_date);
    await redisClient.set(`order:${order_id}:total_amount`, order.total_amount);
    await redisClient.set(`order:${order_id}:customer_id`, order.customer_id);   
  } catch (err) {
    console.error("Error:", err);
  }
}

//get the cached orders
async function getCachedOrderById(order_id) {
  const redisClient = await getRedisClient();
  try {
    const order = {
      order_id,
      order_date: await redisClient.get(`order:${order_id}:order_date`),
      total_amount: await redisClient.get(`order:${order_id}:total_amount`),
      customer_id: await redisClient.get(`order:${order_id}:customer_id`),
    };
    return order;
  } catch (err) {
    console.error("Error:", err);
  }
}

//update the cache
async function updateCachedOrderById(order_id, order) {
  const redisClient = await getRedisClient();
  try {
    await redisClient.lRem("cache:orders", 1, order_id);
    await redisClient.lPush("cache:orders", order_id); 

    await saveDetails(order_id, order);
    await updateOrder(order_id, order); 
  } catch (err) {
    console.error("Error:", err);
  }
}

//delete an order by id
async function deleteCachedOrderById(order_id) {
  const redisClient = await getRedisClient();
  try {
    await redisClient.lRem("cache:orders", 1, order_id);
    await redisClient.del(`order:${order_id}:order_date`);
    await redisClient.del(`order:${order_id}:total_amount`);
    await redisClient.del(`order:${order_id}:customer_id`);
    await deleteOrder(order_id); //persist delete
  } catch (err) {
    console.error("Error:", err);
  }
}

async function addCachedOrder(order) {
  const redisClient = await getRedisClient();
  try {
    const order_id = order.id;
    await redisClient.lPush("cache:orders", order_id); 

    await saveDetails(order_id, order);
    await addOrder(order); 
  } catch (err) {
    console.error("Error:", err);
  }
}

module.exports = {
  getCachedOrders,
  getCachedOrderById,
  updateCachedOrderById,
  deleteCachedOrderById,
  addCachedOrder,
};
