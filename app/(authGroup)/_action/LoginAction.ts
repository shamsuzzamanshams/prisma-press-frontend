"use server"

import { cookies } from "next/headers"

type LoginState = {
	success: true,
	statusCode: number,
	message: string,
	data: {
		accessToken: string,
		refreshToken: string
	}
}

export const loginAction = async (previousState: LoginState, formData: FormData) => {
	console.log(formData);
	console.log(previousState, "Previoue State");


	const email = formData.get("email");
	const password = formData.get("password");

	const payload = {
		email,
		password
	}

	const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(payload)
	});

	const result: LoginState = await res.json();

	if(result.success){
		const cookiStore = await cookies();

		cookiStore.set("accessToken",result.data.accessToken,{
			httpOnly: true,
			maxAge: 60 * 60 * 24,
			sameSite: "lax"
		})
		cookiStore.set("refreshToken",result.data.refreshToken,{
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
			sameSite: "lax"
		})
	}

	

	return result

}