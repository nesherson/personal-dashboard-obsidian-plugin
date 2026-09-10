import { CaptureItem } from '@/types/personalDashboardTypes';

interface InboxItemProps {
	item: CaptureItem;
	onOpen: (item: CaptureItem) => void;
}

export function InboxItem({ item, onOpen }: InboxItemProps) {
	return (
		<li
			title={item.text}
			className="pd-item"
			data-tag={item.tag || undefined}
		>
			<div className="pd-item__body">
				<div className="pd-item__text">{item.title}</div>
				<div className="pd-item__meta">
					<span className="pd-item__time">
						{new Date(item.time).toLocaleTimeString()}
					</span>
					{item.tag ? (
						<span className="pd-item__tag">{item.tag}</span>
					) : null}
				</div>
			</div>
			<div className="pd-item__actions">
				<button
					className="pd-item__action"
					aria-label="Open note"
					onClick={(e) => {
						e.stopPropagation();
						onOpen?.(item);
					}}
				>
					&#8599;
				</button>
			</div>
		</li>
	);
}
