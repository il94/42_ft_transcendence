import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

// les services contiennent la logique metier cad les actions a executer selon la requete envoyee
@Injectable({})
export class AuthService {
	login() {}
	signup() {
		return {msg: "Yop signup"};
	}

	signin() {
		return "I am signed in"
	}
}

