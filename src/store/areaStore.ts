import { Area } from '@/types/personalDashboardTypes';

export class AreaStore {
	private areas: Area[] = [];
	private listeners = new Set<() => void>();

	subscribe = (onStoreChange: () => void) => {
		this.listeners.add(onStoreChange);

		return () => {
			this.listeners.delete(onStoreChange);
		};
	};

	getSnapshot = () => this.areas;

	setAreas(areas: Area[]) {
		this.areas = areas;

		for (const listener of this.listeners) {
			listener();
		}
	}
}
