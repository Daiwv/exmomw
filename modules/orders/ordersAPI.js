const eapi = require('../exmoapi/exmo');

const OrdersAPI = {
	
	getOpenOrders(ctx, cb){
		
		eapi.query("user_open_orders", {}, (openOrders) => {
			cb.call(ctx, openOrders);
		})
	},
	
	cancelOrder(orderId, ctx, cb){	// order_id 
		
		eapi.query("order_cancel", { order_id: orderId }, (result) => { 
			cb.call(ctx, result);
		})
	},
	
	createOrder(orderData, ctx, cb){  // { pair, quantity, price, type (buy/sell) }
	
		eapi.query("order_create", orderData, (result) => {
			cb.call(ctx, result);
		})
	},
	
	getUserTrades(tradesParams, ctx, cb){  // { pair, limit (default 100, max 10000), offset (default 0) }
	
		eapi.query("user_trades", tradesParams, (result) => {
			cb.call(ctx, result);
		})
	},
	
	getOrderTrades(orderId, ctx, cb){  // { pair, limit (default 100, max 10000), offset (default 0) }
	
		eapi.query("order_trades", { order_id: orderId }, (result) => {
			cb.call(ctx, result);
		})
	}
}

module.exports=OrdersAPI;