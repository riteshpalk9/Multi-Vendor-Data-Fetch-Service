const express = require("express");
const app = express();
app.use(express.json());
app.post("/data", (req, res) => {
  res.json({
    name: req.body.name,
    email: req.body.email,
    ssn: "123-45-6789",
    vendor: "sync",
  });
});
app.listen(4001);
