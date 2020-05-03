export function timeAgo(date: Date): string {
  const ms = new Date().getTime() - date.getTime();
  const sec = Math.round(ms / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  const month = Math.round(day / 30);
  const year = Math.round(month / 12);

  if (ms < 0) {
    return formatRelativeTime(0, 'second')
  } else if (sec < 10) {
    return formatRelativeTime(0, 'second')
  } else if (sec < 45) {
    return formatRelativeTime(-sec, 'second')
  } else if (sec < 90) {
    return formatRelativeTime(-min, 'minute')
  } else if (min < 45) {
    return formatRelativeTime(-min, 'minute')
  } else if (min < 90) {
    return formatRelativeTime(-hr, 'hour')
  } else if (hr < 24) {
    return formatRelativeTime(-hr, 'hour')
  } else if (hr < 36) {
    return formatRelativeTime(-day, 'day')
  } else if (day < 30) {
    return formatRelativeTime(-day, 'day')
  } else if (month < 18) {
    return formatRelativeTime(-month, 'month')
  } else {
    return formatRelativeTime(-year, 'year')
  }
}


type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';


export function formatRelativeTime(t: number, unit: TimeUnit): string { 
  if (t === 0) {
    return 'Just now';
  }

  if (unit === 'day' && t === -1) {
    return 'Yesterday';
  }

  const plural = t === 1 ? '' : 's';
  const relative = t < 0 ? 'ago' : 'from now';
  t = -t;

  return `${t} ${unit + plural} ${relative}`;
}
