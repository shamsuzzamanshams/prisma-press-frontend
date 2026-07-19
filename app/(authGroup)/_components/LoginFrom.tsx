"use client"

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useActionState, useEffect } from 'react';
import { loginAction } from '../_action/LoginAction';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const LoginFrom = () => {

	const [state, action, pending] = useActionState(loginAction, false)
	// const router = useRouter()

	useEffect(() => {
		if (!state) return

		if (state.success) {
			toast.success(state.message || "Login Success");
			// router.push("/dashboard");

		}

		if (!state.success) {
			toast.error(state.message || "Login Faield")
		}


	},

		[state])
	return (
		<form action={action} className='space-y-4'>
			<Card className='p-5 space-y-4'>
				<Input name="email" type="email" placeholder="Enter Your Email" required />
				<Input name="password" type="password" placeholder="Enter Your Password" required />
				<Button>
					{
						pending ? "Submitting..." : "Login"
					}
				</Button>
			</Card>
		</form>
	);
};

export default LoginFrom;