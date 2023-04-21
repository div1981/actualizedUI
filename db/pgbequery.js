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

const getTickerForCron = (module, callback) => {
    //console.log("select ticker from cron_status order by yahoo_"+module+"_checked limit 1");
    pool.query("select ticker, yahoo_"+module+"_jsonb as jsonb from cron_status order by yahoo_"+module+"_checked limit 1", (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result.rows[0]);
            callback(result.rows[0]);
        }
    });
}

const getTickerForCron2 = (site, module, callback) => {
    //console.log("select ticker from cron_status order by yahoo_"+module+"_checked limit 1");
    pool.query("select ticker, " + site +"_"+module+"_jsonb as jsonb from cron_status order by " + site +"_"+module+"_checked limit 1", (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result.rows[0]);
            callback(result.rows[0]);
        }
    });
}


const getTickerForCronMstar = (callback) => {
    //console.log("select ticker from cron_status order by yahoo_"+module+"_checked limit 1");
    pool.query("select ticker, mstar_exec_jsonb as jsonb from cron_status where mstar_exec_jsonb is null order by mstar_exec_updated limit 1", (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result.rows[0]);
            callback(result.rows[0]);
        }
    });
}

async function  getJsonbForMstarCompensation(callback){
    pool.query("select ticker, mstar_exec_jsonb as jsonb from cron_status cs where mstar_exec_jsonb is not null order by mstar_exec_checked limit 1", async function(err, result){
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result.rows[0]);
            await pool.query("update cron_status set mstar_exec_checked=CURRENT_TIMESTAMP where ticker = $1", [result.rows[0].ticker]);
            callback(result.rows[0]);
        }
    });
}


// const updateTickerForCronForYahooAssetprofile = (ticker, callback) => {
//     console.log("updateTickerForCronForYahooAssetprofile ticker ", ticker);
//     pool.query("update cron_status set yahoo_assetprofile=CURRENT_TIMESTAMP where ticker = $1" , [ticker] , (err, result) => {
//         if(err){
//             console.log(err);
//             callback(null);
//         }else{
//             console.log("updated rows = " + result.rowCount);
//             callback(result);
//         }
//     });
// }

// const updateTickerForCron = (module, ticker, callback) => {
//     console.log("updateTickerForCron ticker ", ticker);
//     pool.query("update cron_status set "+module+"=CURRENT_TIMESTAMP where ticker = $1" , [ticker] , (err, result) => {
//         if(err){
//             console.log(err);
//             callback(null);
//         }else{
//             console.log("updated rows = " + result.rowCount);
//             callback(result);
//         }
//     });
// }

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

