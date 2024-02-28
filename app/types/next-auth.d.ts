import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
	  user: {
		id: string;
        role: "normalUser" | "admin";
	  };
	}

	interface User {
        id: string;
        role: "normalUser" | "admin";
	}
}

declare module "next-auth/jwt" {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT {
		/** OpenID ID Token */
        id: string;
        role: "normalUser" | "admin";
	}
}