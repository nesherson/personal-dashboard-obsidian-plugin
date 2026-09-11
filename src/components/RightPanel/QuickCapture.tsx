import { useCallback, useState, SyntheticEvent } from 'react';

import { DEFAULT_TAG, Tag, TAGS } from '@/types/personalDashboardTypes';

export interface CaptureNoteProps {
	title: string;
	text: string;
	tag: Tag;
}

interface QuickCaptureProps {
	onCapture: ({ title, text, tag }: CaptureNoteProps) => Promise<void>;
	tags?: readonly Tag[];
	defaultTag?: Tag;
}

export function QuickCapture({
	onCapture,
	tags = TAGS,
	defaultTag = DEFAULT_TAG,
}: QuickCaptureProps) {
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const [tag, setTag] = useState<Tag>(defaultTag);
	const [focused, setFocused] = useState(false);

	const submit = useCallback(
		async (e: SyntheticEvent) => {
			e?.preventDefault();
			const noteTitle = title;
			const noteText = text;
			if (!noteTitle) return;
			await onCapture({ title: title, text: noteText, tag });
			setText('');
			setTitle('');
		},
		[text, tag, onCapture],
	);

	return (
		<form className="pd-capture" onSubmit={(e) => void submit(e)}>
			<input
				className="pd-capture__input"
				placeholder="Note title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<textarea
				className="pd-capture__textarea"
				rows={3}
				placeholder="Note details"
				value={text}
				onChange={(e) => setText(e.target.value)}
				onFocus={() => setFocused(true)}
				onBlur={() => setFocused(false)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' && (e.metaKey || e.ctrlKey))
						void submit(e);
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
