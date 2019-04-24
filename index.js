const randomName = require("random-name");
const { Client } = require("@elastic/elasticsearch");
const random = require("random");
const uuid = require("uuid/v4");
require('dotenv').config()

const client = new Client({
  node: process.env.ES_URL,
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
  console.log("Start");
  console.log(`Runners: ${process.env.RUNNERS}, loops: ${process.env.LOOPS}, url: ${process.env.ES_URL}`)
  for (let i = 0; i < +process.env.LOOPS || 1; i++) {
    console.log(`Begin loop: ${i}`);
    const runners = (new Array(+process.env.RUNNERS || 10)).fill()

    await Promise.all(runners.map(createOrder));
    console.log(`End loop: ${i}`);
  }
})();
