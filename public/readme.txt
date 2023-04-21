
SET client_encoding TO 'UTF8';

select distinct(ticker) from finviz_fundamentals;

insert into cron_status(ticker) values ('TESTING');

insert into cron_status(ticker) select distinct(ticker) from finviz_fundamentals;

select ticker from cron_status where ticker like 'AA%' order by yahoo_assetprofile limit 1;

select ticker from cron_status order by yahoo_assetprofile limit 1;

update cron_status set yahoo_assetprofile=CURRENT_TIMESTAMP where ticker='AAP';

