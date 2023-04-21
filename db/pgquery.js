const pg = require('pg');
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db2',
    password: '3azyPizyGBw1nAl',
    port: '5432'
});

/*const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: '5432'
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
    pool.query("select distinct sector from finviz_fundamentals order by sector" , (err, result) => {
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
    pool.query("select distinct industry from  finviz_fundamentals where sector = $1 order by industry" , [sector] , (err, result) => {
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

const getUUID = (uuid, callback) => {
    pool.query("select * from  profile where uuid = $1" , [uuid] , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows[0]);
            callback(result.rows[0]);
        }
    });
}

const getAllTicker = (callback) => {
    pool.query("select distinct(ticker) from cron_yahoo_statistics", (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows);
            callback(result.rows);
        }
    });
}



const getProfile = (name, email, callback) => {
    let query;
    console.log(name);
    console.log(email);
    if(name){
       query = "select * from  profile where profileid like '%" + name + "%'";
    }else if(email){
        query = "select * from  profile where email like '%" + email + "%'";
     } 
     console.log(query);
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows);
            callback(result.rows);
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


const insertEmail = (email, callback) => {
    let profileid = email.split('@')[0];
    let query = "INSERT INTO profile (profileid, email) SELECT '" +  profileid + "' , '" + email + "' WHERE NOT EXISTS (SELECT email FROM profile WHERE email = '" + email + "')";
    console.log(query);
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result);
            callback(result);
        }
    });
}

const getJobFunction = (callback) => {
    pool.query("select * from job_functions_v2 order by id" , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows);
            callback(result.rows);
        }
    });
}

const getJobTitle = (callback) => {
    pool.query("select * from job_titles_v2 order by job_title" , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows);
            callback(result.rows);
        }
    });
}

const insertAuditReport = (ipaddress, code, userAgent, hostname, callback) => {
    let query = "insert into  audit_report (ipaddress, email, insertdate, useragent, hostname)  values ('" + ipaddress + "', '" +
                  code  + "', current_timestamp , '" + userAgent + "' , '" + hostname + "');";
    console.log("insertAuditReport " + query);
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result);
            callback(result);
        }
    });
}

const insertLogReport = (ipaddress, uuid, data, userAgent, hostname, callback) => {
    let query = "insert into  audit_report (ipaddress, email, query, insertdate, useragent, hostname)  values ('" + ipaddress + "', '" +
             uuid + "', " +  (data != null ? "'" + data + "'" : null ) + ", current_timestamp, '" + userAgent  + "', '" + hostname  + "');";
    console.log("insertAuditReport " + query);
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result);
            callback(result);
        }
    });
}

const insertJobReport = (ipaddress, uuid, userAgent, hostname, callback) => {
    let query = "insert into  audit_job_report (ipaddress, uuid, insertdate, useragent, hostname)  values ('" + ipaddress + "', '" +
             uuid + "', current_timestamp, '" + userAgent  + "', '" + hostname  + "');";
    console.log("insertJobReport " + query);
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result);
            callback(result);
        }
    });
}

const getClickReport = (callback) => {
    let query = "with result as (select distinct ipaddress from audit_report where email = '50419a2b-6b31-5f01-8057-1b6bb9f42d44')," +
            "result1 as (select distinct ipaddress from audit_report where email = '50419a2b-6b31-5f01-8057-1b6bb9f42d44' and query is not null)," +
            "result2 as (select distinct ipaddress from audit_report where insertdate > '2022-11-03 12:00:00' and (email = 'undefined' or email IS NULL))," +
            "result3 as (select distinct ipaddress from audit_report where insertdate > '2022-11-03 12:00:00' and (email = 'undefined' or email IS NULL) and query is not null) " +
            "select (select count(*) from result) as clicked, (select count(*) from result1) as checked, " +
            "(select count(*) from result2) as ipclicked, (select count(*) from result3) as ipchecked";
    console.log("getClickReport " + query);
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            callback(result.rows[0]);
        }
    });
}

const getJobReport = (callback) => {
    let query = "with result as (select uuid, ipaddress, count(*) as count from audit_job_report group by uuid, ipaddress)" +
                    "select uuid, count(*) as count from result group by uuid";
    console.log("getJobReport " + query);
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            callback(result.rows);
        }
    });
}


const getAuditReport = (stDate, endDate, uuid, ipaddress, callback) => {
    let query = "with result as (select insertdate, ipaddress, email as uuid, hostname, query as data, useragent from audit_report where ipaddress like '%.%' " +
                   "union select insertdate, null as ipaddress, ipaddress as uuid, hostname, query as data, useragent from audit_report where ipaddress not like '%.%')" +
                    "select * from result";
    let isWhereadded = false;
    if(stDate && endDate){
        query += " where insertdate between '" + stDate + "' and '" + endDate + "'";
        isWhereadded = true;
    }
    if(uuid){
        if(isWhereadded){
            query += " and uuid like '%" + uuid + "%'";
        }else{
            query += " where uuid like '%" + uuid + "%'";
            isWhereadded = true;
        }
    }
    if(ipaddress){
        if(isWhereadded){
            query += " and ipaddress like '%" + ipaddress + "%'";
        }else{
            query += " where ipaddress like '%" + ipaddress + "%'";
            isWhereadded = true;
        }
    }
    query += " order by insertdate desc;";
    console.log("insertAuditReport " + query);
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result);
            callback(result.rows);
        }
    });
}

const insertJobOpenings = (req,  callback) => {
    let ticker = req.query.ticker;
    let jobFunc = req.query.jobFunc;
    let jobTitle = req.query.jobTitle;
    let title = req.query.title;
    let name = req.query.name;
    let published = req.query.published;
    let notes = (req.query.notes == null) ? '' : req.query.notes;
    let salary = (req.query.salary == null) ? '' : req.query.salary;
    let query = "insert into  job_openings (ticker,function,title,jobname, name, publisheddate,notes, salary)  values ('" + ticker.toUpperCase() + "'," +
                jobFunc + "," + jobTitle + ", '" +  title + "', '" + name + "', '" + published + "', '" + notes  + "', '" +  salary + "');";
    console.log("insertJob " + query);
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result);
            callback(result);
        }
    });
}

const getJobAuditReport = (callback) => {
    let query = 'select * from audit_job_report order by insertdate desc';
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows);
            callback(result.rows);
        }
    });
}


const getJobEmailReport = (callback) => {
    let query = 'select * from job_profile_data order by insertdate desc';
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows);
            callback(result.rows);
        }
    });
}

const getJobOpenings = (callback) => {
    let query = 'select job.*, func.job_function, cus.company_name, cus.sector, cus.industry from job_openings job, finviz_custominfo cus, job_functions_v2 func where job.ticker = cus.ticker and job.function = func.id order by job.publisheddate desc';
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            console.log(result.rows);
            callback(result.rows);
        }
    });
}

const insertJobEmail = (req,  ipaddress, useragent , callback) => {
    let email = req.query.email;
    let job_id = (req.query.job_id == null) ? 0 : req.query.job_id;
    let linkedin = (req.query.linkedin == null) ? '' : req.query.linkedin;
    let query = "insert into  job_profile_data (email,linkedin,insertdate,job_id,ipaddress,useragent)  values ('" + email + "','" + linkedin + 
                    "', current_timestamp , " + job_id + ", '" + ipaddress + "','" +  useragent + "');";
    console.log("insertJobEmail " + query);
    pool.query(query , (err, result) => {
        if(err){
            console.log(err);
            callback(null);
        }else{
            //console.log(result);
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
    insertEmail,
    getJobFunction,
    getJobTitle,
    getProfile,
    insertAuditReport,
    getUUID,
    insertLogReport,
    getAllTicker,
    getAuditReport,
    getClickReport,
    insertJobOpenings,
    getJobOpenings,
    insertJobEmail,
    insertJobReport,
    getJobAuditReport,
    getJobReport,
    getJobEmailReport
}
