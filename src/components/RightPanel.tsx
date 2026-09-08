import { CaptureItem, Tag } from '@/types/personalDashboardTypes';
import { useCallback, useState } from 'react';

interface RightPanelProps {
	items: CaptureItem[];
	onCapture: ({ text, tag }: { text: string; tag: Tag }) => void;
	onFile: () => void;
	onArchive: () => void;
	onOpen: () => void;
	title: string;
}

export function RightPanel({
	items = [],
	onCapture,
	onFile,
	onArchive,
	onOpen,
	title = 'Capture',
}: RightPanelProps) {
	return (
		<div
			className="pd-right-panel"
			style={{ containerType: 'inline-size' }}
		>
			<div className="pd-panel__header">
				<span>{title}</span>
			</div>
			<QuickCapture
				onCapture={onCapture}
				tags={TAGS}
				defaultTag="Note"
			/>
			<div className="pd-inbox__header">
				<span>Inbox</span>
				<span className="pd-inbox__count">
					{items.length} {items.length === 1 ? 'item' : 'items'}
				</span>
			</div>
			<Inbox
				items={items}
				onFile={onFile}
				onArchive={onArchive}
				onOpen={onOpen}
			/>
		</div>
	);
}

const TAGS = ['Idea', 'Task', 'Note'];

interface QuickCaptureProps {
	onCapture: ({ text, tag }: { text: string; tag: Tag }) => void;
	tags: string[];
	defaultTag: string;
}

export function QuickCapture({
	onCapture,
	tags = TAGS,
	defaultTag = 'Note',
}: QuickCaptureProps) {
	const [text, setText] = useState('');
	const [tag, setTag] = useState<Tag>(defaultTag as Tag);
	const [focused, setFocused] = useState(false);

	const submit = useCallback(
		(e) => {
			e?.preventDefault();
			const value = text.trim();
			if (!value) return;
			onCapture?.({ text: value, tag });
			setText('');
		},
		[text, tag, onCapture],
	);

	return (
		<form className="pd-capture" onSubmit={submit}>
			<textarea
				className="pd-capture__input"
				rows={3}
				placeholder="Write it down and forget it…"
				value={text}
				onChange={(e) => setText(e.target.value)}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' && (e.metaKey || e.ctrlKey))
						submit(e);
				}}
			/>
			<div className="pd-capture__row">
				{focused && text ? (
					<span className="pd-capture__hint">⌘↵ to capture</span>
				) : (
					<div className="pd-tags" role="group" aria-label="Type">
						{tags.map((t) => (
							<button
								key={t}
								type="button"
								className="pd-tag"
								aria-pressed={tag === t}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => setTag(t)}
							>
								{t}
							</button>
						))}
					</div>
				)}
				<button type="submit" className="pd-capture__submit">
					Capture
				</button>
			</div>
		</form>
	);
}

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
						{item.time.toLocaleTimeString()}
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

interface InboxProps {
	items: CaptureItem[];
	onFile: (item: CaptureItem) => void;
	onArchive: (item: CaptureItem) => void;
	onOpen: (item: CaptureItem) => void;
}

export function Inbox({ items = [], onFile, onArchive, onOpen }: InboxProps) {
	console.log(items);

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
				<InboxItem
					key={item.id}
					item={item}
					onFile={onFile}
					onArchive={onArchive}
					onOpen={onOpen}
				/>
			))}
		</ul>
	);
}
