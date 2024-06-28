# Docker Instructions

This file provides information about all the docker container present inside this project. This project contains the following containers:

-  [Website](#website): For providing the web ui.
-  [Mongo](#mongo): To Provide Mongo database for development.
-  [Mongo_panel](#mongo_panel): To provide a web ui for managing mongodb.
-  [Minio](#minio): To provide object storage.

The details of all the containers and how to access them are given below:

### Website

-  Available at `localhost:3000`.

-  It has a bind mount with the `/web` directory which means, any changes made into that directory will be immediately reflected inside the container resulting in change in the structure and content of the website.

-  If you choose to install new dependencies to the `/web` directory which has a bind mount with the `website` container, you have install all the dependencies in `package.json` file by using `npm i` first, and then install the new dependencies.

-  If you make changes to the package.json file (By install any package), you have to restart the containers for it to get updated inside the containers.

-  For accessing logs during development you can use

```sh
docker logs -f website
```

### Mongo

-  It provides the NoSQL database during development of this website

-  Exposed at `localhost:27017` (Even though it is not required) for debugging and accessing it using platforms like mongodb compass.

-  Details for Connecting to the database:

```yml
Port: 27017
Username: root
Password: password
Database_name: data
IP_Address: Can be referenced using 'mongo'
```

-  To access the mongo shell (even though i you can access the user interface at `localhost:8081`)

```sh
$ docker exec -it mongo mongosh
# blah blah info

# For authentication
> use admin
> db.auth("root", "password")

# access the db as needed by you
> show dbs #....etc
```

> **Note**: After this container runs, it will create a folder inside ./data folder for persistent data

### Mongo_panel

-  It is a container which provides a user-interface for managing the mongo database

-  Exposed at `localhost:8081` (like compass)

-  Sign in Credentials:

```yml
Username: root
Password: password
```

### Minio

-  It is the object database used in this application for development purposes.

-  User-interface exposed at `localhost:9001` for managing the buckets and the objects.

-  For API requests it is exposed at `localhost:9000` (even though it is not required)

-  Sign in credentials:

```yml
Username: root
Password: password
```

-  For referencing the host address you can use `minio` keyword.

> **Note**: After this container runs, it will create a folder inside ./data folder for persistent data
