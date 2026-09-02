# Divine Tips

https://divine-tips.vercel.app

## About

Divine Tips is a real-time stock market simulation game, with daily event telling the future outcome of items in the game.

### Gameplay

You start with a virtual balance, and you can buy up to 10 of particular item at once; and sell as many as you own. The higher you multi-buy or multi-sell, the more tax you will pay.

Whatever the price you see is what you will pay.

Items' price change as you pass the time with the hourglass. Every new in-game day, you will get an event, telling you the outcome of random items for the next day.

### Tax

There is a transaction tax of `4.5%` per item-count on buying, and `3%` on selling.

An example of multi-buy with taxes: if you were to buy 10x with the base price of `$100`, the tax would be `45%` `(4.5% * 10)`; and the tax cost is `($100 * 10) * 45%`, meaning the total transaction cost is `$1450`

## Techs

- React 19
- Next.js 15
- WebSocket
- Tailwind
- React Query
- Go 1.25.0
  - Chi Router
  - Gorilla WebSocket
- PostgreSQL 17
- Motion
- Docker
