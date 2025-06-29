const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.post("/data", (req, res) => {
  setTimeout(() => {
    axios.post("http://webhook:5000/vendor-webhook/async", {
      request_id: req.body.request_id,
      name: req.body.name,
      email: req.body.email,
      ssn: "987-65-4321",
      vendor: "async",
    });
  }, 5000);
  res.send("Got it");
});
app.listen(4002);
