<div align="center">
	<img src="other/readme_images/main.gif">
</div>

<h1 align="center">
	Link
</h1>
<p align="center">
	https://transcendence.transcendons.fr/
</p>


## Description
<p align="center">
	Are you the best Pong player in the world ? It's time to find out ! <br />
	This project has been completed in collaboration with <a href="https://github.com/Clachp" target="_blank">@Clachp</a>, <a href="https://github.com/Numedios" 		target="_blank">@Numedios</a> and <a href="https://github.com/AntoineDouay" target="_blank">@AntoineDouay</a>.
</p>



## Local installation

- Step 1 : Install and run Docker [Documentation](https://docs.docker.com/engine/install/)

- Step 2 : Clone the project and rename the two ".env-example" files by ".env". They are located in the "front" and "back" folders. Variables are already filled, but it's recommanded to replace them with your own values.

- Step 3 : On a terminal, go to the project folder and execute :
```bash
docker compose up --build
```

<p align="center">
	After building, your app will be running on the URL specified in the front .env file. (localhost:4173 by default)
</p>
<div align="center">
	<img src="other/readme_images/home.png">
</div>


# Features

## Pong
<div align="center">
	<img src="other/readme_images/game.gif">
</div>

<p align="center">
	After creating your account, you are ready to play Pong, the famous and timeless game from the 70s. You can add friends to challenge them or search ramdom players using the 	matchmaking feature. The first player to reach 11 points wins the game !
</p>

## Chat
<div align="center">
	<img src="other/readme_images/chat.png" width="400">
	<img src="other/readme_images/fight.png" width="400">
</div>

<p align="center">
	Playing is fun, but playing AND chatting is even better ! Join a room with your friends and other users to start a discussion. You can also create your own public and private rooms, or simply send direct messages for more privacy.
</p>

## Account
<div align="center">
	<img src="other/readme_images/settings.png" width="400">
</div>

<p align="center">
	After signing up, you can change your data whenever you want. You can both enable and disable the double authentication. Download the Google Authenticator app on your smartphone to do so.
</p>

## More
Are you a 42 student ? If so, you can sign up with your 42 account ! The app uses the OAuth 2.0 protocol to link your 42 account with this one.
