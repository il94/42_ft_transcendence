export type User = {
	id: number,
	id42?: number,
	createdAt?: string,
	username: string,
	hash: string,
	email?: string,
	tel?: string,
	profilePicture: string,
	state: string,
	scoreResume: {
		wins: number,
		draws: number,
		looses: number
	}
}