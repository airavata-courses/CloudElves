# Build the runnable jar file

**Note: Following commands needs to be executed from the root directory of project (same level as pom.xml)**
```
mvn clean package
```
this will create a runnable jar in the target/ folder

create the docker image with the following command:

```
docker build -t cloud-elves/registry .
```

The docker image can be executed with the following command

```
docker run -d --net=host -p 8080:8080 --name registry  cloud-elves/registry
```
