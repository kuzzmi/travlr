var request = require('request');

request.post({
        url: 'https://www.sbb.ch/ticketshop/b2c/adw.do?4092',
        form: {
            'org.apache.struts.taglib.html.TOKEN': '49fe6ffef4aa48ad48e6f280a28efa62',
            'artikelspez.abgang.selection': '3',
            'artikelspez.bestimmung.selection': '4',
            'artikelspez.via[0].name': '',
            'artikelspez.reiseDatum.datumViewDDMMYYYY_E': '18.10.2014 (Sa)',
            'method:cont': 'Next',
        },
        headers: {
            'Host': 'www.sbb.ch',
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Origin': 'https://www.sbb.ch',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2182.4 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'https://www.sbb.ch/ticketshop/b2c/adw.do?4092',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4,uk;q=0.2',
            'Cookie': 'AL_SESS-S=AAABLtwsFsZhOWRkYmYxNmQ5OGM3NDNhNDhhNzJmOWY0YzIyZTYwMQAA!7tKz0FkYI2tcOTGcmFA3s4T2cw=; AL_SESS=AAABLhtL_hMyOTM5MDliNmI2ODZlZTk2YjI2NWRiZDI2ZGQyMjE0MAAA!6ffhNqwYI1uTd_yjP0UWU!NHqc=; AL_SESS-S=AAABLrHd7e4zMGZhNDEzMmEyMzM4ZWJlNTdiNWMyOTE1YWRlZTIxNgAALFUY4JUkcny1i5ZkNYUQ0KjvrdE=; WT_FPC=id=bf39ddc3-1673-4e7c-9254-de570a2cfc44:lv=1413322602147:ss=1413317390496',
        }
    },
    function(e, r, body) {
        var regex = new RegExp(/var ticketPriceMap = ({[-"_:.,}0-9A-Z]+)/g);
        var res = regex.exec(body);

        console.log(body);

        var json = JSON.parse(res[0].replace('var ticketPriceMap = ', ''));
        console.log(json);
    });