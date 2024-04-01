# Home Library Service

## Prerequisites
- Docker Desktop [Download & Install Docker Desktop](https://docs.docker.com/engine/install/)
- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

***git clone -b part3 https://github.com/SoloSoft2000/nodejs2024Q1-service*** <br>
***cd nodeje2024q1-service*** <br>

## Build and Run application
#### **Before starting the application, please ensure that you do not have any other containers, volumes or applications running that may conflict with the current application (such as using the same ports, volumes, db, etc.)**

1 - create .env file (based on .env.example): <br>
***cp ./.env.example ./.env*** (_copy_ for Windows)

2 - start application via script docker:start: <br>
***npm run docker:start***

## Testing

APP: Log and ErrorLog files in docker volume **app_log**
POSTGRES: Data in docker volume **db_data**
POSTGRES: Logs in docker volume **db_log**

After application running open new terminal and enter:

#### **Before local test install NPM modules**

***npm install***

To run all tests with authorization

***npm run test:auth*** - auth testing

***npm run test:refresh*** - refresh token test

**To test error code 500 you can send GET request to /auth/error**

**To test the unhandledRejection, you can uncomment the corresponding block in main.ts**

**To test the uncaughtException, you can uncomment the corresponding block in main.ts**

## Security vulnerabilities

***npm run docker:scan***

## Stop application

***npm run docker:stop***
