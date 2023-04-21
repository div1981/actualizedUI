let options = {
    colorStart: "#6fadcf",
    colorStop: void 0,
    gradientType: 0,
    strokeColor: "#e0e0e0",
    generateGradient: true,
    percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],
    pointer: {
      length: 0.35,
      strokeWidth: 0.035,
      iconScale: 1.0,
      color : "#CE2C1E"
    },
    staticLabels: {
      font: "14px sans-serif",
      labels: [1],
      customlabels: ["Yes"],
      fractionDigits: 0
    },
    staticZones: [
      {strokeStyle: "#3F6FDD", min: 0, max: 40},
      {strokeStyle: "#F3F5FC", min: 40, max: 80}
    ],
    angle: 0,
    lineWidth: 0.3,
    radiusScale: 1.0,
    fontSize: 40,
    limitMax: false,
    limitMin: false,
    highDpiSupport: true
};

var gauge1;
var gauge2;
var gauge3;
var gauge4;


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}



$( document ).ready(function() {
    $("#benchmark").hide();
    $("#panel1").hide();
    $("#panel2").hide();
    $("#panel3").hide();
    $("#panel4").hide();

    $("#whatifSec").hide();
    $("#publicSecBottom").hide();
    $("#whatifSecBottom").hide();
    
    
    

    let role = getCookie("userrole");

    if(role.trim() == 'admin'){
       $("#benchmark").show();
       $("#panel1").show();
       $("#panel2").show();
       $("#panel3").show();
       $("#panel4").show();
    }
   
    $.ajax({
        url: "/monitor",
        success: function(result){
            console.log(result);
        }
    });
    var q1 = document.getElementById('q1'); 
    var q2 = document.getElementById('q2'); 
    var q3 = document.getElementById('q3'); 
    var q4 = document.getElementById('q4'); 
    //gauge1 = new Gauge(q1).setOptions(options);
    //gauge2 = new Gauge(q2).setOptions(options);
    //options.staticLabels.customlabels =  ["Yes"];
    //gauge3 = new Gauge(q3).setOptions(options);
    //options.staticLabels.customlabels =  ["Yes"];
    //gauge4 = new Gauge(q4).setOptions(options);

    // $("#rcbrand-example").rcbrand({
    //     visibleItems: 4,
    //     infinite:false

    // });


    let coptions = {
        colorStart: "#6fadcf",
        colorStop: void 0,
        gradientType: 0,
        strokeColor: "#e0e0e0",
        generateGradient: true,
        pointer: {
          length: 0.35,
          strokeWidth: 0.035,
          iconScale: 1.0,
          color : "#CE2C1E"
        },
        staticZones: [
          {strokeStyle: "#3F6FDD", min: 0, max: 40},
          {strokeStyle: "#F3F5FC", min: 40, max: 80}
        ],
        angle: 0,
        lineWidth: 0.3,
        radiusScale: 1.0,
        fontSize: 40,
        limitMax: false,
        limitMin: false,
        highDpiSupport: true
    };

    /*var c1 = document.getElementById('c1'); 
    var c2 = document.getElementById('c2'); 
    var c3 = document.getElementById('c3'); 
    var c4 = document.getElementById('c4'); */
    var c5 = document.getElementById('c5'); 
    var c6 = document.getElementById('c6'); 
    var c7 = document.getElementById('c7'); 
    var c8 = document.getElementById('c8'); 
    var c9 = document.getElementById('c9'); 
    var c10 = document.getElementById('c10'); 
    var c11= document.getElementById('c11'); 
    var c12 = document.getElementById('c12'); 

    
   /* new Gauge(c1).setOptions(coptions);
    new Gauge(c2).setOptions(coptions);
    new Gauge(c3).setOptions(coptions);
    new Gauge(c4).setOptions(coptions);*/
    new Gauge(c5).setOptions(coptions);
    new Gauge(c6).setOptions(coptions);
    new Gauge(c7).setOptions(coptions);
    new Gauge(c8).setOptions(coptions);
    new Gauge(c9).setOptions(coptions);
    new Gauge(c10).setOptions(coptions);
    new Gauge(c11).setOptions(coptions);
    new Gauge(c12).setOptions(coptions);

    
    $("#comingsoon").hide();
    console.log(document.cookie)
    let emailaddr = getCookie("email");
    console.log(emailaddr)
    if(emailaddr){
        $("#canvasDiv").show();
        $("#revealDiv").hide();
    }else{
        $("#canvasDiv").hide();
        $("#revealDiv").show();
    }
    
    

    $("#loading").show();
    $("#marketcapslider").slider();
    $("#pmslider").slider();
    $("#gmslider").slider();
    $("#roislider").slider();
    $("#epsslider").slider();
    $("#salesslider").slider();


    $("#whatifannualRevenue").slider({
        min: 50,
        max: 200000,
        step: 1,
        range:true,
        //tooltip : 'always',
        //tooltip_split : true,
        scale : 'logarithmic',
        formatter:function formatter(val) {
            //return calculateDenom(val);
            if(Array.isArray(val)){
                var arr = [];
                arr.push(calculateDenom(val[0], 'floor'));
                arr.push(calculateDenom(val[1], 'floor'));
                return arr;
            } 
            
        }
    });
    $('#whatifannualRevenue').slider('setValue' , [53, 80000]);
    
    var cookieVal = getCookie("tickerCode");
    if(cookieVal != null && cookieVal != ''){
        var tickerVal = cookieVal.split(':')[0];
        if(tickerVal != null && tickerVal != ''){
            $("#ticker").val(tickerVal);
        }
    }
    $.ajax({
        url: "/getSector", 
        success: function(result){
            let arr = getArray(result);
            
            var sectorSelect = $("#sector");
            var wahtifsectorSelect = $("#whatifsector");
            $.each(arr, function(index, item) {
                sectorSelect.append(new Option(item, item));
                wahtifsectorSelect.append(new Option(item, item));
            });
            if(cookieVal != null && cookieVal != ''){
                var sectorVal = cookieVal.split(':')[1];
                if(sectorVal != null && sectorVal != ''){
                    $("#sector").val(sectorVal);
                }
            }
            loadIndustry(cookieVal);
            $("#loading").hide();
        }
    });

    $.ajax({
        url: "/getJobFunction", 
        success: function(result){
            let obj = getCustomizedArray(result);
            //console.log(obj);
            var jobFunctionTicker = $("#jobFunctionTicker");
            var jobFunction = $("#jobFunction");
            var whatifjobFunction = $("#whatifjobFunction");
            let html ="";
            for (const key of Object.keys(obj)) {
                let innerObj = obj[key];
                let title = innerObj.title;
                let list = innerObj.list;
                html +=  '<option style="font-weight:bold;" value="'+ (key * 100) + '">' + title +  '</option>';
                $.each(list, function(index, item) {
                    console.log(item); 
                    html +=  '<option disabled value="'+ item.id + '">&nbsp;&nbsp;&nbsp;&nbsp;' + item.job_function +  '</option>';
                });
                html += '</optgroup>';
                
            }
            jobFunctionTicker.append(html);
            jobFunction.append(html);
            whatifjobFunction.append(html);
        }
    });

    $.ajax({
        url: "/getJobTitle", 
        success: function(result){
            //console.log(result);
            var jobTitleTicker = $("#jobTitleTicker");
            var jobTitle = $("#jobTitle");
            var whatifjobTitle = $("#whatifjobTitle");
            $.each(result, function(index, item) {
                //console.log(item);
                jobTitleTicker.append(new Option(item.job_title, item.id));
                jobTitle.append(new Option(item.job_title, item.id));
                whatifjobTitle.append(new Option(item.job_title, item.id));
            });
        }
    });

   

    
    //$("#result").hide();
});

