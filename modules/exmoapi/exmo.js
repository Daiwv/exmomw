const fs = require('fs');
const http = require('http');
const request = require('request');
const CryptoJS = require("crypto-js");
const querystring = require('querystring');

const Exmo = {
	
	simpleQuery() {
		
	},
	
	getConfig (callback) {
		fs.stat(__dirname+'/config.json', function(err, stat) {
			if(err === null) {
				result = JSON.parse(fs.readFileSync(__dirname+'/config.json'));
				result.nonce = new Date().getTime();
				callback(result);
			} else {
				callback({"APIKey":"APIKey1234", "APISecret":"APISecret1234", "host":"api.exmo.com", "protocol":"https", "APIVersion":"v1" });
			}
		});
	},

	sign(message){
		return CryptoJS.HmacSHA512(message, this.cfg.APISecret).toString(CryptoJS.enc.hex);
	},
	
	query(method_name, data, callback) {
		
		this.getConfig((config) => {

			this.cfg = config;
			this.serviceUrl = this.cfg.protocol+'://'+this.cfg.host+'/'+this.cfg.APIVersion+'/',
				
			data.nonce = this.cfg.nonce++;
			const post_data = querystring.stringify(data);
			
			const options = {
			  url: this.serviceUrl + method_name,
			  method: 'POST',
			  headers: {
				'Key': this.cfg.APIKey,
				'Sign': this.sign(post_data)
			  },
			  form:data
			};
		
			request(options, (error, response, body) => {
				if (!error && response.statusCode == 200) {
					try{
						callback(JSON.parse(body));
					} catch (e) {
						callback(body);
					}
				}else{
					callback(error);
				}
			});
		});
	}
}

module.exports=Exmo;
