# Animal Adoption Site (& DevOps)

## Project Overview

This is an Animal Adoption Platform built using the MEAN stack (MongoDB, Express, Angular, Node.js). The platform allows users to browse adoptable animals, favourite them, make adoption requests (IRL meetings), browse posts. The admin can manage adoption listings, edit details, decide adoption requests and make posts. 
New: DevOps elements, see below.

## Homescreen
<img width="1919" height="950" alt="image" src="https://github.com/user-attachments/assets/de65cdf4-a789-43ea-86fb-cfc1280491bf" />


## Prerequisites

* Git installed on your system
* Docker installed and running ( I used Docker Desktop with Windows 10)
* Node.js and npm installed
* Angular CLI installed globally

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Freeshea/PRF-Animal_adoption.git
   ```

2. Start MongoDB using Docker (sudo if necessary):

   ```bash
   docker run -d --name animals_container -p 6000:27017 -v animals_mongo_data:/data/db mongo
   ```

3. Navigate to the `server` and `client` directories and install dependencies:

   ```bash
   cd ./server
   npm install

   cd ./client
   npm install
   ```

4. Import the initial data into MongoDB (the backup folder is `named animals_mongo_backup/animals_db` which is in the `server` directory):

   ```bash
   docker cp ./animals_mongo_backup animals_container:/data/db/dump
   
   docker exec -it animals_container mongorestore --db animals_db /data/db/dump/animals_db
   ```

5. Start the server and client applications:

   ```bash
   # In the server directory
   npm run start

   # In the client directory
   ng serve
   ```

## Test User Accounts

* **User Account:**

  * Email: [teszt@t.com]
  * Password: teszt123
 
  * Email: [t@t.com]
  * Password: teszt123

* **Admin Account:**

  * Email: [admin@admin.com]
  * Password: admin123

## DevOps

For the DevOps part of the project, I used 5 tools: 
* Jenkins: test and build images, then push them to Docker Hub,
* Docker Compose: container setup and deployment,
* Nginx: serves the webpages through it and reverse proxy for server-side access,
* Prometheus: gathers data from server-side and nginx connection,
* Grafana: displays the data from Prometheus.

## What has changed:

First of all, some changes needed to be made in order to ensure the proper behavior of the new DevOps goals (I will not include the new, tool specific files created, only the changes to the original project). 
* Created new Dockerfiles in both the client and server folders for the Jenkins pipeline, this was necessary for the build of the images. (Previously used the Dockerfile only for the mongodb database container)
* In the ```server/src/index.ts``` file (and folder) I added the ```prom-client``` dependency and implemented the code for data gathering (for Prometheus). I also changed the ```dbUrl``` from: ```localhost:6000``` to: ```mongo:27017```.
* Now the project runs in separate containers (instead of just on localhost).

## What is new:
Mainly what you should definitely do if you want to replicate the work I have done.
* Jenkins setup
* docker compose commands in order to setup the containers.
* Prometheus check and Grafana setup

## Jenkins setup
* ```bash
  cd DevOps-kieg/jenkins
  docker compose up -d
  ```
* Download docker to the jenkins container, because it will use docker commands for image building. 
* Navigate in your browser to ```localhost:8080```, login with default credentials ```(/var/jenkins_home/secrets/initialAdminPassword)```
* Install suggested plugins and some additional plugins: NodeJS, Docker Pipeline, Blue Ocean, GitHub, (and basically all Docker-related plugins)
* Create Global Tool: Add NodeJS (I named it NodeJS20 and used the NodeJS 20.19.5 version)
* Add global credentials to dockerhub (might need to rewrite some code for your own DockerHub, but mine is: "freeahea")
* Create image build jobs (and deploy but this is unnecessary because I manually did this): Jenkins -> New item -> Pipeline (with custom name) -> Pipeline script from SCM -> Repository URL: ```https://github.com/Freeshea/PRF-Animal_adoption``` -> Branch to build: ```*/main``` -> Script Path: Jenkinsfile-(for client += "client", for server +="server", for deploy test +="deploy")
* With all set start the two new jobs (approx. 20 mins and 6 mins runtime, maybe more for the first run), these will build, create and push images to DockerHub. 

## Docker compose deploy
* After you successfully pushed the images, enter the commands in the root folder:
  ```bash
  docker compose -f docker-compose.prod.yaml down # if it is already running
  docker compose -f docker-compose.prod.yaml up -d
  ```
* Navigate in your browser to ```localhost:4200``` and you should see the full website working as intended. 

## Monitoring setup
* ```bash
  cd DevOps-kieg/monitoring
  docker compose -f docker-compose.monitoring.yaml down # if it is already running
  docker compose -f docker-compose.monitoring.yaml up -d
  ```
* Navigate in your browser to ```localhost:9090/targets``` and you should see two connections: nginx and server-metrics.
* Navigate to ```localhost:3000/login```, login with: ```username: "admin", password "admin"```. Go to connections/datasources -> Add data source -> Prometheus -> type in the Prometheus server url: ```http://prometheus:9090```, scroll to "Save & test"
* Go to Dashboards -> Create dashboard -> Import dashboard -> Drag and drop the ```graphs.json``` file from the ```DevOps-kieg/monitoring``` folder -> Import
* You should now see the graphs.
* You can do the same with the ```nginx_graphs.json```
* Additionally you can check if nginx metrics is setup correctly on the ```http://localhost:9113/metrics``` 

## Additional test with Postman
You can test the connection and HTTP request graphs with Postman application, for example:
* ```GET http://localhost:4200/api/app/animals``` this should display the content of the ```animals.json``` file and increase the HTTP request which is displayed in the ```nginx_graphs.json``` dashboard

## License

This project is licensed under the MIT License.