function myValueFormat(value, digits) {
  alert("coming hete");
}

function toggle(){
    $("#comingsoon").toggle();
}

function displayCanvas(){
    let email = $("#revealEmail").val();
    var mail_format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valid = email.match(mail_format); 
    console.log("valid = " , valid);
    if(valid){
        $("#canvasDiv").show();
        $("#revealDiv").hide();
        document.cookie = "email=" + email;

    }else{
        alert("Please enter a valid email address");
    }
}

function showSec(elem){
   var val = $(elem).val();
   if(val == 'yes' || val == 'no'){
     $("#whatifSec").hide();
     $("#publicSec").show();
     $("#publicSecBottom").hide();
     $("#whatifSecBottom").show();
   }else{
     $("#whatifSec").show();
     $("#publicSec").hide();
     $("#publicSecBottom").show();
     $("#whatifSecBottom").hide();
   }

   $("input[name=notPublicly][value='" + val + "']").prop("checked",true); 
   showTicker();
   $(window).scrollTop(100);
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function loadIndustry(cookieVal,callback){
    let val = $("#whatifsector").val();
    console.log(val);
    $("#loading").show();
    $.ajax({
        url: "/getIndustry?sector=" + val, 
        success: function(result){
            let arr = getArray(result);
            var industrySelect = $("#whatifindustry");
            industrySelect.empty();
            $.each(arr, function(index, item) {
                industrySelect.append(new Option(item, item));
            });
            if(cookieVal != null && cookieVal != ''){
                var industryVal = cookieVal.split(':')[2];
                if(industryVal != null && industryVal != ''){
                    //$("#industry").val(industryVal);
                }
            }
            //loadRange(callback);
            $("#loading").hide();
        }
    });
}

function loadRange(callback){
    let sectorVal = $("#sector").val();
    let industryVal = $("#industry").val();
    console.log(sectorVal);
    console.log(industryVal);
    $("#loading").show();
    $.ajax({
        url: "/getRevenueRange?sector=" + encodeURIComponent(sectorVal) + "&industry=" +  encodeURIComponent(industryVal), 
        success: function(result){
            for(i in result){
                console.log(result[i]);
                let name = result[i].name;
                let min = result[i].min;
                let max = result[i].max;
                if(min && max){
                    if(name == 'marketcap'){
                        console.log(min);
                        console.log(max);
                        let mintext = calculateDenom(min, 'floor');
                        let maxtext = calculateDenom(max, 'floor');
                        $("#minRange" + name).html("<b>&nbsp;&nbsp;" + mintext + "&nbsp;&nbsp;</b>");
                        $("#maxRange" + name).html("<b>&nbsp;&nbsp;" + maxtext + "&nbsp;&nbsp;</b>");
                        $("#" + name + "slider").slider("disable");
                        $("#" + name + "slider").slider('destroy');
                        $("#" + name + "slider").slider({
                                min: min,
                                max: max,
                                step: 1,
                                range:true,
                                formatter:function formatter(val) {
                                    //return calculateDenom(val);
                                    if(Array.isArray(val)){
                                        var arr = [];
                                        arr.push(calculateDenom(val[0]));
                                        arr.push(calculateDenom(val[1]));
                                        return arr;
                                    } 
                                    
                                }
                        });
                    }else{
                        let mintext = min + '%';
                        let maxtext = max + '%';
                        $("#minRange" + name).html("<b>&nbsp;&nbsp;" + mintext + "&nbsp;&nbsp;</b>");
                        $("#maxRange" + name).html("<b>&nbsp;&nbsp;" + maxtext + "&nbsp;&nbsp;</b>");
                        $("#" + name + "slider").slider("disable");
                        $("#" + name + "slider").slider('destroy');
                        $("#" + name + "slider").slider({
                                min: min,
                                max: max,
                                step: 1,
                                range:true
                        });
                    }
                    
                }else{
                    $("#" + name + "slider").slider("disable");
                }

                if(callback){
                   callback();
                }
            }
            $("#loading").hide();
        }
    });
}

function getArray(result){
    let arr = [];
    result.forEach(function(item){
        for(key in item){
            arr.push(item[key]);
        }
    })
    return arr;
}

function getCustomizedArray(result){
    let obj ={};
    for(i in result){
        let vobj = result[i];
        let id = vobj.id;
        let titleId = parseInt(id / 100);
        let isTitle = (id % 100 == 0);
        if(isTitle){
           let innerObj = {};
           innerObj.title = vobj.job_function;
           let arr = [];
           innerObj.list = arr;
           obj[titleId] = innerObj;
        }else{
            let innerObj = obj[titleId];
            let arr = innerObj.list;
            arr.push(vobj);
        }
    }
    return obj;
}

function display(){
    var compensation;
    var title;
    var func;
    var companyPerUrl;
    var compensationPerUrl;
    var sectorVal = $("#sector").val();
    var industryVal = 'abc';
    var radioval = $("input[name='notPublicly']:checked").val();
    if(!$("#publicSecBottom").is(":visible")){
       $("#whatifSecBottom").show();
    }
    if (radioval == 'no'){
        compensation = $("#compensation").val();
        var annualRevenue = $("#annualRevenue").val();
        var growth = $("#growth").val();
        var grossMargin = $("#grossMargin").val();
        var roi = $("#roi").val();
        if(!annualRevenue || annualRevenue == ''){
            alert("Please Enter the Annual Revenue ");
            return;
        }
        if(!growth || growth == ''){
            alert("Please Enter the Annula Growth ");
            return;
        }
        if(!grossMargin || grossMargin == ''){
            alert("Please Enter the Gross Margin");
            return;
        }
        if(!roi || roi == ''){
            alert("Please Enter the ROI ");
            return;
        }
        title = $("#jobTitle").val();
        func = $("#jobFunction").val();
        annualRevenue = annualRevenue * 1000000;
        try{
            growth = parseFloat(growth);
            grossMargin = parseFloat(grossMargin);
            roi = parseFloat(roi);
            if(isNaN(growth) || isNaN(grossMargin) || isNaN(roi) || growth > 1000 || grossMargin > 1000 || roi > 1000){
                alert("Please enter only number and less than 1000 for percentage fields");
                return;
            }
        }catch(err){
            alert("Please enter only number in all the fields");
        }
    }else if (radioval == 'what'){
        compensation = $("#whatifcompensation").val();
        var annualRevenue = $('#whatifannualRevenue').slider('getValue');
        var growth = $("#whatifgrowth").val();
        var grossMargin = $("#whatifgrossMargin").val();
        var roi = $("#whatifroi").val();
        if(!annualRevenue || annualRevenue == ''){
            alert("Please Enter the Annual Revenue ");
            return;
        }
        if(!growth || growth == ''){
            alert("Please Enter the Annula Growth ");
            return;
        }
        if(!grossMargin || grossMargin == ''){
            alert("Please Enter the Gross Margin");
            return;
        }
        if(!roi || roi == ''){
            alert("Please Enter the ROI ");
            return;
        }
        title = $("#whatifjobTitle").val();
        func = $("#whatifjobFunction").val();
        //annualRevenue = (annualRevenue[0] * 1000000) + ',' + (annualRevenue[1] * 1000000);
        console.log("annualRevenue = " , annualRevenue);
        sectorVal = $("#sector").val();
        if($("#whatifindustry").val().length == 0){
            alert("Please Select one or more Industry");
            return;
        }
        industryVal =  $("#whatifindustry").val().join(',');
        
        try{
            growth = parseFloat(growth);
            grossMargin = parseFloat(grossMargin);
            roi = parseFloat(roi);
            if(isNaN(growth) || isNaN(grossMargin) || isNaN(roi) || growth > 1000 || grossMargin > 1000 || roi > 1000){
                alert("Please enter only number and less than 1000 for percentage fields");
                return;
            }
        }catch(err){
            alert("Please enter only number in all the fields");
        }
    }else{
        compensation = $("#compensationTicker").val();
        var ticker = $("#ticker").val();
        if(!ticker || ticker == ''){
            alert("Please Enter the Ticker ");
            return;
        }
        ticker = ticker.toUpperCase();
        title = $("#jobTitleTicker").val();
        func = $("#jobFunctionTicker").val();
    }
    
    if(compensation){
        compensation = compensation.replace(/[^a-zA-Z0-9]/g, "");
    }
    if(!compensation || compensation == ''){
        alert("Please Enter the total compensation ");
        return;
    }
    compensation = compensation * 1000;
    //let hostname = location.protocol + "//" + location.hostname + ":9191";
    let hostname =  "https://" + location.hostname + ":9192";
    console.log(hostname);
    if (radioval == 'no'){
        companyPerUrl = hostname + "/getCompanyPercentileForInput?sector=" + encodeURIComponent(sectorVal)  + "&revenue_low=" +  (annualRevenue * 0.5)  + "&revenue_high=" +  (annualRevenue * 2) +
            "&gross_margins=" +  grossMargin + "&revenue_growth=" +  growth + "&roi=" +  roi;
        compensationPerUrl = hostname + "/getCompensationPercentileForInput?sector=" + encodeURIComponent(sectorVal) + "&revenue_low=" +  (annualRevenue * 0.5)  + "&revenue_high=" +  (annualRevenue * 2) +
            "&titl=" +  encodeURIComponent(title) + "&func=" +  encodeURIComponent(func) + "&total_pay=" +  compensation;
    }else if (radioval == 'what'){
        companyPerUrl = hostname + "/getCompanyPercentileForInput?sector=" + encodeURIComponent(sectorVal) + "&industry=" +  encodeURIComponent(industryVal) + "&revenue_low=" +  (annualRevenue[0] * 1000000)  + "&revenue_high=" +  (annualRevenue[1] * 1000000) +
            "&gross_margins=" +  grossMargin + "&revenue_growth=" +  growth + "&roi=" +  roi;
        compensationPerUrl = hostname + "/getCompensationPercentileForInput?sector=" + encodeURIComponent(sectorVal) + "&industry=" +  encodeURIComponent(industryVal) + "&revenue_low=" +  (annualRevenue[0] * 1000000)  + "&revenue_high=" +  (annualRevenue[1] * 1000000) +
            "&titl=" +  encodeURIComponent(title) + "&func=" +  encodeURIComponent(func) + "&total_pay=" +  compensation;
    }else{
        companyPerUrl = hostname + "/getCompanyPercentileForTicker?ticker=" + encodeURIComponent(ticker);
        compensationPerUrl = hostname + "/getCompensationPercentileForTicker?ticker=" + encodeURIComponent(ticker) +
            "&titl=" +  encodeURIComponent(title) + "&func=" +  encodeURIComponent(func) + "&total_pay=" +  compensation;
    }
    console.log("compensation = ", compensation);
    console.log("companyPerUrl = " + companyPerUrl);
    console.log("compensationPerUrl = " + compensationPerUrl);
    $("#loading").show();
    $.ajax({
        url: companyPerUrl,
        success: function(result){
            console.log(result);
            $.ajax({
                url: compensationPerUrl,
                success: function(resp){
                    console.log(resp);
                    $("#loading").hide();
                    $("#result").show();
                    var q1 = document.getElementById('q1'); 
                    options.staticZones = [
                        {strokeStyle: "#3F6FDD", min: 0, max: resp.percentile},
                        {strokeStyle: "#F3F5FC", min: resp.percentile, max: 100}
                    ];
                    options.staticLabels = {
                        font: "14px sans-serif",
                        labels: [1],
                        customlabels: ["Yes"],
                        fractionDigits: 0
                    };
                    // var gauge1 = new Gauge(q1).setOptions(options);
                       
                    // gauge1.maxValue = 100;
                    // gauge1.setMinValue(0); 
                    // gauge1.set(resp.percentile);
                    // gauge1.animationSpeed = 32;
                    let img1 = parseInt(resp.percentile/10);
                    console.log("img1 ", img1);
                    if(!isNaN(img1) && img1 <= 10){
                       $("#img1").attr("src", "images/dial/dial_" + img1 + ".png");
                    }
                    $('#panel1').html("Compensation Percentile: " + resp.percentile + " / " + resp.max_score); 
                
                    //var q2 = document.getElementById('q2'); 
                    options.staticZones = [
                        {strokeStyle: "#3F6FDD", min: 0, max: result.percentile},
                        {strokeStyle: "#F3F5FC", min: result.percentile, max: 100}
                    ];
                    options.staticLabels = {
                        font: "14px sans-serif",
                        labels: [1],
                        customlabels: ["Yes"],
                        fractionDigits: 0
                    };
                    //var g2 = new Gauge(q2).setOptions(options);
                    // gauge2.setOptions(options);
                    // gauge2.maxValue = 100;
                    // gauge2.setMinValue(0); 
                    // gauge2.set(result.percentile);
                    // gauge2.animationSpeed = 32;
                    let img2 = parseInt(result.percentile/10);
                    console.log("img2 ", img2);
                    if(!isNaN(img2) && img2 <= 10){
                       $("#img2").attr("src", "images/dial/dial_" + img2 + ".png");
                    }
                    
                    var companypercentile = result.percentile;
                    var compensationpercentile = resp.percentile;
                    var perf = parseFloat((compensationpercentile/companypercentile).toFixed(2));

                    $('#panel2').html("Company Percentile: " + result.percentile + " / " + result.max_score);

                    console.log("companypercentile = " , companypercentile);
                    console.log("compensationpercentile = " , compensationpercentile);
                    console.log("calculatedPercentile = " , perf);
                    //var q3 = document.getElementById('q3'); 
                    
                    options.staticLabels = {
                        font: "14px sans-serif",
                        labels: [1],
                        customlabels: ["Yes"],
                        fractionDigits: 0
                    };
                    //var gauge3 = new Gauge(q3).setOptions(options);
                    
                    console.log("perf ", perf);
                    
                    $("#lowPerf").removeClass("btn-active");
                    $("#middlePerf").removeClass("btn-active");
                    $("#highPerf").removeClass("btn-active");
                    if(perf < 0.70){
                        $("#lowPerf").addClass("btn-active");
                        options.staticZones = [
                            {strokeStyle: "#3F6FDD", min: 0, max: 30},
                            {strokeStyle: "#F3F5FC", min: 30, max: 100}
                        ];
                        // gauge3.setOptions(options);
                        // gauge3.maxValue = 100;
                        // gauge3.setMinValue(0); 
                        // gauge3.set(30);
                        // gauge3.animationSpeed = 32;
                        if(!isNaN(perf)){
                            $("#img3").attr("src", "images/dial/dial_3.png");
                        }
                    }else if(perf > 0.70 &&  perf < 1.10){
                        $("#middlePerf").addClass("btn-active");
                        options.staticZones = [
                            {strokeStyle: "#3F6FDD", min: 0, max: 60},
                            {strokeStyle: "#F3F5FC", min: 60, max: 100}
                        ];
                        // gauge3.setOptions(options);
                        // gauge3.maxValue = 100;
                        // gauge3.setMinValue(0); 
                        // gauge3.set(60);
                        // gauge3.animationSpeed = 32;
                        if(!isNaN(perf)){
                            $("#img3").attr("src", "images/dial/dial_6.png");
                        }
                    }else if(perf > 1.10){
                        $("#highPerf").addClass("btn-active");
                        options.staticZones = [
                            {strokeStyle: "#3F6FDD", min: 0, max: 90},
                            {strokeStyle: "#F3F5FC", min: 90, max: 100}
                        ];
                        // gauge3.setOptions(options);
                        // gauge3.maxValue = 100;
                        // gauge3.setMinValue(0); 
                        // gauge3.set(90);
                        // gauge3.animationSpeed = 32;
                        if(!isNaN(perf)){
                            $("#img3").attr("src", "images/dial/dial_9.png");
                        }
                    }
                    $('#panel3').html("calculatedPercentile : " + perf);
                    $("#lowattr").removeClass("btn-active");
                    $("#middleattr").removeClass("btn-active");
                    $("#highattr").removeClass("btn-active");

                    companypercentile = companypercentile/100;
                    let visible = 'yes';
                    if(!$("#canvasDiv").is(":visible")){
                        $("#canvasDiv").show();
                        visible = 'no';
                    } 

                    var q4 = document.getElementById('q4'); 
                    
                    
                    options.staticLabels = {
                        font: "14px sans-serif",
                        labels: [1],
                        customlabels: ["Yes"],
                        fractionDigits: 0
                    };
                    

                    /*if(perf < 0.90 && companypercentile > 0.60){
                        $("#lowattr").addClass("btn-active");
                        options.staticZones = [
                            {strokeStyle: "#3F6FDD", min: 0, max: 30},
                            {strokeStyle: "#F3F5FC", min: 30, max: 100}
                        ];
                        var gauge4 = new Gauge(q4).setOptions(options);
                        gauge4.maxValue = 100;
                        gauge4.setMinValue(0); 
                        gauge4.set(30);
                        gauge4.animationSpeed = 32;
                    }else if(perf > 0.90 &&  perf < 1.10 && companypercentile > 0.60){
                        $("#middleattr").addClass("btn-active");
                        options.staticZones = [
                            {strokeStyle: "#3F6FDD", min: 0, max: 60},
                            {strokeStyle: "#F3F5FC", min: 60, max: 100}
                        ];
                        var gauge4 = new Gauge(q4).setOptions(options);
                        gauge4.maxValue = 100;
                        gauge4.setMinValue(0); 
                        gauge4.set(60);
                        gauge4.animationSpeed = 32;
                    }else if((perf > 1.10 && companypercentile > 0.60) || (perf > 0.90 && companypercentile < 0.60) ||
                                (perf < 0.90 && companypercentile < 0.60)){
                        $("#highattr").addClass("btn-active");
                        options.staticZones = [
                            {strokeStyle: "#3F6FDD", min: 0, max: 90},
                            {strokeStyle: "#F3F5FC", min: 90, max: 100}
                        ];
                        var gauge4 = new Gauge(q4).setOptions(options);
                        gauge4.maxValue = 100;
                        gauge4.setMinValue(0); 
                        gauge4.set(90);
                        gauge4.animationSpeed = 32;
                    }*/

                    
                    if(perf < 0.90 && companypercentile > 0.60){
                        $("#highattr").addClass("btn-active");
                        options.staticZones = [
                            {strokeStyle: "#3F6FDD", min: 0, max: 90},
                            {strokeStyle: "#F3F5FC", min: 90, max: 100}
                        ];
                        // var gauge4 = new Gauge(q4).setOptions(options);
                        // gauge4.maxValue = 100;
                        // gauge4.setMinValue(0); 
                        // gauge4.set(90);
                        // gauge4.animationSpeed = 32;
                        if(!isNaN(perf)){
                            $("#img4").attr("src", "images/dial/dial_9.png");
                        }
                    }else if(perf > 0.90 &&  perf < 1.10 && companypercentile > 0.60){
                        $("#middleattr").addClass("btn-active");
                        options.staticZones = [
                            {strokeStyle: "#3F6FDD", min: 0, max: 60},
                            {strokeStyle: "#F3F5FC", min: 60, max: 100}
                        ];
                        // var gauge4 = new Gauge(q4).setOptions(options);
                        // gauge4.maxValue = 100;
                        // gauge4.setMinValue(0); 
                        // gauge4.set(60);
                        // gauge4.animationSpeed = 32;
                        if(!isNaN(perf)){
                            $("#img4").attr("src", "images/dial/dial_6.png");
                        }
                    }else {
                        $("#lowattr").addClass("btn-active");
                        options.staticZones = [
                            {strokeStyle: "#3F6FDD", min: 0, max: 30},
                            {strokeStyle: "#F3F5FC", min: 30, max: 100}
                        ];
                        // var gauge4 = new Gauge(q4).setOptions(options);
                        // gauge4.maxValue = 100;
                        // gauge4.setMinValue(0); 
                        // gauge4.set(30);
                        // gauge4.animationSpeed = 32;
                        if(!isNaN(perf)){
                            $("#img4").attr("src", "images/dial/dial_3.png");
                        }
                    }


                    if(visible == 'no'){
                        $("#canvasDiv").hide();
                    }
                    $('#panel4').html("calculatedPercentile : " + perf +  "   CompanyPercentaile : " + (companypercentile * 100));
                    //$(window).scrollTop($('#result').offset().top-200);
                }
            });
        }
    });
   
    /*var q3 = document.getElementById('q3'); 
    var gauge3 = new Gauge(q3).setOptions({
        colorStart: "#6fadcf",
        colorStop: void 0,
        gradientType: 0,
        strokeColor: "#e0e0e0",
        generateGradient: true,
        percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],
        pointer: {
          length: 0.65,
          strokeWidth: 0.035,
          iconScale: 1.0
        },
        staticLabels: {
          font: "14px sans-serif",
          labels: [6,94],
          customlabels: ["Below", "Above"],
          fractionDigits: 0
        },
        staticZones: [
          {strokeStyle: "#F03E3E", min: 0, max: 30},
          {strokeStyle: "#FFDD00", min: 30, max: 60},
          {strokeStyle: "#30B32D", min: 60, max: 100}
        ],
        angle: 0,
        lineWidth: 0.44,
        radiusScale: 1.0,
        fontSize: 40,
        limitMax: false,
        limitMin: false,
        highDpiSupport: true
    });
    gauge3.maxValue = 100;
    gauge3.setMinValue(0); 
    gauge3.set(80);
    gauge3.animationSpeed = 32;

    var q4 = document.getElementById('q4'); 
    var gauge4 = new Gauge(q4).setOptions({
        colorStart: "#6fadcf",
        colorStop: void 0,
        gradientType: 0,
        strokeColor: "#e0e0e0",
        generateGradient: true,
        percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],
        pointer: {
          length: 0.65,
          strokeWidth: 0.035,
          iconScale: 1.0
        },
        staticLabels: {
          font: "14px sans-serif",
          labels: [9,95],
          customlabels: ["Somewhat", "Very"],
          fractionDigits: 0
        },
        staticZones: [
          {strokeStyle: "#F03E3E", min: 0, max: 30},
          {strokeStyle: "#FFDD00", min: 30, max: 60},
          {strokeStyle: "#30B32D", min: 60, max: 100}
        ],
        angle: 0,
        lineWidth: 0.44,
        radiusScale: 1.0,
        fontSize: 40,
        limitMax: false,
        limitMin: false,
        highDpiSupport: true
    });
    gauge4.maxValue = 100;
    gauge4.setMinValue(0); 
    gauge4.set(60);
    gauge4.animationSpeed = 32;*/
    //$(window).scrollTop($('#result').offset().top-200);
      //document.getElementById('result').scrollIntoView();
}

function displayBenchMarkdata(){
    var compensation;
    var title;
    var func;
    var companyPerUrl;
    var compensationPerUrl;
    var sectorVal = $("#sector").val();
    var industryVal = 'abc';
    var radioval = $("input[name='notPublicly']:checked").val();

    if (radioval == 'no'){
        compensation = $("#compensation").val();
        var annualRevenue = $("#annualRevenue").val();
        var growth = $("#growth").val();
        var grossMargin = $("#grossMargin").val();
        var roi = $("#roi").val();
        if(!annualRevenue || annualRevenue == ''){
            alert("Please Enter the Annual Revenue ");
            return;
        }
        if(!growth || growth == ''){
            alert("Please Enter the Annula Growth ");
            return;
        }
        if(!grossMargin || grossMargin == ''){
            alert("Please Enter the Gross Margin");
            return;
        }
        if(!roi || roi == ''){
            alert("Please Enter the ROI ");
            return;
        }
        title = $("#jobTitle").val();
        func = $("#jobFunction").val();
        annualRevenue = annualRevenue * 1000000;
        try{
            growth = parseFloat(growth);
            grossMargin = parseFloat(grossMargin);
            roi = parseFloat(roi);
            if(isNaN(growth) || isNaN(grossMargin) || isNaN(roi) || growth > 1000 || grossMargin > 1000 || roi > 1000){
                alert("Please enter only number and less than 1000 for percentage fields");
                return;
            }
        }catch(err){
            alert("Please enter only number in all the fields");
        }
    }else if (radioval == 'what'){
        compensation = $("#whatifcompensation").val();
        var annualRevenue = $('#whatifannualRevenue').slider('getValue');
        var growth = $("#whatifgrowth").val();
        var grossMargin = $("#whatifgrossMargin").val();
        var roi = $("#whatifroi").val();
        if(!annualRevenue || annualRevenue == ''){
            alert("Please Enter the Annual Revenue ");
            return;
        }
        if(!growth || growth == ''){
            alert("Please Enter the Annula Growth ");
            return;
        }
        if(!grossMargin || grossMargin == ''){
            alert("Please Enter the Gross Margin");
            return;
        }
        if(!roi || roi == ''){
            alert("Please Enter the ROI ");
            return;
        }
        title = $("#whatifjobTitle").val();
        func = $("#whatifjobFunction").val();
        //annualRevenue = (annualRevenue[0] * 1000000) + ',' + (annualRevenue[1] * 1000000);
        console.log("annualRevenue = " , annualRevenue);
        sectorVal = $("#sector").val();
        if($("#whatifindustry").val().length == 0){
            alert("Please Select one or more Industry");
            return;
        }
        industryVal =  $("#whatifindustry").val().join(',');
        
        try{
            growth = parseFloat(growth);
            grossMargin = parseFloat(grossMargin);
            roi = parseFloat(roi);
            if(isNaN(growth) || isNaN(grossMargin) || isNaN(roi) || growth > 1000 || grossMargin > 1000 || roi > 1000){
                alert("Please enter only number and less than 1000 for percentage fields");
                return;
            }
        }catch(err){
            alert("Please enter only number in all the fields");
        }
    }else{
        compensation = $("#compensationTicker").val();
        var ticker = $("#ticker").val();
        if(!ticker || ticker == ''){
            alert("Please Enter the Ticker ");
            return;
        }
        ticker = ticker.toUpperCase();
        title = $("#jobTitleTicker").val();
        func = $("#jobFunctionTicker").val();
    }
    
    if(compensation){
        compensation = compensation.replace(/[^a-zA-Z0-9]/g, "");
    }
    if(!compensation || compensation == ''){
        alert("Please Enter the total compensation ");
        return;
    }
    compensation = compensation * 1000;
    //let hostname = location.protocol + "//" + location.hostname + ":9191";
    let hostname =  "https://" + location.hostname + ":9192";
    if (radioval == 'no'){
        companyPerUrl = hostname + "/getCompanyBenchmarkForInput?sector=" + encodeURIComponent(sectorVal) + "&revenue_low=" +  (annualRevenue * 0.5)  + "&revenue_high=" +  (annualRevenue * 2) +
            "&gross_margins=" +  grossMargin + "&revenue_growth=" +  growth + "&roi=" +  roi;
        compensationPerUrl = hostname + "/getCompensationBenchmarkForInput?sector=" + encodeURIComponent(sectorVal) + "&revenue_low=" +  (annualRevenue * 0.5)  + "&revenue_high=" +  (annualRevenue * 2) +
            "&titl=" +  encodeURIComponent(title) + "&func=" +  encodeURIComponent(func) + "&total_pay=" +  compensation;
    }else if (radioval == 'what'){
        companyPerUrl = hostname + "/getCompanyBenchmarkForInput?sector=" + encodeURIComponent(sectorVal) + "&industry=" +  encodeURIComponent(industryVal) + "&revenue_low=" +  (annualRevenue[0] * 1000000)  + "&revenue_high=" +  (annualRevenue[1] * 1000000) +
        "&gross_margins=" +  grossMargin + "&revenue_growth=" +  growth + "&roi=" +  roi;
        compensationPerUrl = hostname + "/getCompensationBenchmarkForInput?sector=" + encodeURIComponent(sectorVal) + "&industry=" +  encodeURIComponent(industryVal) + "&revenue_low=" +  (annualRevenue[0] * 1000000)  + "&revenue_high=" +  (annualRevenue[1] * 1000000) +
        "&titl=" +  encodeURIComponent(title) + "&func=" +  encodeURIComponent(func) + "&total_pay=" +  compensation;
    }else{
        companyPerUrl = hostname + "/getCompanyBenchmarkForTicker?ticker=" + encodeURIComponent(ticker);
        compensationPerUrl = hostname + "/getCompensationBenchmarkForTicker?ticker=" + encodeURIComponent(ticker) +
            "&titl=" +  encodeURIComponent(title) + "&func=" +  encodeURIComponent(func) + "&total_pay=" +  compensation;
    }
    $.ajax({
        url: companyPerUrl,
        success: function(result){
            console.log(result);
            if(!result.includes("<tr>")){
                result = "<div style='text-align:center'>No Record Found</div>";
            }
            $.ajax({
                url: compensationPerUrl,
                success: function(resp){
                    console.log(resp);
                    if(!resp.includes("<tr>")){
                        resp = "<div style='text-align:center'>No Record Found</div>";
                    }
                    var html = result + "<br/><br/>" + resp;
                    console.log(html);
                    if (radioval == 'yes'){
                        $.ajax({
                            url: "/getTickerVal?ticker=" + ticker,
                            success: function(result){
                                console.log(result);
                                if(result){
                                    sectorVal = result.sector;
                                    industryVal = result.industry;
                                    var headerHtml = "<div><span> <b>Sector:</b>&nbsp;&nbsp;" + sectorVal + "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><br/<<br/>";
                                    var win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840));
                                    win.document.body.innerHTML = headerHtml + html;
                                }
                            }
                        });
                    }else{
                        var headerHtml = "<div><span> <b>Sector:</b>&nbsp;&nbsp;" + sectorVal + "</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><br/<<br/>";
                        var win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840));
                        win.document.body.innerHTML = headerHtml + html;
                    }
                    
                    
                }
            });
        }
    });
   
}

