// @ts-nocheck
import type { PageLoad } from './$types';

export const load = async ({ params }: Parameters<PageLoad>[0]) => {

	return {
    dataName: params.name
	};
};