async function insertMstarCompensation(ticker, name, title, year, totalPay, callback){
    pool.query("insert into mstar_compensation (ticker, name, title, year, total_pay) values ($1,$2,$3,$4,$5)"
               , [ticker, name, title, year, totalPay] , (err, result) => {
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

async function setCheckedDateInStatus2 (site, ticker, field) {
    await pool.query("update cron_status set " + site +"_"+field+"_checked=CURRENT_TIMESTAMP , " + site +"_"+field+"_updated=CURRENT_TIMESTAMP  where ticker = $1", [ticker]);
}

async function setCheckedDateInStatus (ticker, field) {
    await pool.query("update cron_status set yahoo_"+field+"_checked=CURRENT_TIMESTAMP where ticker = $1", [ticker]);
}

async function setJsonbInStatus2 (site, ticker, field, jsondata) {
    await pool.query("update cron_status set " + site +"_"+field+"_updated=CURRENT_TIMESTAMP," + site +"_"+field+"_jsonb=$2 where ticker = $1", [ticker, jsondata]);
}

async function setJsonbInStatus (ticker, field, jsondata) {
    await pool.query("update cron_status set yahoo_"+field+"_updated=CURRENT_TIMESTAMP,yahoo_"+field+"_jsonb=$2 where ticker = $1", [ticker, jsondata]);
}

async function setMStarId (ticker, id) {
    await pool.query("update cron_status set mstar_id=$2 where ticker = $1", [ticker, id]);
}

const getTest = (industry) => {
    console.log("industry=" + industry);
    inds = industry.split(',');
    pool.query(
        "  select distinct ticker, industry from finviz_plus_compensationv2 where sector='Financial' and  industry = ANY($1) order by 2    "
    ,[inds], (err, result) => {
        if(err){
            console.log(err);
        }else{
            console.log(result.rows);
        }
    });
}

const companySql1 =
        "  with input_data_1 as (select $8::real roi, $7::real revenue_growth, $6::real gross_margins, $2 sector, $3::character varying[] industry, $4::real revenue_low, $5::real revenue_high, $1 ticker)   " +
        "  , input_data_2 as (select distinct CASE WHEN cys.trailing_eps is null THEN 'roi' ELSE 'eps' END roi_eps_text, COALESCE(cys.trailing_eps,in1.roi) roi_eps, COALESCE(fpc2.sector,in1.sector) sector, CASE when in1.industry is null and in1.sector is not null then (select array_agg(distinct industry) from finviz_plus_compensationv2 fpc22 where fpc22.sector=in1.sector) when fpc2.industry is null then in1.industry else  (select array_agg(distinct industry) from finviz_plus_compensationv2 fpc22 where fpc22.sector=fpc2.sector)  end industry, CASE when cys.total_revenue is null then in1.revenue_low else 0.5*cys.total_revenue end revenue_low, CASE when cys.total_revenue is null then in1.revenue_high else 2.0*cys.total_revenue end revenue_high, COALESCE(cys.gross_margins,in1.gross_margins) gross_margins, COALESCE(cys.revenue_growth,in1.revenue_growth) revenue_growth   " +
        "      from input_data_1 in1 left outer join finviz_plus_compensationv2 fpc2 on fpc2.ticker=in1.ticker   " +
        "  	   left outer join cron_yahoo_statistics cys on cys.ticker=in1.ticker) /* select * from input_data_2 */   " +
        "  , benchmark_companies as (select distinct CASE WHEN in2.roi_eps_text='roi' THEN fpc2.roi*100 ELSE cys.trailing_eps::real END roi_eps, cys.revenue_growth*100 revenue_growth, cys.gross_margins*100 gross_margins, fpc2.ticker, fpc2.company_name,  cys.total_revenue " +
        "         , (fpc2.roi*100)::decimal(9,3) roi_c, cys.trailing_eps eps_c,  to_char(cys.total_revenue, '999,999,999,999,999')  total_revenue_c, (cys.revenue_growth*100)::decimal(9,3) revenue_growth_c, (cys.gross_margins*100)::decimal(9,3) gross_margins_c   " +
        "  	   from input_data_2 in2, cron_yahoo_statistics cys, finviz_plus_compensationv2 fpc2   " +
        "  	   where fpc2.sector=in2.sector and fpc2.industry=ANY(in2.industry) and cys.ticker=fpc2.ticker   " +
        "  	   and cys.total_revenue between in2.revenue_low and in2.revenue_high) /* select * from benchmark_companies order by roi_eps */   ";

const getCompanyBenchmark = (ticker, sector, industry, revenue_low, revenue_high, gross_margins, revenue_growth, roi, callback) => {
    console.log("queryData for getCompanyBenchmark:: ticker=" + ticker + ",roi=" + roi + ",sector=" + sector +",industry=" + industry + ",revenue_low=" +revenue_low + ",revenue_high=" +revenue_high + ",gross_margins=" +gross_margins + ",revenue_growth=" + revenue_growth);
    var industrya = null;
    if(null != industry) industrya = industry.split(',');
    pool.query( companySql1 +
        "  select * from benchmark_companies order by total_revenue  "
    , [ticker, sector, industrya, revenue_low, revenue_high, gross_margins, revenue_growth, roi], (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result.rows);
            callback(result.rows);
        }
    });
}

const getCompanyPercentile = (ticker, sector, industry, revenue_low, revenue_high, gross_margins, revenue_growth, roi, callback) => {
    console.log("queryData for getCompanyPercentile:: ticker=" + ticker + ",roi=" + roi + ",sector=" + sector +",industry=" + industry + ",revenue_low=" +revenue_low + ",revenue_high=" +revenue_high + ",gross_margins=" +gross_margins + ",revenue_growth=" + revenue_growth);
    var industrya = null;
    if(null != industry) industrya = industry.split(',');
    pool.query( companySql1 +
        "  , gross_margins_score as (select count(*) score from benchmark_companies where gross_margins is null or gross_margins < (select gross_margins from input_data_2))   " +
        "  , revenue_growth_score as (select count(*) score from benchmark_companies where revenue_growth is null or revenue_growth < (select revenue_growth from input_data_2))   " +
        "  , maximum_score as (select 1+count(*) score from benchmark_companies)   " +
        "  , roi_eps_score as (select count(*) score from benchmark_companies where roi_eps is null or roi_eps < (select roi_eps from input_data_2))   " +
        "  SELECT roi_eps.score roi_eps, g_m.score gross_margins, r_g.score revenue_growth, max_score.score max_score, (roi_eps.score::float+ g_m.score + r_g.score+1.5)*100/(max_score.score*3) percentile from roi_eps_score roi_eps, gross_margins_score g_m , revenue_growth_score r_g , maximum_score max_score   "
    , [ticker, sector, industrya, revenue_low, revenue_high, gross_margins, revenue_growth, roi], (err, result) => {
        if(err){
            console.log(err);
            callback({"roi_eps":"0","gross_margins":"0","revenue_growth":"0","max_score":"0","percentile":0});
        }else{
            // console.log(result.rows[0]);
            callback(result.rows[0]);
        }
    });
}

const compensationSql1 =
        "   with input_data_1 as (select $8::real total_pay, $6 titl, $7::integer[] func, $2 sector, $3::character varying[] industry, $4::real revenue_low, $5::real revenue_high, $1 ticker)   " +
        "   , input_data_2 as (select distinct in1.titl::numeric, in1.func, in1.total_pay, COALESCE(fpc2.sector,in1.sector) sector, CASE when in1.industry is null and in1.sector is not null then (select array_agg(distinct industry) from finviz_plus_compensationv2 fpc22 where fpc22.sector=in1.sector) when in1.industry is null and in1.sector is not null then (select array_agg(distinct industry) from finviz_plus_compensationv2 fpc22 where fpc22.sector=in1.sector) when fpc2.industry is null then in1.industry else  (select array_agg(distinct industry) from finviz_plus_compensationv2 fpc22 where fpc22.sector=fpc2.sector) end industry, CASE when cys.total_revenue is null then in1.revenue_low else 0.5*cys.total_revenue end revenue_low, CASE when cys.total_revenue is null then in1.revenue_high else 2.0*cys.total_revenue end revenue_high  " +
        "       from input_data_1 in1 left outer join finviz_plus_compensationv2 fpc2 on fpc2.ticker=in1.ticker   " +
        "   	left outer join cron_yahoo_statistics cys on cys.ticker=in1.ticker)  /* select * from input_data_2  */ " +
        "   , benchmark_salaries as (select distinct CASE WHEN mc.titles_1 && jt.runtime THEN null ELSE mc.titles_1 END title_match_indicator, CASE WHEN jf.id=ANY(mc.functions_1) THEN null ELSE (select array_agg(job_function) from job_functions_v2 where id=ANY(mc.functions_1)) END func_match_indicator, mc.title, mc.titles_1, mc.functions_1, mc.total_pay, fpc2.ticker, fpc2.company_name,  mc.name,  cys.total_revenue, to_char(cys.total_revenue, '999,999,999,999,999') total_revenue_c, to_char(mc.total_pay, '999,999,999,999') total_pay_c " +
        "   	from finviz_plus_compensationv2 fpc2, input_data_2 in2, cron_yahoo_statistics cys, mstar_compensation mc, job_titles_v2 jt, job_functions_v2 jf " +
        "   	where fpc2.sector=in2.sector and fpc2.industry=ANY(in2.industry) and cys.ticker=fpc2.ticker  and mc.ticker=fpc2.ticker   " +
        "       and jt.id=in2.titl  and jf.id/100 = any(array(select a.b from unnest(in2.func) as a(b)))  and mc.titles_1 is not null  and mc.functions_1 is not null   " +
        "   	and cys.total_revenue between in2.revenue_low and in2.revenue_high) /* select * from benchmark_salaries order by total_revenue */  " ;

const getCompensationBenchmark = (ticker, sector, industry, revenue_low, revenue_high, titl, func, total_pay, callback) => {
    console.log("queryData for getCompensationBenchmark:: ticker=" + ticker + ",sector=" + sector +",industry=" + industry + ",revenue_low=" +revenue_low + ",revenue_high=" +revenue_high + ",titl=" +titl + ",func=" +func + ",total_pay=" + total_pay);
    var industrya = null;
    if(null != industry) industrya = industry.split(',');
    pool.query(compensationSql1 +
        "   select * from benchmark_salaries order by 1,2,3,4 "
    , [ticker, sector, industrya, revenue_low, revenue_high, titl, func, total_pay], (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result.rows);
            callback(result.rows);
        }
    });
}

