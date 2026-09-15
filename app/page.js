'use client';

import { useEffect, useState } from 'react';

const initialBrain = [
  ['H1', 'RANGE', 'Macro context'],
  ['M15', 'SIDEWAYS', 'Directional bias'],
  ['M5', 'CHOP', 'Setup validation'],
  ['M1', 'WAITING', 'Execution trigger'],
];

export default function Home() {
  const [auto, setAuto] = useState(false);
  const [killed, setKilled] = useState(false);
  const [trigger, setTrigger] = useState(100);
  const [lock, setLock] = useState(50);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('brs-profit-lock');
    if (!raw) return;
    try {
      const v = JSON.parse(raw);
      setTrigger(v.trigger ?? 100);
      setLock(v.lock ?? 50);
    } catch {}
  }, []);

  function saveRisk() {
    localStorage.setItem('brs-profit-lock', JSON.stringify({ trigger: Number(trigger), lock: Number(lock) }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function kill() {
    setKilled(true);
    setAuto(false);
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="mark">BR</span><div><strong>BLUE RANGE</strong><small>SCALPING</small></div></div>
        <div className="instrument"><strong>NQ</strong><span>Nasdaq-100 Futures</span></div>
        <div className="status"><i /> TOPSTEPX · PRACTICE</div>
        <div className="pnl"><span>DAY P&amp;L</span><strong>$0.00</strong></div>
        <button className={auto ? 'auto active' : 'auto'} disabled={killed} onClick={() => setAuto(!auto)}>AUTO {auto ? 'ON' : 'OFF'}</button>
        <button className={killed ? 'kill killed' : 'kill'} onClick={kill}>{killed ? 'SYSTEM HALTED' : 'KILL SWITCH'}</button>
      </header>

      <section className="workspace">
        <aside className="brain panel">
          <div className="panelTitle"><span>MARKET BRAIN</span><b>LIVE LOGIC</b></div>
          {initialBrain.map(([tf,state,desc]) => <div className="brainRow" key={tf}><strong>{tf}</strong><div><span>{desc}</span><b>{state}</b></div></div>)}
          <div className="decision"><span>CURRENT DECISION</span><strong>NO TRADE</strong><small>Waiting for structure + confirmation</small></div>
          <div className="bias"><span>BIAS</span><b>NEUTRAL</b><span>CONFIDENCE</span><b>—</b></div>
        </aside>

        <section className="chart panel">
          <div className="chartHead"><div><strong>NQ</strong><span> 1m</span></div><div className="times"><b>1m</b><span>5m</span><span>15m</span><span>1H</span></div></div>
          <div className="chartGrid">
            <div className="watermark">NQ<div>MARKET DATA CONNECTION PENDING</div></div>
            <svg viewBox="0 0 900 400" preserveAspectRatio="none" aria-label="placeholder market chart"><polyline points="0,270 70,250 120,280 180,220 230,235 290,190 340,205 400,165 455,180 510,145 565,175 620,135 675,150 735,110 790,125 850,90 900,105" /></svg>
          </div>
          <div className="tradeStrip"><div><span>ENTRY</span><b>—</b></div><div><span>STOP</span><b>—</b></div><div><span>TARGET</span><b>—</b></div><div><span>RISK</span><b>$0</b></div><div><span>CONTRACTS</span><b>0</b></div></div>
        </section>

        <aside className="rightcol">
          <section className="panel risk">
            <div className="panelTitle"><span>PROFIT LOCK</span><b>STOP RELOCATION</b></div>
            <label>Trigger profit <div><span>$</span><input type="number" value={trigger} onChange={e=>setTrigger(e.target.value)} /></div></label>
            <label>Lock profit <div><input type="number" min="0" max="100" value={lock} onChange={e=>setLock(e.target.value)} /><span>%</span></div></label>
            <div className="example">At <b>+${Number(trigger)||0}</b>, protect approximately <b>+${((Number(trigger)||0)*(Number(lock)||0)/100).toFixed(0)}</b> of open profit.</div>
            <button className="save" onClick={saveRisk}>{saved ? 'SAVED ✓' : 'SAVE ADJUSTMENT'}</button>
            <small>Persistent until your next adjustment</small>
          </section>
          <section className="panel health"><div className="panelTitle"><span>SYSTEM HEALTH</span></div><p><i className="warn"/> Market data <b>PENDING</b></p><p><i className="warn"/> Execution API <b>PENDING</b></p><p><i/> Risk Engine <b>ARMED</b></p><p><i/> Journal <b>READY</b></p></section>
        </aside>
      </section>

      <section className="bottom">
        <div className="panel positions"><div className="tabs"><b>POSITIONS <em>0</em></b><span>ORDERS</span><span>TRADES</span></div><div className="empty">No open positions · Automation is {auto ? 'ON' : 'OFF'}</div></div>
        <div className="panel journal"><div className="panelTitle"><span>BOT JOURNAL</span><b>DECISION TRACE</b></div><div className="log"><time>NOW</time><p><b>NO_TRADE</b> H1 range + M15 sideways + M5 chop. Waiting for a measurable setup.</p></div><div className="log"><time>SYS</time><p>Practice safety mode initialized. Risk Engine has execution veto authority.</p></div></div>
      </section>
      <footer><span>BLUE RANGE SCALPING · CONTROL COCKPIT v0.1</span><span>{killed ? '● HALTED' : '● PRACTICE SAFE MODE'}</span></footer>
    </main>
  );
}
