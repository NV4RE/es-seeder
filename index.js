const randomName = require("random-name");
const { Client } = require("@elastic/elasticsearch");
const moment = require("moment");
const random = require("random");
const uuid = require("uuid/v4");

const client = new Client({
  node:
    "https://search-oms-api-x2zgu6znvskqku3imm6rlkeeyq.ap-southeast-1.es.amazonaws.com",
  apiVersion: "6.6"
});

const createOrder = () =>
  client.index({
    index: "oms-order",
    type: "oms-order",
    body: {
      tasks: [
        {
          address: randomName.place(),
          name: randomName.place(),
          location: {
            lat: random.float(10, 20),
            lon: random.float(90, 110)
          },
          direction: "PICKUP",
          createdAt: Date.now() - random.int(0, 1000000),
          startedAt: Date.now() - random.int(0, 1000000),
          completedAt: Date.now() - random.int(0, 1000000)
        },
        {
          address: randomName.place(),
          name: randomName.place(),
          location: {
            lat: random.float(10, 20),
            lon: random.float(90, 110)
          },
          direction: "DELIVERY",
          createdAt: Date.now() - random.int(0, 1000000),
          startedAt: Date.now() - random.int(0, 1000000),
          completedAt: Date.now() - random.int(0, 1000000)
        }
      ],
      passengers: [
        {
          name: `${randomName.first()} ${randomName.last()}`,
          userId: uuid()
        }
      ],
      staffs: [
        {
          name: `${randomName.first()} ${randomName.last()}`,
          userId: uuid()
        }
      ],
      extensionType: "TAXI",
      extensionFlow: "TRUE_RYDE",
      orderId: uuid(),
      refs: [uuid()],
      status: "DELIVERED",
      createdAt: Date.now() - random.int(0, 1000000),
      completedAt: Date.now() - random.int(0, 1000000)
    }
  });

(async () => {
  console.log('Start')
  for (let i = 0; i < 100000; i++) {
    console.log(`Begin loop: ${i}`)
    await Promise.all([
      createOrder(),
      createOrder(),
      createOrder(),
      createOrder(),
      createOrder(),
      createOrder(),
      createOrder(),
      createOrder(),
      createOrder(),
      createOrder(),
    ]);
    console.log(`End loop: ${i}`)
  }
})();
