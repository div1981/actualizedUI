const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const useragent = require('express-useragent');
const pgquery = require('./db/pgquery');
const pgbequery = require('./db/pgbequery');
const cookieParser = require('cookie-parser');
const json2html = require('node-json2html');
const email = require('./email');
const dns = require('dns');
const dnsPromises = dns.promises;

const port = process.env.PORT || 8081;

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('cert/privkey.pem', 'utf8');
var certificate = fs.readFileSync('cert/fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);


const cookieValue = process.env.cookieValue || '26r6229';
const adminCookieValue = process.env.cookieValue || 'admin1123';

const adminUserName = process.env.userName || 'admin';
const adminPassword = process.env.password || 'admin';


app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());

app.use(useragent.express());

app.get('/', function(req, res) {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/logReport', function(req, res) {
    let data = req.query.value;
    let ipaddress = req.ip;
    let uuidVal = req.cookies.uuid;
    console.log("uuidVal = ", uuidVal);
    console.log("data = ", data);
    console.log("ipaddress = ", ipaddress);
    let userAgent = req.useragent.isMobile ? 'Mobile' : 'Desktop';
    getHostname(ipaddress).then((hostname) => {
        console.log("hostname = ", hostname);
        pgquery.insertLogReport(ipaddress, uuidVal, data, userAgent, hostname, function(doc) {});
    });
    

    res.status(200).send("Success");
});

app.get('/addJob', function(req, res) {
    pgquery.insertJobOpenings(req, function(doc) {});
    res.status(200).send("Success");
});

