## Forecast Microservice


```
docker build -t cloud-elves/forecast .
```

The docker image can be executed with the following command

```
docker run -d --net=host --name forecast  cloud-elves/forecast
```

**PS: above command will run forecast microservice on port 8001, you can verify by hitting the [health endpoint](http://localhost:8001/health)**
