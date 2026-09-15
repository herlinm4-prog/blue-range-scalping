# Blue Range Scalping

Automated NQ trading control system designed around TopstepX integration.

## Objective
Build a professional web app whose backend observes the market, classifies context, generates BUY / SELL / NO TRADE decisions, manages risk, protects open profit, executes through an approved TopstepX integration, and maintains a complete journal.

The UI is a cockpit for supervising and configuring an automated trading backend, not a manual trading clone.

## Development mode
- Initial execution: **PRACTICE**
- AUTO TRADING defaults to **OFF**
- Kill Switch always overrides strategy/execution
- Risk Engine approves every order before execution
- No live-money execution until connectivity, order lifecycle, risk controls and failure handling are verified

## Initial market
- Nasdaq-100 futures
- Initial contract family: **NQ**
- Contract selection configurable; do not hard-code one expiry permanently

## Market Brain
Top-down pipeline:
1. H1 — context / structure
2. M15 — bias and zones
3. M5 — setup validation
4. M1 — execution trigger / microstructure

Classify TREND, RANGE, BREAKOUT and CHOP/NOISE, then produce BUY, SELL or NO_TRADE. Subjective trading language must become measurable, testable rules.

## Risk Engine
Independent authority over strategy. Controls include position sizing, initial stop, trade/day loss constraints, exposure limits, dynamic stop management and emergency blocking.

### Profit Lock — Stop Loss Relocation
Persistent configurable trade-management rule. Initial example:
- Trigger profit: +$100
- Lock percentage: 50%
- Result: at qualifying +$100 open profit, attempt to relocate the protective stop to approximately +$50 locked profit, respecting tick size and broker/API constraints.

Cockpit exposes these values and a **SAVE ADJUSTMENT** button. Saved settings remain active until changed. Changes and activations are journaled.

## Cockpit
Professional dark responsive UI using proven trading-terminal interaction patterns without copying proprietary assets.

Core surfaces:
- NQ contract / market status
- TopstepX connection + Practice status
- account/P&L
- AUTO OFF/ON
- permanently visible Kill Switch
- chart workspace
- Market Brain H1/M15/M5/M1 state
- bias + BUY/SELL/NO TRADE decision
- entry / stop / target / risk / contracts when applicable
- Profit Lock configuration + SAVE ADJUSTMENT
- open positions and orders
- risk metrics
- Journal explaining trades and NO_TRADE decisions
- system/connection health

## Architecture
`Market Data -> Market Brain -> Signal -> Risk Engine -> Execution Engine -> Broker/API`

Parallel observability:
`All decisions/events -> Journal + Metrics + Cockpit`

Risk Engine and Kill Switch can veto execution. Strategy cannot bypass them.

## Current phase
Foundation / visual prototype. Credentials and real order execution are intentionally not committed. Secrets will use environment configuration.
