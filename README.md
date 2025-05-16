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
   git clone <GITHUB_REPO_LINK>
   ```

2. Start MongoDB using Docker:

   ```bash
   docker run --name mongodb -d -p 27017:27017 mongo
   ```

3. Navigate to the `server` and `client` directories and install dependencies:

   ```bash
   cd server
   npm install

   cd ../client
   npm install
   ```

4. Import the initial data into MongoDB (from within the `server` directory):

   ```bash
   # Replace this with the exact command for importing your data
   npm run seed
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

  * Email: [testuser@example.com](mailto:testuser@example.com)
  * Password: testpassword

* **Admin Account:**

  * Email: [adminuser@example.com](mailto:adminuser@example.com)
  * Password: adminpassword

## License

This project is licensed under the MIT License.
