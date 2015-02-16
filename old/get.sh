#!/bin/bash
#

HOST="https://www.sbb.ch"

COOKIE="/tmp/$(dd if=/dev/random count=20 | md5)"

URL_FOR_COOKIE="/en/ticketshop/b2c/adw.do?4092"
URL_FOR_FORM="/ticketshop/b2c/artikelspezSAGeneric.do"
URL_FOR_BILLETS="/ticketshop/b2c/billettauswahl.do"

TOKEN1=$(curl -Lc $COOKIE $HOST$URL_FOR_COOKIE &> /dev/stdout | grep -o '[0-9a-z]\{32\}' | head -n 1)

ORIGIN=$1
DEST=$2
DATE=$3

TOKEN2=$(curl -Lb $COOKIE -X POST $HOST$URL_FOR_FORM \
    -d org.apache.struts.taglib.html.TOKEN=$TOKEN1 \
    -d artikelspez.abgang.name= \
    -d artikelspez.abgang.method:cityOption=CityTicket \
    -d artikelspez.bestimmung.name= \
    -d artikelspez.via[0].name= \
    -d "artikelspez.reiseDatum.datumViewDDMMYYYY_E=$3" \
    &> /dev/stdout | \
    grep -o '[0-9a-z]\{32\}' | \
    head -n 1)

TOKEN3=$(curl -Lb $COOKIE -X POST $HOST$URL_FOR_FORM \
    -d org.apache.struts.taglib.html.TOKEN=$TOKEN2 \
    -d artikelspez.abgang.selection=$ORIGIN \
    -d artikelspez.bestimmung.name= \
    -d artikelspez.bestimmung.method:cityOption=CityTicket \
    -d artikelspez.via[0].name= \
    -d "artikelspez.reiseDatum.datumViewDDMMYYYY_E=$3" \
    &> /dev/stdout | \
    grep -o '[0-9a-z]\{32\}' | \
    head -n 1)

TOKEN4=$(curl -s -Lb $COOKIE -X POST $HOST$URL_FOR_FORM \
    -d org.apache.struts.taglib.html.TOKEN=$TOKEN3 \
    -d artikelspez.abgang.selection=$ORIGIN \
    -d artikelspez.bestimmung.selection=$DEST \
    -d artikelspez.via[0].name= \
    -d "artikelspez.reiseDatum.datumViewDDMMYYYY_E=$3" \
    -d method:cont=Next \
    &> /dev/stdout | tee)

# echo $ORIGIN
rm $COOKIE
echo $TOKEN4 | cut -d "{" -f13 | cut -d ";" -f1 | sed 's/^/{/' | head -n 1
exit 0