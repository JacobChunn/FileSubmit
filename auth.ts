// This is a dynamic route handler, or a catch all route for auth, meaning /api/auth/* will have its route be defined here

import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getEmployeeByUsername } from './app/lib/data';
import bcrypt from 'bcrypt';
import { access } from 'fs';
import { Employee } from './app/lib/definitions';

export const config = {
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: 'Credentials',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				username: {
				label: 'Username',
				type: 'text',
				placeholder: 'Enter Username:',
				},
				password: {
				label: 'Password',
				type: 'password',
				placeholder: 'Enter Password:',
				},
			},
			async authorize(credentials, req) {
				// You need to provide your own logic here that takes the credentials
				// submitted and returns either a object representing a user or value
				// that is false/null if the credentials are invalid.
				// e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
				// You can also use the `req` object to obtain additional parameters
				// (i.e., the request IP address)

				// const res = await fetch("http://localhost:3000/api/login", { // Implement this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				//   method: 'POST',
				//   headers: { "Content-Type": "application/json" },
				//   body: JSON.stringify({
				//       username: credentials?.username,
				//       password: credentials?.password,
				//   }),
				// })

				if (!credentials) return null;

				const res = await getEmployeeByUsername(credentials.username);

				type roleAndID = {
					role: string,
					id: string
				}

				const foundUser: Employee & roleAndID = await res.json();
				//console.log(foundUser);

				if (!foundUser) return null;

				const match = await bcrypt.compare(
				credentials.password,
				foundUser.password,
				);

				if (match) {
					console.log('Found User was a match!');

					// return {
					// 	id: foundUser.id,
					// 	role: foundUser.accesslevel < 200 ? 'normalUser' : 'admin',
					// };

					foundUser.role = 'normalUser';

					return foundUser;
				}

				console.log('Found User was NOT a match');
				// Return null if user data could not be retrieved
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
		
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.id = token.id;
				session.user.role = token.role;
			}
			return session;
		},
	},
} satisfies NextAuthOptions;

export const handler = NextAuth(config);
