import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, params }) => {

  const email: string | null = request.headers.get("X-Goog-Authenticated-User-Email");
  const token: string | null = request.headers.get("x-goog-iap-jwt-assertion");

	return {
		userEmail: email,
    userToken: token,
    dataName: params.name
	};
};