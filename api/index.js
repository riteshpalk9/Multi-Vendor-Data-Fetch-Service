// === FILE: api/index.js ===
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const amqp = require("amqplib");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

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

let channel;
amqp
  .connect("amqp://rabbitmq")
  .then((conn) => conn.createChannel())
  .then((ch) => {
    channel = ch;
    channel.assertQueue("jobs");
  });

app.post("/jobs", async (req, res) => {
  const request_id = uuidv4();
  const vendor = req.body.vendor; // 'sync' or 'async'
  await Job.create({
    request_id,
    payload: req.body,
    status: "pending",
    vendor,
  });
  channel.sendToQueue(
    "jobs",
    Buffer.from(JSON.stringify({ request_id, vendor }))
  );
  res.json({ request_id });
});

app.get("/jobs/:id", async (req, res) => {
  const job = await Job.findOne({ request_id: req.params.id });
  if (!job) return res.status(404).send("Not Found");
  res.json(
    job.status === "complete"
      ? { status: "complete", result: job.result }
      : { status: job.status }
  );
});

app.listen(3000);
