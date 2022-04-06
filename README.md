
# Ezzify 

Ezzify is an online home service platform. The platform helps customers to book reliable & high-quality services - beauty treatments, massages, haircuts, home cleaning, appliance repair, pest control, and more - delivered by trained professionals conveniently at home.

## Roles

* USER - A person who consume a service
* VENDOR - A person who provides the service to platform
* ADMIN - A person who manages the whole application
## Table of Contents

   1. [Demo](https://github.com/pesto-students/ezify-backend-f3-alpha-1#Demo) 
   2. [Installation](https://github.com/pesto-students/ezify-backend-f3-alpha-1#Installation)
   3. [System Architecture](https://github.com/pesto-students/ezify-backend-f3-alpha-1#System%20Architecture)
   4. [Technology Stack](https://github.com/pesto-students/ezify-backend-f3-alpha-1#Technology%20Stack)
   5. [Authors](https://github.com/pesto-students/ezify-backend-f3-alpha-1#Authors)
   6. [License](https://github.com/pesto-students/ezify-backend-f3-alpha-1#License)


## Demo

* [User App](http://ezziy.s3-website.ap-south-1.amazonaws.com/)
* [Vendor App](http://ezziy.s3-website.ap-south-1.amazonaws.com/vendorhome)
* [Admin App](http://ezziy.s3-website.ap-south-1.amazonaws.com/admin)

Test Credentials:

* For Admin
     * Email - pesto@pesto.tech



## Installation

Clone the project

    git clone --recursive https://github.com/pesto-students/ezify-backend-f3-alpha-1.git

Go to the project directory

     cd ezify-backend-f3-alpha-1
## Run Locally

Build docker image

     docker-compose build

Start the server

     docker-compose up

## Service listing on

User Service

     http://localhost/v1/users

Vendor Service

     http://localhost/v1/vendor

Admin Service

     http://localhost/admin/v1


Socket Connection

     http://localhost/socket/mysocket/




## System Architecture

This application is made on microservices architecture. A microservices architecture consists of a collection of small, autonomous services. Each service is self-contained and should implement a single business capability within a bounded context. A bounded context is a natural division within a business and provides an explicit boundary within which a domain model exists.
## Technology Stack

We tried to use a completely modern tech stack while testing out some new technologies that we had never used before. This resulted in a fast, performant, and easily-extensible web app that should be fairly future-proof for the coming next several years. We used:

* Server: [Node](https://nodejs.org/en/), [Express](https://expressjs.com/), [Socket.io](https://socket.io/)
* Database: [MongoDB](https://www.mongodb.com/)
* Event Queue: [RabbitMQ](https://www.rabbitmq.com/)
* Proxy Server: [Nginx](https://www.nginx.com/)

## Custom Package

To install @ezzify/common/build

RUN 

     npm install @ezzify/common/build
## Authors

* [Prateek Kawthekar](https://github.com/prateek66)
* [Harshit Singh Chouhan](https://github.com/harshitchouhan)
## License

[MIT](https://choosealicense.com/licenses/mit/)

