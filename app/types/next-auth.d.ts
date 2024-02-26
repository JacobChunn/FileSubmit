import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
	  user: {
		id: number | string;
        role: string;
	  };
	}

	interface User {
        id: number;
        role: string;
	}
}

declare module "next-auth/jwt" {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT {
		/** OpenID ID Token */
        id: number | string;
        role: string;
	}
}