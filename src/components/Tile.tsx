import { Area } from '@/types/personalDashboardTypes';
import { useLayoutEffect, useRef, useState, ReactNode } from 'react';
import { Popup } from './Popup';
import { ObsidianIcon } from './ui/ObsidianIcon';
import { usePersonalDashboardContext } from '@/context/personalDashboardContext';
import { TFile } from 'obsidian';

interface TileProps {
	area: Area;
	open: boolean;
	onOpen: () => void;
	onClose: () => void;
	icon?: ReactNode;
}

const GAP = 6;
const EDGE = 12;

export function Tile({ area, open, onOpen, onClose }: TileProps) {
	const { app, plugin } = usePersonalDashboardContext();

	const ref = useRef<HTMLDivElement>(null);
	const [flip, setFlip] = useState({ right: false, above: false });

	useLayoutEffect(() => {
		if (!open || !ref.current) return;
		const popupEl = ref.current.querySelector<HTMLElement>('.pd-popup');
		if (!popupEl) return;

		const tile = ref.current.getBoundingClientRect();
		const bounds = (
			ref.current.closest('.workspace-leaf-content') ??
			document.documentElement
		).getBoundingClientRect();

		const popupH = popupEl.offsetHeight;
		const popupW = popupEl.offsetWidth;

		const roomBelow = bounds.bottom - EDGE - (tile.bottom + GAP);
		const roomAbove = tile.top - GAP - (bounds.top + EDGE);
		const roomRight = bounds.right - EDGE - tile.left;
		const roomLeft = tile.right - (bounds.left + EDGE);

		setFlip({
			right: roomRight < popupW && roomLeft > roomRight,
			above: roomBelow < popupH && roomAbove > roomBelow,
		});
	}, [open]);

	const touch = isTouch();

	return (
		<div
			ref={ref}
			className={`pd-tile${area.image ? ' pd-tile--image' : ''}`}
			style={{
				backgroundImage: area.image
					? `url("${area.image}")`
					: undefined,
			}}
			onClick={(e) => {
				if (touch && !open) {
					e.preventDefault();
					onOpen();
				} else if (!touch) {
					const file = app.vault.getAbstractFileByPath(
						`${plugin.areasPath}/${area.id}.md`,
					);

					if (!(file instanceof TFile)) return;

					void app.workspace.getLeaf(false).openFile(file);
				}
			}}
			onMouseEnter={touch ? undefined : onOpen}
			onMouseLeave={touch ? undefined : onClose}
			onFocus={touch ? undefined : onOpen}
			onBlur={touch ? undefined : onClose}
		>
			{area.image ? (
				<span className="pd-tile__media" />
			) : (
				<span className="pd-tile__icon">
					{area.icon ? (
						<ObsidianIcon name={area.icon} />
					) : (
						<DefaultIcon />
					)}
				</span>
			)}
			<h3 className="pd-tile__title">{area.title}</h3>
			<Popup area={area} open={open} onClose={onClose} flip={flip} />
		</div>
	);
}

function DefaultIcon() {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
		>
			<rect x="3" y="3" width="10" height="10" rx="2" />
		</svg>
	);
}

const isTouch = () =>
	typeof window !== 'undefined' &&
	window.matchMedia('(hover: none), (pointer: coarse)').matches;