function updateVal(){
    var ticker = $("#ticker").val();
    console.log(ticker);
    if(!ticker || ticker == ''){
        return;
    }
    $("#loading").show();
    $.ajax({
        url: "/getTickerVal?ticker=" + ticker,
        success: function(result){
            console.log(result);
            if(result){
                $("#sector").val(result.sector);
                loadIndustry(null, function (){
                    $("#industry").val(result.industry);
                    loadRange(function (){
                        var marketCapVal = $('#marketcapslider').slider('getValue');
                        $('#marketcapslider').slider({
                            value: getSliderVlaue(marketCapVal, result.market_cap)
                        });
                        $('#marketcapslider').slider('refresh');
                        
                        var pmVal = $('#pmslider').slider('getValue');
                        $('#pmslider').slider({
                            value: getSliderVlaue(pmVal, result.profit_margin)
                        });
                        $('#pmslider').slider('refresh');
                        
                        var gmVal = $('#gmslider').slider('getValue');
                        $('#gmslider').slider({
                            value: getSliderVlaue(gmVal, result.gross_margin)
                        });
                        $('#gmslider').slider('refresh');
                        
                        var roiVal = $('#roislider').slider('getValue');
                        $('#roislider').slider({
                            value: getSliderVlaue(roiVal, result.roi)
                        });
                        $('#roislider').slider('refresh');
                        
                        var epsVal = $('#epsslider').slider('getValue');
                        $('#epsslider').slider({
                            value: getSliderVlaue(epsVal, result.eps_past5yrs)
                        });
                        $('#epsslider').slider('refresh');
                        
                        var salesVal = $('#salesslider').slider('getValue');
                        $('#salesslider').slider({
                            value: getSliderVlaue(salesVal, result.sales_past5yrs)
                        });
                        $('#salesslider').slider('refresh');
                    });
                });
            }
            $("#loading").hide();
        }
    });
    $("#result").show();
}

