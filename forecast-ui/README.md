## Available Scripts

For running the **Cloud Weather application** in your laptop you can follow the steps listed below:

1. You will have to have **docker** installed in your system, which can be done by following steps mentioned in the official [Docker](https://docs.docker.com/get-docker/) documentation. 
2. You can try and run `docker -v` in terminal or command prompt to see if Docker is installed in your system.
3. After that we can build a docker image for our React App. First we need to pull the node image from docker hub which can be done by `docker pull node`. 
4. Build image of our app with `docker build -t forecast-ui:1.0.1 .` (don't forget to put the "." at the end, which tells the docker to build an image out of the current working directory.) Now you can see our image in the list of images cmd: `docker images`.
5. Now run this image in a docker container with the following command: `docker run -it --rm -p 3001:3001 forecast-ui:1.0.1`
6. Now that the container is up and running you can go to your browser and put in this url: [http://localhost:3001/](http://localhost:3001/), which goes to the website.


**Alternatively** you can run the React Application in your system by following the steps given below.
1. For running node applications in your system you need to have downloaded Node Package Manager (npm) from [Nodejs.org](https://nodejs.org/en/download/) and installed it on your system as mentioned in the documentation steps.
    You can check if npm is installed correctly by running: `npm -v`.
2. The next step is to cd into the project directory, you can run the following commands in order:
    1.`npm i` or `npm install` : command installs the required dependencies which can be found package.json file under the tag "dependencies".
    2.`npm start`: runs the application.
    3. Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

    (If you are unable to run the application please make sure you have executed the following steps correctly:
        1. Download and install the latest node package from [Nodejs.org](https://nodejs.org/en/download/).
        2. Installed all the required dependecies correctly, you can go to package.json and manually install the dependency by using:
        `npm install <dependency_name>`
        3. make sure your port 3001 is not serving any other services.
    )
The page will reload when you make and save the changes to a file in the project folder.