import jimp from 'jimp';
import path from 'path';
import mkdirp from 'mkdirp';

if (process.argv.length < 4) {
    console.warn('./image_manager.exe [filename] [extname] [length = 1] [startCnt = 0]');
    process.exit(0);
}

const filename: string = process.argv[2];
const extname: string = process.argv[3];
let fileLength: number = 1;
if (process.argv.length >= 5) {
    fileLength = Number(process.argv[4]);
}
let startCnt: number = 0;
if (process.argv.length >= 6) {
    startCnt = Number(process.argv[5]);
}
let saveCnt: number = startCnt;

console.log('filename : ' + filename + ', fileLength : ' + fileLength);

async function changeImageData(index: number, brightUp: boolean) {
    return new Promise(async (resolve, reject) => {
        let loadFilename: string = filename + ` (${index}).${extname}`;
        let saveFilename: string = filename + ` (${saveCnt++}).${extname}`;
        //console.log('saveFilename: ' + saveFilename);

        jimp.read(loadFilename, async (err, lenna) => {
            if (err) {
                reject(err);
            }

            let brightness: number = -0.3;
            if (brightUp) {
                brightness = 0.3;
            }

            lenna
                .brightness(brightness) //INFO: 밝기 -1~1
                .contrast(0.4) //INFO: 대조 -1~1
                .resize(416, 416)
                .write(path.join('./result', saveFilename), err => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
        });
    });
}

async function main() {
    try {
        await mkdirp('./result');
        for (let i = 0; i < fileLength; i++) {
            await changeImageData(i, true);
            console.log(`Image Processing (Bright Up) Finish(${i + 1}/${fileLength})`);
        }
        for (let i = 0; i < fileLength; i++) {
            await changeImageData(i, false);
            console.log(`Image Processing (Bright Down) Finish(${i + 1}/${fileLength})`);
        }
    } catch (ex) {
        console.error(ex);
        process.exit(0);
    }
}
main();
