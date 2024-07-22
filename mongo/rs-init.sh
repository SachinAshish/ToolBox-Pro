#!/bin/bash

function loading_icon() {
    local load_interval="${1}"
    local loading_message="${2}"
    local elapsed=0
    local loading_animation=( '—' "\\" '|' '/' )

    echo -n "${loading_message} "

    tput civis
    trap "tput cnorm" EXIT
    while [ "${load_interval}" -ne "${elapsed}" ]; do
        for frame in "${loading_animation[@]}" ; do
            printf "%s\b" "${frame}"
            sleep 0.25
        done
        elapsed=$(( elapsed + 1 ))
    done
    printf " \b\n"
}

loading_icon 10 "Waiting for db to start..."
echo "DB started"

# Initiate the mongodb replica_set if not already
docker exec -it mongo1 mongosh --eval "rs.initiate({
 _id: \"rs\",
 members: [
   {_id: 0, host: \"mongo1\"},
   {_id: 1, host: \"mongo2\"},
   {_id: 2, host: \"mongo3\"}
 ]
})"

loading_icon 10 "Initiating the replica set..."
echo "Replca set 'rs' initiated"

# Change configs of all the mongo containers
for i in mongo1 mongo2 mongo3
do
  echo "------------ $i -------------"
  docker exec -it "$i" mongosh --eval "var cfg = rs.conf();
  cfg.members[0].priority = 999;
  cfg.members[1].priority = 1;
  cfg.members[2].priority = 1;
  rs.reconfig(cfg)"
  sleep 2s
done
echo "---------------------------------"

loading_icon 10 "Changing config of the db..."
echo "Config changed"

PRIMARY_NODE=$(docker exec -it mongo1 mongosh --quiet --eval "rs.status().members.filter((member) => member.stateStr === 'PRIMARY')[0].name.split(':')[0]")

echo "Primary node is: $PRIMARY_NODE"

# Create user in the mongo1 (primary) mongo container
docker exec -it mongo1 mongosh --eval "db.getSiblingDB(\"admin\").createUser(
 {
   user: \"root\",
   pwd: \"password\",
   roles: [
     { role: \"userAdminAnyDatabase\", db: \"admin\" },
     { role: \"readWriteAnyDatabase\", db: \"admin\" }
   ]
 }
)"

echo "--------------- Finished setting up the db -----------------"