import { CaptureItem } from "@/types/personalDashboardTypes";

interface InboxItemProps {
	item: CaptureItem;
	onFile: (item: CaptureItem) => void;
	onArchive: (item: CaptureItem) => void;
	onOpen: (item: CaptureItem) => void;
}

export function InboxItem({
	item,
	onFile,
	onArchive,
	onOpen,
}: InboxItemProps) {
	return (
		<li
			className="pd-item"
			data-tag={item.tag || undefined}
			onClick={() => onOpen?.(item)}
		>
			<div className="pd-item__body">
				<div className="pd-item__text">{item.text}</div>
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
					aria-label="File into note"
					onClick={(e) => {
						e.stopPropagation();
						onFile?.(item);
					}}
				>
					&#8599;
				</button>
				<button
					className="pd-item__action"
					aria-label="Archive"
					onClick={(e) => {
						e.stopPropagation();
						onArchive?.(item);
					}}
				>
					&#10003;
				</button>
			</div>
		</li>
	);
}
