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

const createAndRetry = async count => {
  const runners = (new Array(count)).fill()
  const results = await Promise.all(runners.map(async () => {
    try {
      await createOrder()
      return 'SUCCESS'
    } catch (error) {
      return 'FAILED'
    }
  }))
  const failedResults = results.filter(result => result === 'FAILED')
  if (failedResults.length > 0) {
    console.log(`Retring ${failedResults.length} request`)
    await createAndRetry(failedResults.length)
  }
}


(async () => {
  console.log("Start");
  console.log(`Runners: ${process.env.RUNNERS || 10}, loops: ${process.env.LOOPS || 1}, url: ${process.env.ES_URL}`)
  for (let i = 0; i < (+process.env.LOOPS || 1); i++) {
    console.log(`Begin loop: ${i}`);
    await createAndRetry(+process.env.RUNNERS || 10)
    console.log(`End loop: ${i}`);
  }
})();
