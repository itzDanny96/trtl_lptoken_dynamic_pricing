# Dynamic Pricing for LP tokens 

This was built for [Am_Panic](https://x.com/am__panic) to dynamically price an asset in LP tokens.


## Getting Started

First, clone this repository.

Move to new directory.

Run development server with command:

```
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## API Requirements

ADA and TRTL USD price are received from coingecko free api.


LP tokens total supply from koios api requiring a free api key. To generate one you connect your wallet and subscribe to the free tier and here: https://koios.rest/pricing/Pricing.html.

- see `pages/api/getTotalLPTokens.ts`

The solution also relies on the taptools api for the total TVL in the ADA/TRTL pool which can be purchased here: https://www.taptools.io/openapi/subscription#payment-plans.

- see `pages/api/getTRTLTVL.ts`
