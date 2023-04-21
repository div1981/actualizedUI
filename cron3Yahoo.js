const path = require('path');
const pgquery = require('./db/pgbequery');
const http = require('http');
const request = require('request');
const { stat } = require('fs');

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
function getDefaultKeyStatisticsForTicker(ticker, cb){
	getDataForTicker('defaultKeyStatistics', ticker, function(resp){
		try{
			cb(resp.body.quoteSummary.result[0].defaultKeyStatistics);
		} catch(e){
			cb('erred');
		}
	});
}

//financialdata
function getFinancialdataForTicker(ticker, cb){
	getDataForTicker('financialdata', ticker, function(resp){
		try{
			cb(resp.body.quoteSummary.result[0].financialData);
		} catch(e){
			cb('erred');
		}
	});
}

//earnings
function getEarningsForTicker(ticker, cb){
	getDataForTicker('earnings', ticker, function(resp){
		try{
			cb(resp.body.quoteSummary.result[0].earnings.financialsChart.yearly);
		} catch(e){
			cb('erred');
		}
	});
}

function updateDefaultKeyStatisticsForTicker(ticker, stats){
	var query = "update cron_yahoo_statistics set ";
	var updCount = 0;
	if(stats.enterpriseValue != null && stats.enterpriseValue.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " enterprise_value="+ stats.enterpriseValue.raw;
	}
	//forwardPE
	if(stats.forwardPE != null && stats.forwardPE.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " forward_pe="+ stats.forwardPE.raw;
	}
	// profitMargins
	if(stats.profitMargins != null && stats.profitMargins.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " profit_margins="+ stats.profitMargins.raw;
	}
	// floatShares
	if(stats.floatShares != null && stats.floatShares.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " float_shares="+ stats.floatShares.raw;
	}
	// sharesOutstanding
	if(stats.sharesOutstanding != null && stats.sharesOutstanding.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " shares_outstanding="+ stats.sharesOutstanding.raw;
	}
	// trailingEps
	if(stats.trailingEps != null && stats.trailingEps.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " trailing_eps="+ stats.trailingEps.raw;
	}
	// forwardEps
	if(stats.forwardEps != null && stats.forwardEps.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " forward_eps="+ stats.forwardEps.raw;
	}
	if(updCount > 0){
		query = query + ", date_modified=CURRENT_TIMESTAMP where ticker = '"+ticker + "'";
		pgquery.runQueryByString(query, function(doc) {});
	}
}


function updateFinancialdataForTicker(ticker, stats){
	var query = "update cron_yahoo_statistics set ";
	var updCount = 0;
	//totalRevenue
	if(stats.totalRevenue != null && stats.totalRevenue.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " total_revenue="+ stats.totalRevenue.raw;
	}
	//grossProfits
	if(stats.grossProfits != null && stats.grossProfits.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " gross_profits="+ stats.grossProfits.raw;
	}
	//earningsGrowth
	if(stats.earningsGrowth != null && stats.earningsGrowth.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " earnings_growth="+ stats.earningsGrowth.raw;
	}
	//revenueGrowth
	if(stats.revenueGrowth != null && stats.revenueGrowth.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " revenue_growth="+ stats.revenueGrowth.raw;
	}
	//grossMargins
	if(stats.grossMargins != null && stats.grossMargins.raw != null){
		if(updCount > 0)query += ",";
		updCount++;
		query = query + " gross_margins="+ stats.grossMargins.raw;
	}
	if(updCount > 0){
		query = query + ", date_modified=CURRENT_TIMESTAMP where ticker = '"+ticker + "'";
		pgquery.runQueryByString(query, function(doc) {});
	}
}



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

function getFullTimeEmployeesForTicker(ticker, cb){
	getDataForTicker('assetProfile', ticker, function(resp){
		try{
			cb(resp.body.quoteSummary.result[0].assetProfile.fullTimeEmployees);
		} catch(e){
			cb('erred');
		}
	});
	//console.log(resp.body.quoteSummary.result[0].defaultKeyStatistics.enterpriseValue.raw);
}

function validateAndInsertEarnings(ticker, earnings){
	pgquery.insertYahooEarnings(ticker, earnings.date, earnings.revenue.raw, earnings.earnings.raw, function(resp){});
}

function insertEarningsForTicker(ticker, stats){
	for (let index = 0; index < stats.length; index++) {
		const earnings = stats[index];
		try{
			validateAndInsertEarnings(ticker, earnings);
		} catch(e){
		}

	}

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

	try{
		pgquery.insertYahooAssetprofileCompensation(ticker, name, title, fiscalYear, totalPay, function(resp){});
	} catch(e){
	}

}


async function runv1(){
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

async function run(){
	while (true){
		try {
			console.log("-------------------");
			pgquery.getTickerForCronForYahooAssetprofile( async function(doc){
				ticker = doc.ticker;
				console.log(ticker);
				pgquery.updateTickerForCronForYahooAssetprofile(doc.ticker, function(doc) {});
				getFullTimeEmployeesForTicker(ticker, async function(resp){
					console.log(resp);
					pgquery.updateFullTimeEmployeesForTicker(ticker, resp, function(resp){});
				});

				getDefaultKeyStatisticsForTicker(ticker, async function(resp){
					console.log(resp);
					updateDefaultKeyStatisticsForTicker(ticker, resp, function(resp){});
				});
				
				getFinancialdataForTicker(ticker, async function(resp){
					console.log(resp);
					updateFinancialdataForTicker(ticker, resp, function(resp){});
				});

				getEarningsForTicker(ticker, async function(resp){
					console.log(resp);
					insertEarningsForTicker(ticker, resp, function(resp){});
				});
								
			});
			await new Promise(resolve => setTimeout(resolve, 3000));
				
		} catch (error) {
			console.log(error);
		}
	}
}


 run();

