import {MySQLConnector} from "./MySQLConnector";
import playwright from "playwright";
import fs, {readFileSync} from "fs";
import {join, resolve as _resolve} from "path";
import fse from "fs-extra";
import hasha from "hasha";
import {exec} from "child_process"; // import devices
const { chromium, firefox, devices, webkit } = playwright;
const os = require("os");

const iPhone = devices["iPhone 13 Pro"]
// check the available memory
const userHomeDir = os.homedir();
const preloadFile = readFileSync(join(__dirname, './small_injector.js'), 'utf8');


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
const browserLaunchers = [firefox,chromium];

async function initSetting(page:playwright.Page){
    await page.addInitScript(preloadFile);
    page.exposeFunction('transferWasm',async (stringBuffer: string) => {
        const str2ab = function _str2ab(str: string) { // Convert a UTF-8 String to an ArrayBuffer
            var buf = new ArrayBuffer(str.length); // 1 byte for each char
            var bufView = new Uint8Array(buf);

            for (var i=0, strLen=str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return Buffer.from(buf);
        }

        const wasmBuffer = str2ab(stringBuffer);
        const bufferHashString = await hasha.async(wasmBuffer, {algorithm: 'sha256'})
        await fse.outputFile(_resolve('./transformed/',`${bufferHashString}.wasm`), wasmBuffer);
        const child = exec(`wasm2wat ./transformed/${bufferHashString}.wasm -o ./transformed/${bufferHashString}.wat`);
        child.on('exit',()=>{
            let filecontent = fse.readFileSync(`./transformed/${bufferHashString}.wat`,'utf-8');
            filecontent.split(/\r?\n/).forEach(line =>  {
                console.log(`Line from file: ${line}`);
            });
            exec(`wasm2wat ./transformed/${bufferHashString}.wat -o ./transformed/${bufferHashString}.wasm`).on('exit',()=>{
               return fse.readFileSync(`./transformed/${bufferHashString}.wasm`);
            });
        })
    });
}
async function main() {
    if(argv.url != null || URL_TO_SCAN != null){
        const urlToScan:string = URL_TO_SCAN ?? argv.url ?? '';
        for(const launcher of browserLaunchers){
            if(urlToScan !== ''){
                let browser = await firefox.launchPersistentContext(userHomeDir,
                    {
                        deviceScaleFactor: iPhone.deviceScaleFactor,
                        isMobile: iPhone.isMobile,
                        viewport: iPhone.viewport,
                        userAgent: iPhone.userAgent,
                        headless: false
                        //viewport: { width: 1280, height: 720 }
                    }
                );
                let page = await browser.newPage();

                page.goto(urlToScan);
            }
        }
    }
}
main();