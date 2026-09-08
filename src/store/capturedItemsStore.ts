import { CaptureItem } from "@/types/personalDashboardTypes";

export class CapturedItemsStore {
	private items: CaptureItem[] = [];
	private listeners = new Set<() => void>();

	subscribe = (onStoreChange: () => void) => {
		this.listeners.add(onStoreChange);

		return () => {
			this.listeners.delete(onStoreChange);
		}
	}

	getSnapshot = () => this.items;

	setItems(items: CaptureItem[]) {
		this.items = items;

		for (const listener of this.listeners) {
			listener();
		}
	}
}
