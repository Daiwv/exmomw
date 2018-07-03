const OrdersAPI = require('./modules/orders/ordersAPI');
const Order = require('./modules/orders/order');
const eapi = require('./modules/exmoapi/exmo');

let pairsData = {};

orderParams = {
	pair: 'HBZ_USD',
	quantity: 500,
	price: 0.00722,
	type: 'buy',
	stopSellReceiverContext: this,
	stopSellReceiverCallback: 'stopSell',
	priceIntentReceiverContext: this,
	priceIntentReceiverCallback: 'priceIntent'
}

let order = new Order(orderParams, pairsData);

getTickData();

function getTickData(){
	setTimeout(() => {
		eapi.query('ticker', {}, (data) => {
			pairsData = data;
			getTickData();
		});
	}, 3000); 
}