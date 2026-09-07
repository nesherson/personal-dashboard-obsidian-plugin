import { useEffect, useRef, useState } from 'react';

import { Tile } from './Tile';
import { Area } from '@/types/personalDashboardTypes';

interface CenterPanelProps {
	areas: Area[];
	title?: string;
}

export function CenterPanel({
	areas = [],
	title = 'Dashboard',
}: CenterPanelProps) {
	const [openId, setOpenId] = useState<string | null>(null);
	const root = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (openId == null) return;
		const away = (e: PointerEvent) => {
			if (!root.current?.contains(e.target as Node)) setOpenId(null);
		};
		const key = (e: KeyboardEvent) =>
			e.key === 'Escape' && setOpenId(null);
		document.addEventListener('pointerdown', away);
		document.addEventListener('keydown', key);

		return () => {
			document.removeEventListener('pointerdown', away);
			document.removeEventListener('keydown', key);
		};
	}, [openId]);

	return (
		<div
			className="pd-panel"
			ref={root}
			style={{
				containerType: 'inline-size',
			}}
		>
			<div className="pd-panel__header">
				<span>{title}</span>
			</div>
			<div className="pd-grid">
				{areas.map((area) => (
					<Tile
						key={area.id}
						area={area}
						open={openId === area.id}
						onOpen={() => setOpenId(area.id)}
						onClose={() =>
							setOpenId((cur) => (cur === area.id ? null : cur))
						}
					/>
				))}
			</div>
		</div>
	);
}
