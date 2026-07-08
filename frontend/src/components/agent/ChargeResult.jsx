export default function ChargeResult({ data, recommendations }) {
  const d = data;
  const recs = recommendations;

  // Find the cheapest plan that isn't the current one
  const bestAlt = recs?.find(r => !r.isCurrent && r.isCheapest);
  const currentRec = recs?.find(r => r.isCurrent);
  const hasBetterPlan = bestAlt && currentRec && bestAlt.totalCharge < currentRec.totalCharge;

  return (
    <div className="charge-result card">
      <div className="charge-header">
        <div>
          <h3 style={{ fontSize: 16 }}>💰 Charge Breakdown</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {d.startTime} → {d.endTime} ({d.durationSec}s) · Plan: {d.planName}
          </p>
        </div>
        {d.holidayOverride && <span className="badge badge-holiday">🎉 Holiday Override</span>}
      </div>

      <div className="charge-segments">
        <div className="segment-card peak">
          <div className="segment-title">⚡ Peak</div>
          <div className="segment-row"><span className="label">Raw duration</span><span>{d.peakSec}s</span></div>
          <div className="segment-row"><span className="label">Free deducted</span><span style={{color:'var(--success)'}}>-{d.freeDeductedSec > d.peakSec ? d.peakSec : Math.min(d.freeDeductedSec, d.peakSec)}s</span></div>
          <div className="segment-row"><span className="label">Pulse rounded</span><span>{d.peakBilledSec}s</span></div>
          <div className="segment-row" style={{fontWeight:600}}><span className="label">Charge</span><span>₹{d.peakCharge.toFixed(2)}</span></div>
        </div>
        <div className="segment-card offpeak">
          <div className="segment-title">🌙 Off-Peak</div>
          <div className="segment-row"><span className="label">Raw duration</span><span>{d.offPeakSec}s</span></div>
          <div className="segment-row"><span className="label">Free deducted</span><span style={{color:'var(--success)'}}>-{Math.max(0, d.freeDeductedSec - d.peakSec)}s</span></div>
          <div className="segment-row"><span className="label">Pulse rounded</span><span>{d.offPeakBilledSec}s</span></div>
          <div className="segment-row" style={{fontWeight:600}}><span className="label">Charge</span><span>₹{d.offPeakCharge.toFixed(2)}</span></div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
        🎁 Free minutes used: {d.freeDeductedSec}s / {d.planDetails?.freeSeconds || 0}s
        &nbsp;·&nbsp;Pulse: {d.planDetails?.pulseSec || 0}s
      </div>

      <div className="charge-total">
        <span className="charge-total-label">TOTAL CHARGE</span>
        <span className="charge-total-value">₹{d.totalCharge.toFixed(2)}</span>
      </div>

      {/* ── AI Plan Recommendation Engine ── */}
      {recs && recs.length > 1 && (
        <div className="ai-recommend" style={{ marginTop: 20 }}>
          <div className="ai-recommend-header">
            <div className="ai-recommend-icon">🤖</div>
            <div>
              <h4 className="ai-recommend-title">AI Plan Recommendation</h4>
              <p className="ai-recommend-subtitle">
                {hasBetterPlan
                  ? `Switch to ${bestAlt.planName} and save ₹${bestAlt.savings.toFixed(2)} on this call!`
                  : '✅ You\'re already on the best plan for this call pattern.'}
              </p>
            </div>
          </div>

          {/* Savings banner if a better plan exists */}
          {hasBetterPlan && (
            <div className="ai-savings-banner">
              <span className="ai-savings-amount">Save ₹{bestAlt.savings.toFixed(2)}</span>
              <span className="ai-savings-text">
                by switching to <strong>{bestAlt.planName}</strong>
              </span>
            </div>
          )}

          {/* Plan comparison table */}
          <div className="ai-plans-list">
            {recs.map((rec, i) => (
              <div
                key={rec.planId}
                className={`ai-plan-row ${rec.isCurrent ? 'current' : ''} ${rec.isCheapest ? 'cheapest' : ''}`}
              >
                <div className="ai-plan-rank">
                  {i === 0 ? '🏆' : `#${i + 1}`}
                </div>
                <div className="ai-plan-info">
                  <div className="ai-plan-name">
                    {rec.planName}
                    {rec.isCurrent && <span className="badge badge-agent" style={{ marginLeft: 8 }}>Current</span>}
                    {rec.isCheapest && !rec.isCurrent && <span className="badge badge-cheapest" style={{ marginLeft: 8 }}>Recommended</span>}
                  </div>
                  <div className="ai-plan-meta">
                    ₹{rec.peakRate}/min peak · ₹{rec.offPeakRate}/min off-peak · {Math.floor(rec.freeSeconds / 60)}m free · {rec.pulseSec}s pulse
                  </div>
                </div>
                <div className="ai-plan-charge-col">
                  <div className="ai-plan-charge">₹{rec.totalCharge.toFixed(2)}</div>
                  {rec.savings > 0 && (
                    <div className="ai-plan-savings">-₹{rec.savings.toFixed(2)}</div>
                  )}
                  {rec.savings < 0 && (
                    <div className="ai-plan-extra">+₹{Math.abs(rec.savings).toFixed(2)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
