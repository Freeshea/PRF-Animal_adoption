# Animal Adoption Site

## Project Overview

This is an Animal Adoption Platform built using the MEAN stack (MongoDB, Express, Angular, Node.js). The platform allows users to browse adoptable animals, favourite them, make adoption requests (IRL meetings), browse posts. The admin can manage adoption listings, edit details, decide adoption requests and make posts.

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

4. Import the initial data into MongoDB (the backup folder is `named animals_mongo_backup` which is in the `server` directory):

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
  * Password: adminpassword

## License

This project is licensed under the MIT License.
