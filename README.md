## Ingestor Microservice


```
docker build -t cloud-elves/ingestor .
```

The docker image can be executed with the following command

```
docker run -d --net=host --name ingestor  cloud-elves/ingestor
```

**PS: above command will run ingestor microservice on port 8000, you can verify by hitting the [health endpoint](http://localhost:8000/health)**