const getCompensationPercentile = (ticker, sector, industry, revenue_low, revenue_high, titl, func, total_pay, callback) => {
    console.log("queryData for getCompensationPercentile:: ticker=" + ticker + ",sector=" + sector +",industry=" + industry + ",revenue_low=" +revenue_low + ",revenue_high=" +revenue_high + ",titl=" +titl + ",func=" +func + ",total_pay=" + total_pay);
    var industrya = null;
    if(null != industry) industrya = industry.split(',');
    pool.query(compensationSql1 +
        "   , salary_score as (select count(*) score from benchmark_salaries where ((title_match_indicator is null and func_match_indicator is null) and (total_pay is null or total_pay < (select total_pay+1 from input_data_2))))   " +
        "   , maximum_score as (select 1+count(*) score from benchmark_salaries where title_match_indicator is null and func_match_indicator is null)   " +
        "   SELECT salary.score salary, max_score.score max_score, (salary.score::float + 0.5)*100/(max_score.score) percentile from salary_score salary , maximum_score max_score   "
    , [ticker, sector, industrya, revenue_low, revenue_high, titl, func, total_pay], (err, result) => {
        if(err){
            console.log(err);
            callback({"salary":"0","max_score":"0","percentile":0});
        }else{
            // console.log(result.rows[0]);
            callback(result.rows[0]);
        }
    });
}


