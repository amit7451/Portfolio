const sharp = require('sharp');
const fs = require('fs');

const files = [
  'C:/Users/AMIT/portfolio_main/apps/web/public/3d/ContactsRoom/images/contact.png',
  'C:/Users/AMIT/portfolio_main/apps/web/public/3d/ProjectRoom/images/github.png',
  'C:/Users/AMIT/portfolio_main/apps/web/public/3d/ProjectRoom/images/linkedin.png',
  'C:/Users/AMIT/portfolio_main/apps/web/public/3d/ProjectRoom/images/playstore.png',
  'C:/Users/AMIT/portfolio_main/apps/web/public/3d/ProjectRoom/images/web.png',
  'C:/Users/AMIT/portfolio_main/apps/web/public/3d/wall/images/c1.png',
  'C:/Users/AMIT/portfolio_main/apps/web/public/3d/wall/images/c2.png',
  'C:/Users/AMIT/portfolio_main/apps/web/public/3d/wall/images/r1.png',
  'C:/Users/AMIT/portfolio_main/apps/web/public/3d/wall/images/r2.png'
];

async function convert() {
  for (let file of files) {
    if (!fs.existsSync(file)) continue;
    const webpFile = file.replace('.png', '.webp');
    await sharp(file).webp({ quality: 90, lossless: false }).toFile(webpFile);
    fs.unlinkSync(file);
    console.log(`Converted ${file}`);
  }
}
convert().catch(console.error);
