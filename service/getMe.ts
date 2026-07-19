"use server"


import { cookies } from "next/headers"

export const getMe = async () => {
	const cookiStore = await cookies();
	const accessToken = cookiStore.get("accessToken")?.value;

	if (!accessToken) {
		return{
			success: false,
			message: "User Not Logged In!!!!"
		}
	}

	const res = await fetch(`${process.env.BACKEND_API_URL}/api/uaers/me`, {
		headers: {
			cookie: `accessToken: ${accessToken}`
		}
	})

	const result = res.json();

	console.log(result);

	return result;

}