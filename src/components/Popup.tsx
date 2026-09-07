import { Area } from '../types/personalDashboardTypes';

interface PopupProps {
	area: Area;
	open: boolean;
	onClose: () => void;
	flip: { right: boolean; above: boolean };
}

export function Popup({ area, open, onClose, flip }: PopupProps) {
	const cls = [
		'pd-popup',
		flip.right ? 'pd-popup--right' : '',
		flip.above ? 'pd-popup--above' : '',
		open ? 'is-open' : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div
			className={cls}
			role="dialog"
			aria-label={`${area.title} preview`}
		>
			<button
				className="pd-popup__close"
				aria-label="Dismiss"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onClose();
				}}
			>
				&times;
			</button>
			<div className="pd-popup__title">{area.title}</div>
			<p className="pd-popup__text">{area.preview}</p>
			{area.meta ? (
				<div className="pd-popup__meta">{area.meta}</div>
			) : null}
			<a
				className="pd-popup__open"
				href={area.href}
				onClick={(e) => e.stopPropagation()}
			>
				Open note
			</a>
		</div>
	);
}
