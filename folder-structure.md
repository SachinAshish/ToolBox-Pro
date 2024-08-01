# Folder structure/detail

-  `/web`: Contains a next js app for the user interface.

-  `/aws`: Contains the Dockerfile for running the localstack s3 service for file storage.

-  `/data`: Contains the data of aws and mongo containers for making it persistent.

-  `/nginx`: Contains config files for nginx which will get copied to the container.

-  `docker-compose.dev.yml`: Orchestrates and runs all the containers on local machine for development.
