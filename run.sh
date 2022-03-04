cd ingestor
docker run --rm -d -p 8000:8000 --name ingestor-cont ingestor
docker logs --follow ingestor-cont
