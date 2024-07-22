# Data directory

This folder will contain:

-  **mongo** - This will act as a persistent source of data for mongodb
-  **aws** - This will act as a persistent source of data for aws

Ideally, you would not want to touch this directory as it contains auto generated data from the write requests you make.

In case, you changed something by mistake and the database broke down, you can stop the containers using `sudo make stop`, delete these folders and run the containers again using `sudo make start` to start a fresh database instance.
