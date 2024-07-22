/**
 * An array of routes that are publicly accessible.
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication.
 * @type {string[]}
 */
export const authRoutes: string[] = [
   "/auth/login",
   "/auth/register",
   "/auth/error",
   "/auth/reset",
   "/auth/new-password",
];

/**
 * The api prefix used for authetication.
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * The route where the user will be redirected after login.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/settings";
