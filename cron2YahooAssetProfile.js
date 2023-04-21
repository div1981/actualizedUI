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


//defaultKeyStatistics
function getCompanyOfficersForTicker(ticker, cb){
	getDataForTicker('assetProfile', ticker, function(resp){
		try{
			cb(resp.body.quoteSummary.result[0].assetProfile.companyOfficers);
		} catch(e){
			cb('erred');
		}
	});
	//console.log(resp.body.quoteSummary.result[0].defaultKeyStatistics.enterpriseValue.raw);

}


function validateAndInsert(ticker, officer){
	var name = officer.name;
	if(null == name) return;
	var title = officer.title;
	if(null == title) return;
	var fiscalYear = officer.fiscalYear;
	if(null == fiscalYear) return;
	var totalPay = officer.totalPay;
	if(null == totalPay) return;
	var totalPay = totalPay.raw;
	if(null == totalPay) return;

	pgquery.insertYahooAssetprofileCompensation(ticker, name, title, fiscalYear, totalPay, function(resp){});

}


async function run(){
	while (true){
		try {
			console.log("-------------------");
			pgquery.getTickerForCronForYahooAssetprofile( async function(doc){
				ticker = doc.ticker;
				console.log(ticker);
				getCompanyOfficersForTicker(ticker, async function(resp){
					console.log(resp);
					for (let index = 0; index < resp.length; index++) {
						const officer = resp[index];
						validateAndInsert(ticker, officer);
						await new Promise(resolve => setTimeout(resolve, 100));
					}
				});
	
				pgquery.updateTickerForCronForYahooAssetprofile(doc.ticker, function(doc) {});
				
			});
			await new Promise(resolve => setTimeout(resolve, 1000));
				
		} catch (error) {
			console.log(error);
		}
	}
	
}

run();

