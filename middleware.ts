export { auth as middleware } from "next-auth";
export const config = {
  matcher: [
    "/((?!api/auth|signin|signup|public|_next|favicon.ico).*)"
  ],
};