function calculateDenom(val, floor){ 
    if(val > 999999){
        if(floor){
            return (Math.floor(val/1000000) + 'T');
        }else{
            return ((val/1000000).toFixed(2) + 'T');
        }
    }else if(val > 999){
        if(floor){
            return (Math.floor(val/1000) + 'B');
        }else{
            return ((val/1000).toFixed(2) + 'B');
        }
        
    }else{
        if(floor){
            return Math.floor(val) + 'M';
        }else{
            return val.toFixed(2) + 'M';
        }
    }
}

function getSliderVlaue(arr, val){
    var newarr = [];
    if(val < arr[1]){
        newarr.push(val);
        newarr.push(arr[1]);
    }else{
        newarr.push(arr[0]);
        newarr.push(val); 
    }
    return newarr;
}

function showTicker(){
    var val = $("input[name='notPublicly']:checked").val();
    console.log(val);
    let jobFunctionTicker = $("#jobFunctionTicker").val();
    let jobTitleTicker = $("#jobTitleTicker").val();
    let compensationTicker = $("#compensationTicker").val();

    let jobFunction = $("#jobFunction").val();
    let jobTitle = $("#jobTitle").val();
    let sector = $("#sector").val();
    let industry = $("#industry").val();
    let compensation = $("#compensation").val();
    let annualRevenue = $("#annualRevenue").val();
    let growth = $("#growth").val();
    let grossMargin = $("#grossMargin").val();
    let roi = $("#roi").val();
    
    let whatifjobFunction = $("#whatifjobFunction").val();
    let whatifjobTitle = $("#whatifjobTitle").val();
    let whatifsector = $("#whatifsector").val();
    let whatifcompensation = $("#whatifcompensation").val();
    let whatifgrowth = $("#whatifgrowth").val();
    let whatifgrossMargin = $("#whatifgrossMargin").val();
    let whatifroi = $("#whatifroi").val();
   
    console.log(jobFunction);
    console.log(jobTitle);

    if(val == 'yes'){
        let jfunc = (jobFunction != '10100') ? jobFunction : whatifjobFunction;
        let jtitle = (jobTitle != '1010') ? jobTitle : whatifjobTitle;

        $("#tickerDiv").show();
        $("#nontickerDiv").hide();
        $("#whatifDiv").hide();

        $("#jobFunctionTicker").val(jfunc);
        $("#jobTitleTicker").val(jtitle);
        $("#compensationTicker").val(compensation | whatifcompensation);
    }else if(val == 'no'){
        let jfunc = (jobFunctionTicker != '10100') ? jobFunctionTicker : whatifjobFunction;
        let jtitle = (jobTitleTicker != '1010') ? jobTitleTicker : whatifjobTitle;

        $("#tickerDiv").hide();
        $("#nontickerDiv").show();
        $("#whatifDiv").hide();

        $("#jobFunction").val(jfunc);
        $("#jobTitle").val(jtitle);
        $("#sector").val(whatifsector);
        $("#compensation").val(compensationTicker | whatifcompensation);
        $("#growth").val(whatifgrowth);
        $("#grossMargin").val(whatifgrossMargin);
        $("#roi").val(whatifroi);
    }else{
        let jfunc = (jobFunctionTicker != '10100') ? jobFunctionTicker : jobFunction;
        let jtitle = (jobTitleTicker != '1010') ? jobTitleTicker : jobTitle;
        $("#tickerDiv").hide();
        $("#nontickerDiv").hide();
        $("#whatifDiv").show();

        $("#whatifjobFunction").val(jfunc);
        $("#whatifjobTitle").val(jtitle);
        $("#whatifsector").val(sector);
        $("#whatifcompensation").val(compensationTicker | compensation);
        $("#whatifgrowth").val(growth);
        $("#whatifgrossMargin").val(grossMargin);
        $("#whatifroi").val(roi);
    }
    
}