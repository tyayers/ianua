import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {

	return {
    dataName: params.name,
		rowId: params.id
	};
};