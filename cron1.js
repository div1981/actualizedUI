const path = require('path');
const pgquery = require('./db/pgquery');
const http = require('http');
const request = require('request');

console.log('Cron started at ' + Date());

function doHttpGet(inp, cb){
	var options = {
		method: 'get',
		json: true,
		url: inp,
		strictSSL: false
	};
	request(options, function(err, res){
		if(err){
			console.log('doHttpGet erred at ' + Date());
			console.log(err);
			return;
		}
		cb(res);
		return;
	});
}

function getDataForTicker(module, ticker, cb){
	doHttpGet('https://query1.finance.yahoo.com/v10/finance/quoteSummary/'+ ticker +'?modules='+module, cb);
}

//defaultKeyStatistics
function getEVRawForTicker(ticker, cb){
	getDataForTicker('defaultKeyStatistics', ticker, function(resp){
		try{
			cb(resp.body.quoteSummary.result[0].defaultKeyStatistics.enterpriseValue.raw);
		} catch(e){
			cb('erred');
		}
	});
	//console.log(resp.body.quoteSummary.result[0].defaultKeyStatistics.enterpriseValue.raw);

}

function logEVRawForTicker(ticker){
	getEVRawForTicker(ticker, function(ev){
		console.log(ticker + ' value is ' + ev);
	});
}


pgquery.getAnyDistinctOrdered('ticker', 'finviz_fundamentals', async function(doc) {
	//console.log(doc.length);
	//console.log(doc[7200]);
	
	for (var i in doc) {
		console.log(doc[i]);
		logEVRawForTicker(doc[i].ticker);
		await new Promise(resolve => setTimeout(resolve, 1800));
	}
	
});


