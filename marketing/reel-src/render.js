const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const mode=process.argv[2];const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
await pg.goto('file://'+__dirname+'/reel.html');await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(300);
if(mode==='preview'){for(const t of [1.8,4.5,7.8,11.5,14.5,16.8,18.8,22.5]){await pg.evaluate(t=>render(t),t);await pg.screenshot({path:`prev_${t}.png`})}}
else{fs.mkdirSync('frames',{recursive:true});const fps=30,dur=24;for(let i=0;i<fps*dur;i++){await pg.evaluate(t=>render(t),i/fps);await pg.screenshot({path:`frames/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:92})}}
await b.close()})();
