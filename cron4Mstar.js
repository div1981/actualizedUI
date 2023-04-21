const path = require('path');
const pgquery = require('./db/pgbequery');
const http = require('http');
const https = require('https');
const request = require('request');
const { stat } = require('fs');
var _ = require('lodash');


console.log('Cron started at ' + Date());

var modules = ["exec"];

function c(l){
	// console.log(l);
}


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





function getMstarExecForTicker(id, cb){
	var options = {
		'method': 'GET',
		'url': 'https://api-global.morningstar.com/sal-service/v1/stock/insiders/keyExecutives/'+id+'/data?languageId=en&locale=en&clientId=MDC&component=sal-components-executive&version=3.59.1',
		'headers': {
		  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
		  'Cookie': '_biz_uid=3f3933fc19ed4e26d745c76596564f71; _cb_ls=1; _gcl_au=1.1.767728953.1640732043; _biz_flagsA={"Version":1,"ViewThrough":"1","XDomain":"1"}; _cb=CJy3VBCVacBdaAHkV; _gid=GA1.2.1414321747.1640732044; ELQCOUNTRY=US; _fbp=fb.1.1640732043969.1150194040; ELOQUA=GUID=9A1AEF39E2A243EE84CA70C45DEDCCD3; mid=4342497910974063304; _biz_sid=7fc454; _biz_nA=5; _biz_pendingA=[]; _chartbeat2=.1640732043363.1640742628311.1.CkWkW9CkyIhP_BYIQD_PA8EDdT0Mk.1; _cb_svref=null; _ga_G8C0R44VCK=GS1.1.1640742626.2.1.1640742628.58; _uetsid=0de61dd0683111ec8348554246c110e3; _uetvid=0de66250683111eca3db2b211e8abf71; _ga=GA1.2.1238856594.1640732043',
		  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
		  'x-api-requestid': 'bd2af094-15a5-63b3-f298-eec484420a0a',
		  'apikey': 'lstzFDEOhfFNMLikKa0am9mgEKLBl49T',
		  'x-api-realtime-e': 'eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.XmuAS3x5r-0MJuwLDdD4jNC6zjsY7HAFNo2VdvGg6jGcj4hZ4NaJgH20ez313H8An9UJrsUj8ERH0R8UyjQu2UGMUnJ5B1ooXFPla0LQEbN_Em3-IG84YPFcWVmEgcs1Fl2jjlKHVqZp04D21UvtgQ4xyPwQ-QDdTxHqyvSCpcE.ACRnQsNuTh1K_C9R.xpLNZ8Cc9faKoOYhss1CD0A4hG4m0M7-LZQ0fISw7NUHwzQs2AEo9ZXfwOvAj1fCbcE96mbKQo8gr7Oq1a2-piYXM1X5yNMcCxEaYyGinpnf6PGqbdr6zbYZdqyJk0KrxWVhKSQchLJaLGJOts4GlpqujSqJObJQcWWbkJQYKG9K7oKsdtMAKsHIVo5-0BCUbjKVnHJNsYwTsI7xn2Om8zGm4A.nBOuiEDssVFHC_N68tDjVA',
		  'x-sal-contenttype': 'e7FDDltrTy+tA2HnLovvGL0LFMwT+KkEptGju5wXVTU='
		}
	  };
	  request(options, function (error, response) {
		if (error) throw new Error(error);
		cb(response.body);
	  });

}


//generic
function getMstarIdForTicker(ticker, cb){
	const url = "https://www.morningstar.com/stocks/xnas/"+ticker.toString().toLowerCase()+"/executive";
	console.log(url);
	doHttpGet(url, function(response) {
 	//const request = https.get(url, function(response) {
		console.log(response.statusCode);
		if(200 != response.statusCode){
			const url = "https://www.morningstar.com/stocks/xnys/"+ticker.toString().toLowerCase()+"/executive";
			console.log(url);
			doHttpGet(url, function(response2) {
				console.log(response2.statusCode);
				if(200 != response2.statusCode){
					console.log("Both nas and nys failed for " + ticker);
					cb(null);
					return;
				}
				var x = response2.body.match(/premiumSecurity.*ticker/);
				console.log(x[0]);
				cb(x[0].substring(18,28));
			});
			return;
		}
		//console.log(response.body);
		var x = response.body.match(/premiumSecurity.*ticker/);
		console.log(x[0]);
		cb(x[0].substring(18,28));
   });

}



async function run(){
	i=0;
 	while (i<100000){
		 i++;
 		try {
			// console.log("-------------------");
			module = modules[0];
			pgquery.getTickerForCronMstar(async function(doc){
				// c(doc);
				ticker = doc.ticker;
				//ticker = 'MEIP'; 
				// module = 'defaultKeyStatistics';
				console.log(ticker + " - " + module);
				pgquery.setCheckedDateInStatus2("mstar", ticker, module);
				getMstarIdForTicker(ticker, async function(id){
					if(null == id)return;
					getMstarExecForTicker(id, async function(resp){
						if(_.isEqual(doc.jsonb, resp)){
							console.log(ticker + " is up-to-date for " + module);
						}else{
							console.log(ticker + " is not-up-to-date for " + module);
							pgquery.setJsonbInStatus2("mstar",ticker, module, resp);
						}
					});
				});
			});
			await new Promise(resolve => setTimeout(resolve, 2000));
				
		} catch (error) {
			console.log(error);
		}
 	}
}

run();
// console.log("111111");
// pgquery.setCheckedDateInStatus('AA', 'assetprofile');
// console.log("22222");
// pgquery.setJsonbInStatus('AA', 'assetprofile', {"a":"b"});
// console.log("3333");

