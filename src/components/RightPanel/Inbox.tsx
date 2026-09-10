import { CaptureItem } from '@/types/personalDashboardTypes';
import { InboxItem } from './InboxItem';

interface InboxProps {
	items: CaptureItem[];
	onOpen: (item: CaptureItem) => void;
}

export function Inbox({ items = [], onOpen }: InboxProps) {
	if (!items.length) {
		return (
			<div className="pd-empty">
				<div className="pd-empty__glyph" />
				<div className="pd-empty__title">Inbox is clear</div>
				<div className="pd-empty__hint">
					Captured items land here until you file them.
				</div>
			</div>
		);
	}
	return (
		<ul className="pd-inbox">
			{items.map((item) => (
				<InboxItem key={item.id} item={item} onOpen={onOpen} />
			))}
		</ul>
	);
}
