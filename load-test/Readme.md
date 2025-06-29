# Load Test Summary

**Tool Used:** k6  
**Config:** 200 virtual users, 60 seconds  
**Scenario:** Mix of POST /jobs and GET /jobs/{id}

## Results (see `results.txt`)

- Total Requests: 24,690
- Avg Response Time: ~120ms
- Max Response Time: ~850ms
- Errors: 0

## Observations

- API handled concurrent load well.
- MongoDB and RabbitMQ stayed stable.
- Async vendor introduces some delay (as expected).
- No rate-limiting issues were observed.

## Conclusion

System is performant under expected load with consistent response times. Could scale further with a distributed worker setup.
