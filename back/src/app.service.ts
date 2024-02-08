import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class AppService {
	public static connectedUsers: Map<string, Socket> = new Map();
	//public static searchingUsers: Map<string, Socket> = new Map();
}