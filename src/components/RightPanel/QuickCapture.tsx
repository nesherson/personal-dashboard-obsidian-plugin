import { useCallback, useState, SyntheticEvent } from 'react';

import { Tag, TAGS } from '@/types/personalDashboardTypes';

interface QuickCaptureProps {
	onCapture: ({ text, tag }: { text: string; tag: Tag }) => Promise<void>;
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
		async (e: SyntheticEvent) => {
			e?.preventDefault();
			const value = text.trim();
			if (!value) return;
			await onCapture({ text: value, tag });
			setText('');
		},
		[text, tag, onCapture],
	);

	return (
		<form className="pd-capture" onSubmit={(e) => void submit(e)}>
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
