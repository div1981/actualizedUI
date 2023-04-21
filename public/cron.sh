#!/bin/bash
varfname="$(date +"%F-%T")"
vardir="/home/actualized/actualizedUI/cron_output"
echo "${vardir}/${varfname}"
node /home/actualized/actualizedUI/app9191.js > "${vardir}/app9191${varfname}" 2>&1 &
#node /home/actualized/actualizedUI/cronYahooAssetProfile.js > "${vardir}/cronYahooAssetProfile${varfname}" 2>&1 &
#node /home/actualized/actualizedUI/cron4Yahoo.js > "${vardir}/cron4Yahoo${varfname}" 2>&1 &
#node /home/actualized/actualizedUI/cron4Mstar.js > "${vardir}/cron4Mstar${varfname}" 2>&1 &


