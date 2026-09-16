# Blue Range Local Agent

This component is the local execution boundary for Blue Range Scalping.

## Security model
- ProjectX/TopstepX credentials never belong in GitHub or the Vercel frontend.
- The API key is entered on the user's device and stored locally using the OS credential store in the packaged commercial agent.
- AUTO trading defaults to OFF.
- Initial connection is Practice-only and read-only until reconciliation passes.

## Connection flow
1. User opens Blue Range Agent.
2. Connect TopstepX wizard asks for username + API key locally.
3. Agent authenticates with ProjectX/TopstepX.
4. Agent discovers eligible accounts.
5. User selects PRACTICE.
6. Agent reads account, positions, orders and market connectivity.
7. Reconciliation must pass before execution controls can be armed.
8. Cockpit receives sanitized telemetry only; never the API key.

## Required states
DISCONNECTED -> AUTHENTICATING -> CONNECTED -> ACCOUNT_DISCOVERY -> PRACTICE_SELECTED -> SYNCING -> SYNCED

Failure states: AUTH_ERROR, SUBSCRIPTION_ERROR, API_ERROR, SYNC_ERROR, CONNECTION_LOST.

## Commercial architecture
Each installation is user/device scoped. Never embed a shared Blue Range trading credential. Every customer connects their own supported broker/API authorization.
