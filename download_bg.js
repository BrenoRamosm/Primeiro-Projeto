import * as https from 'https';
import * as fs from 'fs';

https.get('https://share.google/tCTQLCO5NHuHxDzMW', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Find meta og:image
    const match = data.match(/<meta property="og:image" content="(.*?)"/);
    if (match && match[1]) {
      const imgUrl = match[1];
      console.log('Found image URL:', imgUrl);
      
      const file = fs.createWriteStream("public/img/hero-bg.jpg");
      https.get(imgUrl, (result) => {
        result.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Download complete');
        });
      });
    } else {
      console.log('Could not find image URL');
    }
  });
}).on('error', (e) => {
  console.error(e);
});
