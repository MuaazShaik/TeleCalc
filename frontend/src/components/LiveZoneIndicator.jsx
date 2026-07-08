import { useState, useEffect } from 'react';
import { get } from '../api';

export default function LiveZoneIndicator() {
  const [status, setStatus] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const fetchStatus = () => get('/time/zone-status').then(setStatus).catch(() => {});
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!status) return;
    setCountdown(status.secondsUntilSwitch);
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [status]);

  if (!status) return null;

  const isHoliday = status.isHoliday;
  const isPeak = !isHoliday && status.isPeak;
  const cls = isHoliday ? 'holiday' : (isPeak ? 'peak' : 'offpeak');
  const label = isHoliday ? '🎉 HOLIDAY' : (isPeak ? '⚡ PEAK' : '🌙 OFF-PEAK');
  const h = Math.floor(countdown / 3600);
  const m = Math.floor((countdown % 3600) / 60);
  const countdownStr = h > 0 ? `${h}h ${m}m` : `${m}m`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div className={`zone-pill ${cls}`}>
        <span className="zone-dot" />
        {label}
        {!isHoliday && <span className="zone-countdown">ends in {countdownStr}</span>}
      </div>
    </div>
  );
}
