export function getRelativeTimeString(
	date: Date | string | number,
	locale = 'en',
): string {
	const targetDate = new Date(date);
	const now = new Date();

	// Difference in milliseconds
	const diffInMs = targetDate.getTime() - now.getTime();

	const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

	// Within 24 hours (past or future), format in hours
	if (Math.abs(diffInHours) < 24) {
		return rtf.format(diffInHours, 'hour');
	}

	// Outside 24 hours, format in days
	return rtf.format(diffInDays, 'day');
}
