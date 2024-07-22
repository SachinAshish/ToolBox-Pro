# Container Details/Instructions

This file provides information about all the docker container present inside this project. This project contains the following containers:

-  [Website](#website): For providing the web ui.
-  [Load_Balancer](#load_balancer): For load balancing the app when it scales to multiple containers.
-  [Mongo](#mongo): To Provide Mongo database for development.
-  [Mongo_panel](#mongo_panel): To provide a web ui for managing mongodb.
-  [Localstack S3](#localstack-s3): To provide object storage.
-  [Pdf-API](#pdf-api): To provide an API for pdf manipulation

The details of all the containers and how to access them are given below:

### Website

-  Available at `localhost:3000`.

-  It has a bind mount with the `/web` directory which means, any changes made into that directory will be immediately reflected inside the container resulting in change in the structure and content of the website.

-  If you make changes to the package.json file (By install any package), you have to restart the containers for it to get updated inside the containers.

-  For accessing logs during development you can use

```sh
docker logs -f website
```

-  For accessing the shell of the container on which the app is running use

```sh
docker exec -it website bash
```

-  For accessing the realtime state of the database, you can go to `localhost:5555` for accessing the prisma studio.

### Load_balancer

-  This container is a nginx server which load balances multiple website containers.

-  For seeing it in action you can go to `localhost:80`.

-  For development purposes, you have to use `localhost:3000` as nginx does not provid hot reload once connected to the app, so you have to reload the app every time you make changes to it.

-  This was added just for fun though... It may be usefull in the production

### Mongo (replica set of 3 nodes)

-  It provides the NoSQL database during development of this website (in production an external database provider may be used)

-  Primary node exposed at `localhost:27017` (Even though it is not required) for debugging and accessing it using platforms like mongodb compass.

-  Details for Connecting to the database during development:

```yml
Port: 27017, 27018, 27019
Username: root
Password: password
Database_name: data
IP_Address: Can be referenced using 'mongo'
```

-  To access the mongo shell (even though you can access the user interface at `localhost:8081`)

```sh
$ docker exec -it mongo mongosh --username root --password password --host mongo1
```

> **Note**: After this container runs, it will create a folder inside ./data folder for persistent data

### Mongo_panel

-  It is a container which provides a user-interface for managing the mongo database during development

-  Exposed at `localhost:8081` (for compass like User interface)

-  Sign in Credentials:

```yml
Username: root
Password: password
```

### Localstack s3

-  It is the object database used in this application for development purposes (AWS S3 or S3 from anyother vendor may be used in production).

-  User-interface can be accessed using the resource browser provided by localstack at `https://app.localstack.cloud/inst/default/resources/s3` for managing the buckets and the objects.

-  For API requests it is exposed at `localhost:4566` (even though it is not required)

-  Sign in credentials:

```yml
endpoint: "http://s3:4566"
forcePathStyle: true
accessKeyId: "test" # Dummy for development purposes
secretAccessKey: "test" # Dummy for development purposes
region: "us-east-1" # Dummy for development purposes
```

-  For referencing the host address you can use `s3` keyword.

> **Note**: After this container runs, it will create a folder inside ./data folder for persistent data

### Pdf-API

-  It is an API which provides services to make changes to the PDF documents.

-  It was referenced from [Stirling-PDF](https://github.com/Stirling-Tools/Stirling-PDF) git repo.

-  The docs can be found at [swaggerhub](https://app.swaggerhub.com/apis-docs/Frooodle/Stirling-PDF/0.26.1#/).

-  User interface exposed at `localhost:4000` for accessing all the tools.

-  For accessing this api, you can use `pdf-api:8080/` inside the website container or another container.
   -  `pdf-api`: For the host address of the container.
   -  `8080`: The port which is exposed by the container.
