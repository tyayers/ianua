// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = () => {
	redirect(307, '/assets');
};;null as any as LayoutServerLoad;