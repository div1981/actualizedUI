const pgquery = require('./db/pgbequery');


async function run(){
	i=0;
 	while (i<100000){
		 i++;
 		try {
			// console.log("-------------------");
			pgquery.getJsonbForMstarCompensation(async function(doc){
				// c(doc);
				ticker = doc.ticker;
				//ticker = 'MEIP'; 
				// module = 'defaultKeyStatistics';
				console.log(ticker);
                // console.log(doc.jsonb);
                console.log(doc.jsonb.rows.length);
                datesDef = doc.jsonb.datesDef;
                dlen = datesDef.length;
                const year = datesDef[dlen-1];
                console.log(year);

                jblob = doc.jsonb;
                var inserted = false;
                for (let index = 0; index < jblob.rows.length; index++) {
                    const officer = jblob.rows[index];
                    const type = officer.type;
                    if("person" == type){
                        const len = officer.totalCompensation.length;
                        const pay = officer.totalCompensation[len-1];
                        if (null != pay){
                            console.log("         -         ");
                            console.log(officer.name);
                            console.log(officer.title);
                            console.log(pay);
                            pgquery.insertMstarCompensation(ticker, officer.name, officer.title, year, pay, function(doc){});
                            inserted = true;
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                    }
                }
                // if(inserted == false){
                //     pgquery.insertMstarCompensation(ticker, 'officer.name', 'officer.title', 1900, 1000, function(doc){});
                //     await new Promise(resolve => setTimeout(resolve, 100));
                // }
                

			});
			await new Promise(resolve => setTimeout(resolve, 1000));
				
		} catch (error) {
			console.log(error);
		}
 	}
}

run();
