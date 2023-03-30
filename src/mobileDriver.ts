import {makeSetting} from "./mobileBrowserSettings";
import fs from "fs";
import fse from "fs-extra";
var wdio = require('webdriverio');
export class MobileDriver{
    driver:any;
    browserName:string;
    wasmEnable:boolean;

    constructor() {
        this.driver = null;
        this.browserName = "";
        this.wasmEnable = true;
    }
    async scrollView(){
        this.driver.execute(()=>{
            window.scroll({top:document.documentElement.clientHeight,left:0,behavior:"smooth"});
        })// client height exclude tool bar, and we are comparing screenshot viewport without tool bar
    }
    async takeScreenShot(url:string, browserName:string, savePath:string, wasmEnable:boolean){
        if (!fse.existsSync(savePath)) {
            fs.mkdirSync(savePath,{recursive:true});
        }
        if(browserName==="Chrome" || browserName === "FireFox"){
            if(browserName !== this.browserName || this.wasmEnable!=wasmEnable) {
                this.browserName = browserName;
                if (this.driver) {
                    await this.driver.deleteSession();
                    this.driver = await wdio.remote(makeSetting(browserName,wasmEnable))
                } else {
                    this.driver = await wdio.remote(makeSetting(browserName,wasmEnable));
                }
            }
            await this.driver.url(url);
            await this.driver.waitUntil(
                () => this.driver.execute(() => document.readyState === 'complete'),
                {
                    timeout: 60 * 1000, // 60 seconds
                    timeoutMsg: 'cannot open' + url
                }
            );
            await this.driver.pause(3 * 1000);
            let prevScrollY = await this.driver.execute(() => {return window.scrollY});
            let newScrollY;
            let endOfPage = false;
            let counter = 0;
            await this.driver.saveScreenshot(savePath + "/screenshot" + counter + ".png");
            counter+=1;
            while(!endOfPage)
            {
                await this.scrollView();
                await this.driver.pause(1.5 * 1000);
                newScrollY = await this.driver.execute(() => {return window.scrollY});
                console.log("new:"+newScrollY);
                if (newScrollY == prevScrollY) {
                    endOfPage = true;
                    break;
                }else{
                    prevScrollY = newScrollY;
                }
                await this.driver.pause(1 * 1000);
                await this.driver.saveScreenshot(savePath + "/screenshot" + counter + ".png");
                counter+=1;
            }
        }
        else{
            console.log("wrong name");
        }

    }
}