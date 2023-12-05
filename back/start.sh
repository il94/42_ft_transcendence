#!/bin/bash
#set -eux

npx prisma migrate dev --name init

npm run start:dev