# ToolBox-Pro

## Overview
The AI Toolbox is a powerful and versatile application designed to revolutionize productivity and efficiency by leveraging the capabilities of artificial intelligence. This innovative platform integrates a suite of AI-driven tools capable of performing a wide range of tasks, from writing and summarizing content to executing complex operations that typically require a team of professionals. By harnessing the power of AI agents, the AI Toolbox transforms the way individuals and businesses approach their daily workflows, making it an indispensable asset for anyone looking to optimize their processes.

## How to run on locally

> You need to ensure that you have **docker** and **docker-compose** installed on you development environment.

- Make run.sh and stop.sh executable (only required for linux/mac users)
```sh
$ chmod +x run.sh
$ chmod +x stop.sh
```

- Run the docker containers using
```sh
$ ./run.sh
```
After this the user-interface will be available at `localhost:3000`
> **Note** - It will take some time on the first execution, after that it will be faster in the further executions 

- To stop the docker containers
```sh
$ ./stop.sh
```

## Details of Different Containers

### Website

- Available at `localhost:3000`.

- It has a bind mount with the `/web` directory which means, any changes made into that directory will be immediately reflected inside the container resulting in change in the structure and content of the website.

- If you choose to install new dependencies to the `/web` directory which has a bind mount with the `website` container,  you have install all the dependencies in `package.json` file by using `npm i` first, and then install the new dependencies.

- If you make changes to the package.json file (By install any package), you have to restart the containers for it to get updated inside the containers.

- For accessing logs during development you can use
```sh
docker logs -f website
```

### Mongo

- It provides the NoSQL database during development of this website

- Exposed at `localhost:27017` (Even though it is not required) for debugging and accessing it using platforms like mongodb compass.

- Details for Connecting to the database:
```yml
Port: 27017
Username: root
Password: password
Database_name: data
IP_Address: Can be referenced using 'mongo'
```

- To access the mongo shell (even though i you can access the user interface at `localhost:8081`)
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

- It is a container which provides a user-interface for managing the mongo database

- Exposed at `localhost:8081` (like compass)

- Sign in Credentials:
```yml
Username: root
Password: password
```

### Minio

- It is the object database used in this application for development purposes.

- User-interface exposed at `localhost:9001` for managing the buckets and the objects.

- For API requests it is exposed at `localhost:9000` (even though it is not required)

- Sign in credentials:
```yml
Username: root
Password: password
```

- For referencing the host address you can use `minio` keyword.

> **Note**: After this container runs, it will create a folder inside ./data folder for persistent data