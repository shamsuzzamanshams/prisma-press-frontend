"use clint"

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React from 'react';

const RegisterFrom = () => {
	return (
		<form className='space-y-4'>
			<Card className='p-5 space-y-4'>
				<Input name="name" type="name" placeholder="Enter Your Name" required />
				<Input name="email" type="email" placeholder="Enter Your Email" required />
				<Input name="password" type="password" placeholder="Enter Your Password" required />
				<Button>
					Registration
				</Button>
			</Card>
		</form>
	);
};

export default RegisterFrom;