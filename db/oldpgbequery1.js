const pg = require('pg');
const pool = new pg.Pool({
    user: 'postgres',
    // host: 'actualized.eastus.cloudapp.azure.com', //'actualized.eastus.cloudapp.azure.com', //'localhost',
    host: 'localhost', //'actualized.eastus.cloudapp.azure.com', //'localhost',
    database: 'db2',
    password: '3azyPizyGBw1nAl',
    port: '5432'
});

/*const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: '5433'
});*/

const getAnyDistinctOrdered = (col, table, callback) => {
    pool.query("select distinct "+ col +" from "+ table + " order by "+ col , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result.rows);
            callback(result.rows);
        }
    });
}

const getSector = (callback) => {
    pool.query("select distinct sector from finviz_fundamentals" , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows);
            callback(result.rows);
        }
    });
}

const getIndustry = (sector, callback) => {
    pool.query("select distinct industry from  finviz_fundamentals where sector = $1" , [sector] , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows);
            callback(result.rows);
        }
    });
}

const getRevenueRange = (sector, industry, callback) => {
    console.log(sector);
    console.log(industry);
    let query = 'select \'marketcap\' as name , min(market_cap), max(market_cap) from  finviz_custominfo where ' + 
              'sector = $1 and industry = $2 group by sector, industry union all ' +
              'select \'pm\' as name , min(profit_margin), max(profit_margin) from  finviz_custominfo where ' + 
              'sector = $1 and industry = $2 group by sector, industry union all ' +
              'select \'gm\' as name , min(gross_margin), max(gross_margin) from  finviz_custominfo where ' + 
              'sector = $1 and industry = $2 group by sector, industry union all ' +
              'select \'roi\' as name , min(roi), max(roi) from  finviz_custominfo where ' + 
              'sector = $1 and industry = $2 group by sector, industry union all ' +
              'select \'eps\' as name , min(eps_past5yrs), max(eps_past5yrs) from  finviz_custominfo where ' + 
              'sector = $1 and industry = $2 group by sector, industry union all ' +
              'select \'sales\' as name , min(sales_past5yrs), max(sales_past5yrs) from  finviz_custominfo where ' + 
              'sector = $1 and industry = $2 group by sector, industry';
    pool.query(query , [sector, industry] , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows);
            callback(result.rows);
        }
    });
}

const getActivateCode = (code, callback) => {
    pool.query("select * from  profile where authcode = $1" , [code] , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows[0]);
            callback(result.rows[0]);
        }
    });
}

const getcompensationPercentile = (sector, industry, compensation, callback) => {
    let query = "select below, ((below + 1) * 100) / (total + 1) as percentile,  (total - below) as above from" +
            " (select (select count(*)  from compensation where ticker in (select ticker from finviz_custominfo " +
            " where sector = $1 and industry = $2) and neo_total_comp < $3) as below,"+
            " (select count(*) from compensation where ticker in (select ticker from finviz_custominfo where " + 
            "sector = $1 and industry = $2)) as total) t";
    pool.query(query , [sector, industry, compensation] , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows[0]);
            callback(result.rows[0]);
        }
    });
}

const getTickerVal = (ticker, callback) => {
    console.log("ticker ", ticker);
    pool.query("select * from finviz_custominfo where ticker = $1" , [ticker] , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows[0]);
            callback(result.rows[0]);
        }
    });
}

const getTickerForCronForYahooAssetprofile = (callback) => {
    pool.query("select ticker from cron_status order by yahoo_assetprofile limit 1", (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows[0]);
            callback(result.rows[0]);
        }
    });
}

const getTickerForCron = (module, callback) => {
    pool.query("select ticker from cron_status order by "+module+" limit 1", (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows[0]);
            callback(result.rows[0]);
        }
    });
}

const updateTickerForCronForYahooAssetprofile = (ticker, callback) => {
    console.log("updateTickerForCronForYahooAssetprofile ticker ", ticker);
    pool.query("update cron_status set yahoo_assetprofile=CURRENT_TIMESTAMP where ticker = $1" , [ticker] , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log("updated rows = " + result.rowCount);
            callback(result);
        }
    });
}

const updateTickerForCron = (module, ticker, callback) => {
    console.log("updateTickerForCron ticker ", ticker);
    pool.query("update cron_status set "+module+"=CURRENT_TIMESTAMP where ticker = $1" , [ticker] , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log("updated rows = " + result.rowCount);
            callback(result);
        }
    });
}

const insertYahooAssetprofileCompensation = (ticker, name, title, fiscalYear, totalPay, callback) => {
    console.log("insertYahooAssetprofileCompensation");
    pool.query("insert into cron_yahoo_compensation (ticker, name, title, fiscal_year, total_pay) values ($1,$2,$3,$4,$5)"
               , [ticker, name, title, fiscalYear, totalPay] , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log("inserted rows = " + result.rowCount);
            callback(result);
        }
    });
}

const updateFullTimeEmployeesForTicker = (ticker, employees, callback) => {
    console.log("updateFullTimeEmployeesForTicker ticker ", ticker);
    pool.query("update cron_yahoo_statistics set full_time_employees=$2, date_modified=CURRENT_TIMESTAMP where ticker = $1" , [ticker, employees] , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log("updated rows = " + result.rowCount);
            callback(result);
        }
    });
}

const runQueryByString = (query, callback) => {
    console.log("query=", query);
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log("updated rows = " + result.rowCount);
            callback(result);
        }
    });
}

const insertYahooEarnings = (ticker, year, revenue, earnings, callback) => {
    console.log("insertYahooEarnings");
    pool.query("insert into cron_yahoo_yearwise (ticker, year, revenue, earnings, date_modified) values ($1,$2,$3,$4,CURRENT_TIMESTAMP)"
               , [ticker, year, revenue, earnings] , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log("inserted rows = " + result.rowCount);
            callback(result);
        }
    });
}

module.exports = {
    getSector,
    getIndustry,
    getRevenueRange,
    getActivateCode,
    getAnyDistinctOrdered,
    getcompensationPercentile,
    getTickerVal,
    getTickerForCronForYahooAssetprofile,
    updateTickerForCronForYahooAssetprofile,
    insertYahooAssetprofileCompensation,
    updateFullTimeEmployeesForTicker,
    runQueryByString,
    insertYahooEarnings
}
