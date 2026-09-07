import { setIcon } from 'obsidian';
import { useEffect, useRef } from 'react';

export function ObsidianIcon({ name }: { name: string }) {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		ref.current?.empty();

		if (ref.current) {
			setIcon(ref.current, name);
		}
	}, [name]);
	return <span ref={ref} />;
}
