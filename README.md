# Solana Actions & Blinks Booster

In the 2026 web3 framework, onboarding friction is bypassed by bringing transactions directly to standard web interfaces. **Solana Actions** (spec-compliant APIs) and **Blinks** (Blockchain Links) convert complex on-chain tasks—such as staking, voting, or minting—into standard shareable links that can execute inside Twitter feeds, Discord rooms, or QR codes.

This repository provides a professional-grade, flat-structured reference implementation to construct, parse, and serve Actions compliant with official Solana Foundation specifications.

## Architectural Protocol
- **Action API:** Rest endpoints returning structured JSON metadata detailing the transaction's purpose, image assets, and required user input parameters.
- **Blink Client Handlers:** Front-end configuration mapping that allows dial-in wallet adapters (like Phantom or Backpack) to detect and sign the transaction payload instantly.
- **Security Checkpoints:** Implements strict CORS headers and header verification routines to mitigate cross-site scripting (XSS) or spoofing vulnerabilities.

## Quick Start
1. Install project dependencies: `npm install`
2. Define your target program IDs and local payment authority accounts within `.env`.
3. Launch the action routing service: `node actionServer.js`
