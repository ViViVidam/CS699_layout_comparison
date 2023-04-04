import {MySQLConnector} from './MySQLConnector';
import {Crawler} from './WebCrawler';
import uuidv1 from 'uuidv1';
import fs from 'fs';
import util from 'util';
import fse from 'fs-extra';

const readFile = util.promisify(fs.readFile);

const argv = require('yargs')
    .option('url', {
        alias: 'u',
        type: 'string',
        description: 'URL to scan',
        // demandOption: true 
    })
    .option('file', {
        alias: 'f',
        type: 'string',
        description: 'File path of text file (CSV) containing list of websites to scan',
        // demandOption: true 
    })
    .option('full', {
        alias: 'l',
        type: 'boolean',
        default: false,
        description: 'Set true to download all of the files on a web page when visited with the crawler',
        // demandOption: true 
    })
    .argv;
const PROD = process.env.NODE_ENV === 'production' ? true : false;
const URL_TO_SCAN = process.env.URL_TO_SCAN;

async function readUrlList(filepath: string) {
    const fileContents = await readFile(filepath, {encoding: 'utf8'}); 
    const sitesList = fileContents.split('\n')
                        .map(line => line.trim());
    return sitesList;
}


async function waitFor(seconds: number){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, seconds)
    });
}

async function crawlSite(urlToScan: string, database: MySQLConnector){
    let pageURL = urlToScan;
    if (!pageURL.includes('http://') && !pageURL.includes('https://')) {
        pageURL = "http://" + pageURL;
    }
    const crawler = new Crawler(database, pageURL, argv);

    for(const browser of ['chrome','firefox']){
        console.log(`Scanning with ${browser}: WebAssembly Enabled`)
        await crawler.scanPages(browser);
        //
        // crawler.setAlwaysScreenshot();
        console.log(`Scanning with ${browser}: WebAssembly Disabled`)
        await crawler.screenshotPagesWithWebAssemblyDisabled(browser);
    }
    return await crawler.pixelmatch();
}

async function getReportPath(){
    let reportPath = 'Reports/';
    if (!fs.existsSync(reportPath)){
        fs.mkdirSync(reportPath);
    }
    let date = new Date();
    let curMon = date.getMonth()+1;
    let curDate = date.getDate();
    let curYear = date.getFullYear().toString();
    let strMon, strDate;
    if (curMon >= 1 && curMon <= 9){
        strMon = "0"+curMon.toString();
    }else{
        strMon = curMon.toString();
    }
    if (curDate >= 1 && curDate <= 9){
        strDate = "0"+curDate.toString();
    }else{
        strDate = curDate.toString();
    }
    let curTime = curYear.concat(strMon, strDate,date.getHours().toString(),date.getMinutes().toString(),'.txt');
    let path = 'Reports/'+curTime;
    let str = 'url,chren-chrdis,chren-firen,firen-firdis,firdis-chrdis\r';
    fs.writeFile(path,str, {flag:'a+'},err=>{});
    return path;
}

async function writeResult(path:string, content:any[]){
    let str = content.join(',')+'\r';
    fs.writeFile(path,str, {flag:'a+'},err=>{});
}

async function main() {
    const db = new MySQLConnector();
    const reportPath = await getReportPath();
    if(argv.file != null ){
        const sitesToScan = await readUrlList(argv.file);
        for(const urlToScan of sitesToScan){
            console.log(`${urlToScan}`);
            let results = await crawlSite(urlToScan, db);
            await writeResult(reportPath, results);
        }
        db.close();
    }
    else if(argv.url != null || URL_TO_SCAN != null){
        const urlToScan:string = URL_TO_SCAN ?? argv.url ?? ''; 
        if(urlToScan !== ''){
            let results = await crawlSite(urlToScan, db);
            await writeResult(reportPath, results);
        }
    } 
}
main();



