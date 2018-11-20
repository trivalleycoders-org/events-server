#!/usr/bin/env bash

# copy server code to remote server
echo "Copying files..."
rsync -avzhe 'ssh -i ~/.ssh/tvc-do-deploy-rsa' --progress --relative ./config/* deploy@test.droneevents.live:~/server/
rsync -avzhe 'ssh -i ~/.ssh/tvc-do-deploy-rsa' --progress --relative ./db/* deploy@test.droneevents.live:~/server/
rsync -avzhe 'ssh -i ~/.ssh/tvc-do-deploy-rsa' --progress --relative ./logger/* deploy@test.droneevents.live:~/server/
rsync -avzhe 'ssh -i ~/.ssh/tvc-do-deploy-rsa' --progress --relative ./routes/* deploy@test.droneevents.live:~/server/
rsync -avzhe 'ssh -i ~/.ssh/tvc-do-deploy-rsa' --progress --relative ./server/* deploy@test.droneevents.live:~/server/
rsync -avzhe 'ssh -i ~/.ssh/tvc-do-deploy-rsa' --progress --relative ./.babelrc deploy@test.droneevents.live:~/server/
rsync -avzhe 'ssh -i ~/.ssh/tvc-do-deploy-rsa' --progress --relative ./.env deploy@test.droneevents.live:~/server/
rsync -avzhe 'ssh -i ~/.ssh/tvc-do-deploy-rsa' --progress --relative ./yarn.lock deploy@test.droneevents.live:~/server/
rsync -avzhe 'ssh -i ~/.ssh/tvc-do-deploy-rsa' --progress --relative ./utils.js deploy@test.droneevents.live:~/server/
rsync -avzhe 'ssh -i ~/.ssh/tvc-do-deploy-rsa' --progress --relative ./package.json deploy@test.droneevents.live:~/server/

# install in case there are package dependencies requiring updates
echo
echo 'installing server packages'
ssh -i ~/.ssh/tvc-do-deploy-rsa deploy@test.droneevents.live 'cd ~/server/; nohup yarn --ignore-engines install'

# find and kill previous node processes
echo
echo "Finding previous node instances"
ssh -i ~/.ssh/tvc-do-deploy-rsa deploy@test.droneevents.live 'pgrep -a node'

echo
echo "Killing old node instance and restarting"
ssh -i ~/.ssh/tvc-do-deploy-rsa deploy@test.droneevents.live 'pkill node'

# check to see if the processes died
echo
ssh -i ~/.ssh/tvc-do-deploy-rsa deploy@test.droneevents.live 'pgrep -a node'
# See https://community.hortonworks.com/questions/148074/unable-to-successfully-launch-beeline-script-from.html
# for a good explanation on how nohup works...
ssh -i ~/.ssh/tvc-do-deploy-rsa deploy@test.droneevents.live 'cd ~/server/; export NODE_ENV=test; nohup yarn start 1> nohup.out 2>&1 &'

echo
ssh -i ~/.ssh/tvc-do-deploy-rsa deploy@test.droneevents.live 'pgrep -a node'


