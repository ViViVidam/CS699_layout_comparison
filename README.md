# Web Layout Crawler #

This project uses the Playwright library to crawl a specified webpage with Chrome and Firefox with WebAssembly enabled and disabled. The downloaded webpage files are downloaded to the folder `JSOutput`. Screenshots are saved to the `Screenshots` folder. The playwright will emulate as an android device.

## How to set up ###

### Prequisites
* Node.js
* MySQL
* Android Studio/ Real Android Device

### Project Installation with Android Virtual Device
1. Run the `found_page_schema.sql` under the `Database` folder to set up the schema and table for metadata logging.
2. Run the command `npm install` in the root directory of this project (same as this README).
3. Run `npm update` to update all the packages
4. Run `npm run build`
5. Download Android Studio from the website, installed it with virtual devices support.
6. create a virtual device using device manager in Android device
7. setting the environment variable to get adb work, type `adb` to check if it works.
8. setting environment variable ANDROID_HOME to where you installed your Android Studio

### Usage
1. Run the virtual devices through Android Studio Device Manager or through terminal
2. Run Appium in the root directory. To do this, open up  a new terminal and type `appium --allow-insecure chromedriver_autodownload`
3. Open another terminal and run the command `node ./build/index.js --url <url_to_san>` to scan the `<url_to_san>` and all of its first-level subpages. For example, try running the command `node ./build/index.js --url https://jkumara.github.io/pong-wasm/` as this site contains WebAssembly. 
4. To scan a list of urls with the crawler, run the command `node ./build/index.js --file <file_path>` to read in the file at `<file_path>`. For example, to use the included file `sites.txt`, run the command `node ./build/index.js --file sites.txt`
5. By default, both of these commands will now only download WebAssembly file found by default. If you want to download all files, add the flag `--full true` to the command. For example, if running the example in Usage 2, run the command `node ./build/index.js --file sites.txt --full true`.
6. To generate visual analysis report, run `python scripts/ScreenshotAnalysis.py`

### TroubleShooting
1. If in the emulator the device open the browser but never goto the url, shut down appium terminal, and run `adb uninstall io.appium.uiautomator2.server` and `adb uninstall io.appium.uiautomator2.server.test`, then relaunch appium