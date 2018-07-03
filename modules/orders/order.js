const fs = require('fs');
const ordersAPI = require('./ordersAPI');

const Order = function(orderParams, dataSource){
	
	this.data = dataSource;
	
	this.open = function(orderParams, ctx, cb){  // 
		
		if(orderParams.pair && orderParams.quantity && orderParams.price && orderParams.type){
			if(orderParams.type === 'sell'){
				this.priceIntent = (typeof orderParams.priceIntent === 'string') ? parseFloat(orderParams.priceIntent) : orderParams.priceIntent || 0; ;
				this.stopSell = (typeof orderParams.stopSell === 'string') ? parseFloat(orderParams.stopSell) : orderParams.stopSell || 0;
			}
			this.stopSellReceiverContext = orderParams.stopSellReceiverContext;
			this.stopSellReceiverCallback = orderParams.stopSellReceiverCallback;
			this.priceIntentReceiverContext = orderParams.priceIntentReceiverContext;
			this.priceIntentReceiverCallback = orderParams.priceIntentReceiverCallback;
			this.pair = orderParams.pair;
			
			params = { pair: orderParams.pair, quantity: orderParams.quantity, price: orderParams.price, type: orderParams.type }
			
			ordersAPI.createOrder(params, this, function(result){
				if(result.result){
					this.buy_id = result.order_id;
					this.observe();
				}
				if(ctx && cb) cb.call(ctx, result);
			});
		}
	}
	
	this.checkState = function(){
		
		if(this.data[this.pair] !== void(0) && this.data[this.pair].sell_price <=this.stopSell){ // если цена упала ниже заданного порога безопасности - немедленно закрывать сделку
			this.cancel(this.stopSellReceiverContext, this.stopSellReceiverCallback);
		}
		if(this.data[this.pair] !== void(0) && this.data[this.pair].sell_price >= this.priceIntent){
			//this.priceHook = {};
		}
	}
	
	this.observe = function(){
		setTimeiout(this.observe(), 1000);
	}
	
	this.sell = function(){
		// 
	}
	
	this.cancel = function(ctx, cb){
		
		ordersAPI.cancelOrder(this.id, this, function(result){
			cb.call(result);
		});
	}
	
	this.open(orderParams);
}

module.exports=Order;
