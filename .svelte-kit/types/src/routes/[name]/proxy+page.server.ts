// @ts-nocheck
import type { PageServerLoad } from './$types';

export const load = async ({ request, params }: Parameters<PageServerLoad>[0]) => {

  const email: string | null = request.headers.get("X-Goog-Authenticated-User-Email");
  const token: string | null = request.headers.get("x-goog-iap-jwt-assertion");

	return {
		userEmail: email,
    userToken: token,
    dataName: params.name
	};
};