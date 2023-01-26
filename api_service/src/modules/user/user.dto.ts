export type UserDTO = {
	id?: string;
	name: string;
	email: string;
	password: string;
	role: number;
	user_reference: string
}

export type UserAccessDTO = {
	name: string;
	password: string;
}