app.get('/getJob', function(req, res) {
    pgquery.getJobOpenings(function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/monitor', function(req, res) {
    let cookieVal = req.cookies.cookieCode;
    let ipaddress = req.ip;
    
    console.log("cookieVal = ", cookieVal);
    console.log("ipaddress = ", ipaddress);
    let userAgent = req.useragent.isMobile ? 'Mobile' : 'Desktop';
    getHostname(ipaddress).then((hostname) => {
        console.log("hostname = ", hostname);
        pgquery.insertAuditReport(ipaddress, cookieVal, userAgent, hostname, function(doc) {});
    });
    res.status(200).send("Success");
});

app.get('/live/:uuid', function(req, res) {
    pgquery.getUUID(req.params.uuid, function(doc) {
        if(doc){
            if(doc.profileid){
                let userAgent = req.useragent.isMobile ? 'Mobile' : 'Desktop';
                getHostname(req.ip).then((hostname) => {
                    console.log("hostname = ", hostname);
                    pgquery.insertAuditReport( req.ip, req.params.uuid, userAgent , hostname, function(doc) {});
                });
                
                //res.sendFile(path.join(__dirname, 'public/display.html'));
                res.cookie('uuid', req.params.uuid);
                res.redirect('/display.html');
            }else{
                res.status(200).send("<h1>Invalid URL </h1>");
            }
        }else{
            res.status(200).send("<h1>Invalid URL </h1>");
        }
    });
});

app.get('/job/:uuid', function(req, res) {
    let userAgent = req.useragent.isMobile ? 'Mobile' : 'Desktop';
    getHostname(req.ip).then((hostname) => {
        console.log("hostname = ", hostname);
        pgquery.insertJobReport( req.ip, req.params.uuid, userAgent , hostname, function(doc) {});
    });
    res.cookie('job_uuid', req.params.uuid);
    res.redirect('/job.html');
    
});

app.get('/load', function(req, res) {
    let code = req.query.code;
    console.log(code);
    let cookieVal = req.cookies.cookieCode;
    console.log(cookieVal);
    if(cookieVal != null && cookieVal ==  cookieValue){
        res.sendFile(path.join(__dirname, 'public/display.html'));
    }else if(code != null){
        pgquery.getActivateCode(code, function(doc) {
            if(doc){
                if(doc.profileid){
                    res.cookie("cookieCode", cookieValue);
                    if(doc.profileid == 'admin'){
                        res.cookie("userrole", doc.profileid);
                    }
                    if(doc.ticker){
                      let val = doc.ticker + ':' + doc.sector + ":" + doc.industry;
                      res.cookie("tickerCode", val);
                    }
                    res.status(200).send("Success");
                }else{
                    res.status(200).send("Error in retrieving data");
                }
            }else{
                res.status(200).send("Error in retrieving data");
            }
        });
    }else{
        res.sendFile(path.join(__dirname, 'public/login.html'));
    }
    
});

app.get('/admin', function(req, res) {
    let userName = req.query.username;
    let password = req.query.password;
    console.log(userName);
    let cookieVal = req.cookies.adminCookie;
    console.log(cookieVal);
    if(cookieVal != null && cookieVal ==  adminCookieValue){
        res.sendFile(path.join(__dirname, 'public/userdata.html'));
    }else if(userName != null && password != null){ 
        if(userName == adminUserName && password == adminPassword){
            res.cookie("adminCookie", adminCookieValue);
            console.log("coming fro success");
            res.status(200).send("Success");
        }else{
            res.status(200).send("Error in retrieving data");
        }
    }else{
        res.sendFile(path.join(__dirname, 'public/admin.html'));
    }
    
});

app.get('/getClickReport', function(req, res) {
    pgquery.getClickReport(function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});


app.get('/getJobReport', function(req, res) {
    pgquery.getJobReport(function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/generateReport', function(req, res) {
    let stDate = req.query.stDate;
    let endDate = req.query.endDate;
    let uuid = req.query.uuid;
    let ipaddress = req.query.ipaddress;
    pgquery.getAuditReport(stDate, endDate, uuid, ipaddress , function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/generateJobReport', function(req, res) {
    pgquery.getJobAuditReport(function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/generateEmailReport', function(req, res) {
    pgquery.getJobEmailReport(function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/sendEmail', function(req, res) {
    email.sendEmail(req.query.email);
    pgquery.insertEmail(req.query.email, function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});


app.get('/sendJobEmail', function(req, res) {
    let userAgent = req.useragent.isMobile ? 'Mobile' : 'Desktop';
    pgquery.insertJobEmail(req, req.ip, userAgent, function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/getProfile', function(req, res) {
    let name = req.query.name;
    let email = req.query.email;
    pgquery.getProfile(name, email, function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/getAllTicker', function(req, res) {
    pgquery.getAllTicker(function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/getSector', function(req, res) {
    pgquery.getSector(function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/getIndustry', function(req, res) {
    pgquery.getIndustry(req.query.sector, function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/getJobFunction', function(req, res) {
    pgquery.getJobFunction(function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/getJobTitle', function(req, res) {
    pgquery.getJobTitle(function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/getRevenueRange', function(req, res) {
    pgquery.getRevenueRange(req.query.sector, req.query.industry, function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

app.get('/getcompensationPercentile', function(req, res) {
    pgquery.getcompensationPercentile(req.query.sector, req.query.industry, req.query.compensation, function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send(null);
        }
    });
});

app.get('/getTickerVal', function(req, res) {
    pgquery.getTickerVal(req.query.ticker, function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send(null);
        }
    });
});


app.get('/getCompanyPercentileForTicker', function(req, res) {
    var ticker=null;
    console.log("received input = ");
    console.log(req.query);
    ticker = req.query.ticker;
    if((req.query.ticker == null) || (req.query.ticker === 'null')){
        res.status(200).json({"error":"No ticker."});
        return;
    }
    pgbequery.getCompanyPercentileForTicker(ticker, function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });

});

app.get('/getCompanyPercentileForInput', function(req, res) {
    var sector=null, industry=null, total_revenue=null, gross_margins=null, revenue_growth=null, roi=null;
    console.log("received input = ");
    console.log(req.query);
    sector=req.query.sector;
    industry=req.query.industry;
    total_revenue=req.query.total_revenue;
    gross_margins=req.query.gross_margins;
    revenue_growth=req.query.revenue_growth;
    roi=req.query.roi;
    if ((sector==null) || (industry==null) || (total_revenue==null) || (gross_margins==null) || (revenue_growth==null) || (roi==null)){
        res.status(200).json({"error":"One of the 6 is null"});
        return;
    }
    pgbequery.getCompanyPercentileForInput(sector, industry, total_revenue, gross_margins, revenue_growth, roi, function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });

});


app.get('/getCompensationPercentileForTicker', function(req, res) {
    var ticker=null, titl=null, func=null, total_pay=null;
    console.log("received input = ");
    console.log(req.query);
    ticker = req.query.ticker;
    titl = req.query.titl;
    func = req.query.func;
    total_pay = req.query.total_pay;

    if((titl == null) || (func == null)  || (total_pay == null) ){
        res.status(200).json({"error":"titl, func, total_pay is mandatory"});
        return;
    }
    if((req.query.ticker == null) || (req.query.ticker === 'null')){
        res.status(200).json({"error":"No ticker."});
        return;
    }
    pgbequery.getCompensationPercentileForTicker(ticker, titl, func, total_pay, function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });

});

app.get('/getCompensationPercentileForInput', function(req, res) {
    var sector=null, industry=null, total_revenue=null, titl=null, func=null, total_pay=null;
    console.log("received input = ");
    console.log(req.query);
    titl = req.query.titl;
    func = req.query.func;
    total_pay = req.query.total_pay;

    if((titl == null) || (func == null)  || (total_pay == null) ){
        res.status(200).json({"error":"titl, func, total_pay is mandatory"});
        return;
    }
    sector=req.query.sector;
    industry=req.query.industry;
    total_revenue=req.query.total_revenue;
    if ((sector==null) || (industry==null) || (total_revenue==null) ){
        res.status(200).json({"error":"One of the (sector, industry, total_revenue) is null"});
        return;
    }
    pgbequery.getCompensationPercentileForInput(sector, industry, total_revenue, titl, func, total_pay, function(doc) {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

let company_table_header = {
    "<>": "tr", "html": [
        {"<>": "th", "html": "ticker"},
        {"<>": "th", "html": "total_revenue"},
        {"<>": "th", "html": "revenue_growth"},
        {"<>": "th", "html": "gross_margins"},
        {"<>": "th", "html": "roi"},
        {"<>": "th", "html": "eps"},
        {"<>": "th", "html": "company_name"}
    ]
}

let company_table_body = {
    "<>": "tr", "html": [
        {"<>": "td", "html": "${ticker}"},
        {"<>": "td", "html": "${total_revenue_c}"},
        {"<>": "td", "html": "${revenue_growth_c}"},
        {"<>": "td", "html": "${gross_margins_c}"},
        {"<>": "td", "html": "${roi_c}"},
        {"<>": "td", "html": "${eps_c}"},
        {"<>": "td", "html": "${company_name}"}
    ]
}


let compensation_table_header = {
    "<>": "tr", "html": [
        {"<>": "th", "html": "ticker"},
        {"<>": "th", "html": "total_revenue"},
        {"<>": "th", "html": "total_pay"},
        {"<>": "th", "html": "name"},
        {"<>": "th", "html": "title"},
        {"<>": "th", "html": "company_name"}
    ]
}
let compensation_table_body = {
    "<>": "tr", "html": [
        {"<>": "td", "html": "${ticker}"},
        {"<>": "td", "html": "${total_revenue_c}"},
        {"<>": "td", "html": "${total_pay_c}"},
        {"<>": "td", "html": "${name}"},
        {"<>": "td", "html": "${title}"},
        {"<>": "td", "html": "${company_name}"}
    ]
}


function sendHtmlForCompany(res, data){
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(
        "<html><body><table border=1>" + json2html.render(data[0],company_table_header) + json2html.render(data,company_table_body) + "</table></body></html>"
    );
    res.end();
}
function sendHtmlForCompensation(res, data){
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(
        "<html><body><table border=1>" + json2html.render(data[0],compensation_table_header) + json2html.render(data,compensation_table_body) + "</table></body></html>"
    );
    res.end();
}

app.get('/getCompanyBenchmarkForTicker', function(req, res) {
    var ticker=null;
    console.log("received input = ");
    console.log(req.query);
    ticker = req.query.ticker;
    if((req.query.ticker == null) || (req.query.ticker === 'null')){
        res.status(200).json({"error":"No ticker."});
        return;
    }
    pgbequery.getCompanyBenchmarkForTicker(ticker, function(doc) {
        if(doc){
            //res.status(200).json(doc);
            sendHtmlForCompany(res, doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });

});

app.get('/getCompanyBenchmarkForInput', function(req, res) {
    var sector=null, industry=null, total_revenue=null, gross_margins=null, revenue_growth=null, roi=null;
    console.log("received input = ");
    console.log(req.query);
    sector=req.query.sector;
    industry=req.query.industry;
    total_revenue=req.query.total_revenue;
    gross_margins=req.query.gross_margins;
    revenue_growth=req.query.revenue_growth;
    roi=req.query.roi;
    if ((sector==null) || (industry==null) || (total_revenue==null) || (gross_margins==null) || (revenue_growth==null) || (roi==null)){
        res.status(200).json({"error":"One of the 6 is null"});
        return;
    }
    pgbequery.getCompanyBenchmarkForInput(sector, industry, total_revenue, gross_margins, revenue_growth, roi, function(doc) {
        if(doc){
            // res.status(200).json(doc);
            sendHtmlForCompany(res, doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });

});


app.get('/getCompensationBenchmarkForTicker', function(req, res) {
    var ticker=null, titl=null, func=null, total_pay=null;
    console.log("received input = ");
    console.log(req.query);
    ticker = req.query.ticker;
    titl = req.query.titl;
    func = req.query.func;
    total_pay = req.query.total_pay;

    if((titl == null) || (func == null)  || (total_pay == null) ){
        res.status(200).json({"error":"titl, func, total_pay is mandatory"});
        return;
    }
    if((req.query.ticker == null) || (req.query.ticker === 'null')){
        res.status(200).json({"error":"No ticker."});
        return;
    }
    pgbequery.getCompensationBenchmarkForTicker(ticker, titl, func, total_pay, function(doc) {
        if(doc){
            // res.status(200).json(doc);
            sendHtmlForCompensation(res, doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });

});

app.get('/getCompensationBenchmarkForInput', function(req, res) {
    var sector=null, industry=null, total_revenue=null, titl=null, func=null, total_pay=null;
    console.log("received input = ");
    console.log(req.query);
    titl = req.query.titl;
    func = req.query.func;
    total_pay = req.query.total_pay;

    if((titl == null) || (func == null)  || (total_pay == null) ){
        res.status(200).json({"error":"titl, func, total_pay is mandatory"});
        return;
    }
    sector=req.query.sector;
    industry=req.query.industry;
    total_revenue=req.query.total_revenue;
    if ((sector==null) || (industry==null) || (total_revenue==null) ){
        res.status(200).json({"error":"One of the (sector, industry, total_revenue) is null"});
        return;
    }
    pgbequery.getCompensationBenchmarkForInput(sector, industry, total_revenue, titl, func, total_pay, function(doc) {
        if(doc){
            // res.status(200).json(doc);
            sendHtmlForCompensation(res, doc);
        }else{
            res.status(200).send("Error in retrieving data");
        }
    });
});

async function getHostname(ipaddress){
   if(ipaddress){
      let ip = ipaddress.substring(7);
      console.log("ip = ", ip);
      const hostname = await dnsPromises.reverse(ip);
      console.log("testing = ", JSON.stringify(hostname));
      return hostname;
   }
   return null;
}


httpServer.listen(8080);
httpsServer.listen(8081);
//app.listen(port);
console.log('Server started at http://localhost:' + port);