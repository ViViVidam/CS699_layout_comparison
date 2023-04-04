import fs from 'fs';
import pixelmatch from 'pixelmatch';
import jimp from 'jimp';
import Jimp from 'jimp';

// Use PixelMatch
export async function pixelMatchDiff(imgpath1:string, imgpath2:string, diffpath:string){
    if (!fs.existsSync(imgpath1)){
      console.log(`${imgpath1} does not exist!`);
      return -1;
    }
    if (!fs.existsSync(imgpath2)){
      console.log(`${imgpath2} does not exist!`);
      return -1;
    }
    // add assertion width and length and img path exist
    try {
      const expectDiffRate = 0.001;
      const img1Read = (await jimp.read(fs.readFileSync(imgpath1)));
      const img2Read = (await jimp.read(fs.readFileSync(imgpath2)));
      let img1, img2, diff;
      if (img1Read.bitmap.height >= img2Read.bitmap.height) {
        diff = img2Read;
        img2 = img2Read;
        img1 = img1Read.cover(img2Read.bitmap.width,img2Read.bitmap.height,Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP);
      }else{
        diff = img1Read;
        img1 = img1Read;
        img2 = img1Read.cover(img1Read.bitmap.width,img1Read.bitmap.height,Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP);
      }
      const {width, height} = diff.bitmap;
      const failPixel = await pixelmatch(img1.bitmap.data, img2.bitmap.data, diff.bitmap.data, width, height, {
        diffMask: true,
        threshold: 0.5
      });
      const failRate = failPixel / (width * height);

      (await jimp.read(diff)).scale(1).quality(100).write(diffpath);

      if (failRate >= expectDiffRate) {
        console.log('fail');
      } else {
        console.log('pass');
      }
      // console.log(`SC: ${failRate}`);
      return failRate;
    } catch (error) {
      console.log(error);
      return -1;
    }
}


