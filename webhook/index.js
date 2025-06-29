const express = require("express");
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

app.post("/vendor-webhook/:vendor", async (req, res) => {
  const data = req.body;
  delete data.ssn;
  await Job.updateOne(
    { request_id: data.request_id },
    { status: "complete", result: data }
  );
  res.send("OK");
});

app.listen(5000);
