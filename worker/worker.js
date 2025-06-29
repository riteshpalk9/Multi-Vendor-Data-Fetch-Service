// === FILE: worker/worker.js ===
const amqp = require("amqplib");
const mongoose = require("mongoose");
const axios = require("axios");

mongoose.connect("mongodb://mongo:27017/jobs");
const Job = mongoose.model(
  "Job",
  new mongoose.Schema({
    request_id: String,
    status: String,
    payload: Object,
    result: Object,
    vendor: String,
  })
);

async function processJob(msg) {
  const { request_id, vendor } = JSON.parse(msg.content.toString());
  const job = await Job.findOne({ request_id });
  if (!job) return;
  await Job.updateOne({ request_id }, { status: "processing" });
  try {
    if (vendor === "sync") {
      const res = await axios.post("http://vendor-sync:4001/data", job.payload);
      await Job.updateOne(
        { request_id },
        { status: "complete", result: cleanData(res.data) }
      );
    } else {
      await axios.post("http://vendor-async:4002/data", {
        ...job.payload,
        request_id,
      });
    }
  } catch (e) {
    await Job.updateOne({ request_id }, { status: "failed" });
  }
}

function cleanData(data) {
  delete data.ssn; // remove PII
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      typeof v === "string" ? v.trim() : v,
    ])
  );
}

amqp
  .connect("amqp://rabbitmq")
  .then((conn) => conn.createChannel())
  .then((ch) => {
    ch.assertQueue("jobs");
    ch.consume("jobs", async (msg) => {
      await processJob(msg);
      ch.ack(msg);
    });
  });
