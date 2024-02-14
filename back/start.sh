#!/bin/bash
#set -eux

npx prisma generate
npx prisma migrate dev --name init
npm run build
#npm run start:prod
npm run start:dev