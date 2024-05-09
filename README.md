

<h1 align="center">
	Link
</h1>
<p align="center">
	https://transcendence.transcendons.fr/
</p>


## Description
Are you the best Pong player ? It's time to see this !

## Local installation

- Step 1 : Install and run Docker [Documentation](https://docs.docker.com/engine/install/)

- Step 2 : Clone project and rename the 2 ".env-example" files by ".env". They are located in "front" and "back" folders. Variables are already filled, but it is recommanded to replace them with your own values.

- Step 3 : On terminal, go to project folder and put :
```bash
docker compose up --build
```

After building, your app is running on the URL indicated in front .env file. (localhost:4173 by default)
