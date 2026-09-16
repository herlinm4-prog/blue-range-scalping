# Practice Auto Gate

Blue Range may not transmit an autonomous order until every gate below passes on the local user's machine.

1. API authentication succeeds and the token is reused.
2. Exactly one selected account is explicitly identified as PRACTICE and canTrade=true.
3. Account state, open positions and open orders reconcile against TopstepX.
4. Active NQ contract is resolved from the simulated contract feed.
5. H1, M15, M5 and M1 bars are loaded and current.
6. Real-time user and market streams are connected and healthy.
7. Risk Guard is READY; initial rollout max size is 1 contract.
8. Kill Switch has been tested in Practice.
9. Protective-stop placement/modification and acknowledgement have been tested in Practice.
10. Profit Lock has been tested: configurable trigger and protected percentage; the initial product concept uses +$100 trigger / 50% protection.
11. Order reconciliation confirms broker acknowledgement before the UI marks ENTRY/STOP MOVE/EXIT.
12. Daily-loss and duplicate-order guards are active.

Until all gates pass, AUTO remains LOCKED. Market Brain may generate BUY_SETUP / SELL_SETUP decisions, but they are observational only and cannot transmit an order.

Current branch `practice-auto-engine` intentionally contains no call to `/api/Order/place`. This prevents an unverified build from trading merely because credentials were entered.