const getFunctionsForId = (id, callback) => {
    pool.query("  select runtime from job_functions_v2 where id=$1 "
    , [id], (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log("select runtime from job_functions_v2 returned =" + result.rows[0].runtime);
            callback(result.rows[0].runtime);
        }
    });
}


const getCompanyPercentileForTicker = (ticker, callback) => {
    getCompanyPercentile(ticker, null, null, null, null, null, null, null, function(doc) {
        callback(doc);
    });
}
const getCompanyPercentileForInput = (sector, industry, revenue_low, revenue_high, gross_margins, revenue_growth, roi, callback) => {
    getCompanyPercentile(null, sector, industry, revenue_low, revenue_high, gross_margins, revenue_growth, roi, function(doc) {
        callback(doc);
    });
}
const getCompensationPercentileForTicker = (ticker, titl, func, total_pay, callback) => {
    getFunctionsForId(func, function(f_runtimes){
        getCompensationPercentile(ticker, null, null, null, null, titl, f_runtimes, total_pay, function(doc) {
            callback(doc);
        });
    });
}
const getCompensationPercentileForInput = (sector, industry, revenue_low, revenue_high, titl, func, total_pay, callback) => {
    getFunctionsForId(func, function(f_runtimes){
        getCompensationPercentile(null, sector, industry, revenue_low, revenue_high, titl, f_runtimes, total_pay, function(doc) {
            callback(doc);
        });
    });
}
const getCompanyBenchmarkForTicker = (ticker, callback) => {
    getCompanyBenchmark(ticker, null, null, null, null, null, null, null, function(doc) {
        callback(doc);
    });
}
const getCompanyBenchmarkForInput = (sector, industry, revenue_low, revenue_high, gross_margins, revenue_growth, roi, callback) => {
    getCompanyBenchmark(null, sector, industry, revenue_low, revenue_high, gross_margins, revenue_growth, roi, function(doc) {
        callback(doc);
    });
}
const getCompensationBenchmarkForTicker = (ticker, titl, func, total_pay, callback) => {
    getFunctionsForId(func, function(f_runtimes){
        getCompensationBenchmark(ticker, null, null, null, null, titl, f_runtimes, total_pay, function(doc) {
            callback(doc);
        });
    });
}
const getCompensationBenchmarkForInput = (sector, industry, revenue_low, revenue_high, titl, func, total_pay, callback) => {
    getFunctionsForId(func, function(f_runtimes){
        getCompensationBenchmark(null, sector, industry, revenue_low, revenue_high, titl, f_runtimes, total_pay, function(doc) {
            callback(doc);
        });
    });
}

module.exports = {
    getCompensationBenchmarkForTicker,
    getCompensationBenchmarkForInput,
    getCompanyBenchmarkForTicker,
    getCompanyBenchmarkForInput,
    getCompensationPercentileForTicker,
    getCompensationPercentileForInput,
    getCompanyPercentileForTicker,
    getCompanyPercentileForInput,
    getAnyDistinctOrdered,
    getTickerForCron,
    getTickerForCron2,
    getTickerForCronMstar,
    insertYahooAssetprofileCompensation,
    insertMstarCompensation,
    getJsonbForMstarCompensation,
    updateFullTimeEmployeesForTicker,
    runQueryByString,
    insertYahooEarnings,
    setCheckedDateInStatus,
    setJsonbInStatus,
    setCheckedDateInStatus2,
    setJsonbInStatus2,
    setMStarId,
    getTest
}
