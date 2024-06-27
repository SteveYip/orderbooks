# Getting Started with OrderBook Steve

## Available Scripts

In the project directory, you can run:

### `before start`

Run `yarn`

`cp .env.example .env`

add Websocket and token to env variable

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Challenges

### Large Data Volume Optimization

Challenge: The orderbook needs to handle real-time updates from WebSocket, which can involve large amounts of data. When the data volume is very high, processing and rendering the orderbook data can lead to performance issues, such as UI lag or slow response times.

### UI Enhancements

Challenge: The current orderbook user interface is relatively simple, displaying only the prices and quantities of bids and asks. As features increase and user needs evolve, the UI can be further enhanced to provide a better user experience.

### Data

Challenge: There are some data that has price but is zero

### Testing

Challenge: There are no test case
Solution: WIP
