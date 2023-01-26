export type UserDTO = {
	id?: string;
	name: string;
	email: string;
	password: string;
	role: number;
}

export type UserAccessDTO = {
	name: string;
	password: string;
}