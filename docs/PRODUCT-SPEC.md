# Blue Range Scalping — Product Specification

## Core objective
Blue Range Scalping is an automated NQ trading system whose business objective is monetary profitability while controlling downside risk and respecting account rules. Profit is not guaranteed; performance must be demonstrated through Practice/backtesting and measured expectancy.

## Initial account mission
Initial design target: Topstep 50K Combine profile. The cockpit tracks the configured profit mission, progress, remaining target, maximum-loss buffer, consistency, best day and risk state. Rules must be configuration/data driven so they can be updated when account/program rules change.

## Autonomous workflow
SCANNING -> OPPORTUNITY -> VALIDATING -> ARMED -> IN_TRADE -> PROTECTING -> EXIT -> LEARNING.
Additional states: COOLDOWN and HALTED.

## Market Brain
Top-down NQ analysis: H1 context -> M15 bias/zones -> M5 setup validation -> M1 trigger. Detect market regime before selecting a strategy. Planned regimes include trend, range, breakout, reversal and chop/noise. NO_TRADE is a first-class decision.

## Risk and profit protection
Risk Engine and account Rule Guard have veto authority. Kill Switch overrides everything. Position size must be constrained by account limits, drawdown/MLL distance, volatility, structural stop and strategy statistics. No martingale loss recovery.

Profit Lock is persistent/configurable. Example: at +$100 qualifying open profit, 50% lock attempts to protect approximately +$50 subject to tick/order constraints. Future management includes break-even, structural trailing, partial exits, MFE/MAE and Peak Profit Memory.

## Professional live execution visibility
The trader must be able to observe every meaningful automatic action in real time. The UI must display and journal:
- opportunity detected and strategy/setup selected
- validation and risk approval/rejection
- ON HOLD / NO TRADE and reason
- order submitted
- entry/fill price and size
- initial stop and target
- every stop-loss relocation, including old stop, new stop and reason
- break-even activation
- profit-lock activation and protected amount
- trailing-stop changes
- partial exits
- full exit, exit reason and realized P&L
- rejected/cancelled orders and API errors
- cooldown/session halt/kill switch
- Master -> follower copy status and per-account rejection/adjustment

Chart markers must visually distinguish ENTRY, STOP MOVE, PARTIAL, EXIT and HOLD. A Live Trade Activity stream provides a chronological execution trace. The Journal retains the deeper decision/learning record. The UI must never pretend an action occurred before broker/API acknowledgement.

## Account Mission Engine
The bot knows the mission and restrictions of the account it controls. Strategy cannot bypass this layer. Mission metrics are visible in the cockpit.

## Master / follower architecture
A Master account can generate/carry the trade intent while follower accounts receive guarded copies. Each follower independently checks enabled state, account lock, allowed size, risk and account rules. Followers do not blindly copy contract quantity.

## Learning Engine
Store executed trades and rejected/no-trade observations. Track strategy/setup, market regime, timeframe states, entry/stop/target, P&L, MFE, MAE and exit reason. Counterfactual learning follows qualified rejected opportunities virtually so the system can evaluate whether filters add or destroy edge.

## Professional product requirements
Responsive Web App for phone, tablet and desktop. Desktop is a full cockpit; mobile reorganizes information instead of shrinking the desktop layout. AUTO control and Kill Switch remain accessible. Market data/execution connectivity, risk state and degraded/error states must be explicit.

## Integration boundary
TopstepX/ProjectX integration is pending. Until real connectivity is verified, the interface must label market data and execution as PENDING and remain in Practice-safe development. Credentials belong in environment configuration, never source control.

## Current implemented foundation
- Next.js cockpit deployed via GitHub -> Vercel
- responsive desktop/mobile layout
- Account Mission UI
- bot lifecycle UI/model
- Market Brain state model
- Risk Engine + Profit Lock calculation
- Account Rule Guard
- Master/follower copy model
- Learning/counterfactual observation model
- Live Trade Activity surface and chart marker legend
- Journal and System Health surfaces

## Next engineering milestones
1. Real TopstepX/ProjectX market/account connectivity.
2. Event schema + real-time event bus feeding chart/activity/journal.
3. Candlestick/chart integration with execution markers.
4. Order lifecycle adapter with acknowledgement/reconciliation.
5. Dynamic account-rule synchronization.
6. Strategy registry and Opportunity Scanner.
7. Practice execution and replay/backtesting.
8. Performance analytics by strategy/regime/time window.
9. Guarded Master/follower synchronization.
10. Only after verification: controlled progression beyond Practice where permitted.
