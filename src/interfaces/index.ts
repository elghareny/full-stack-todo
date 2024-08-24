/** @format */

export interface IRegisterInput {
	name: "username" | "email" | "password";
	placeholder: string;
	type: string;
	validation: {
		required?: boolean;
		minLength?: number;
		pattern?: RegExp;
	};
}
export interface ILoginInput {
	name: "identifier" | "password";
	placeholder: string;
	type: string;
	validation: {
		required?: boolean;
		minLength?: number;
		pattern?: RegExp;
	};
}

export interface IFormInputRegister {
	username: string;
	email: string;
	password: string;
}
export interface IFormInputLogin {
	identifier: string;
	password: string;
}

export interface IErrorResponse {
	error: {
		details?: {
			errors: string;
		}[];
		message?: string;
	};
}

export interface ITodo {
	id: number;
	title: string;
	description: string;
}
