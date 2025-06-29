import http from "k6/http";
import { sleep } from "k6";

export let options = {
  vus: 200,
  duration: "60s",
};

export default function () {
  const vendor = Math.random() > 0.5 ? "sync" : "async";
  const payload = JSON.stringify({
    name: "Test User",
    email: "test@example.com",
    vendor: vendor,
  });

  const headers = { headers: { "Content-Type": "application/json" } };

  // Mix of POST and GET
  const res = http.post("http://localhost:3000/jobs", payload, headers);
  const requestId = JSON.parse(res.body).request_id;

  sleep(Math.random() * 3);

  http.get(`http://localhost:3000/jobs/${requestId}`);
}
