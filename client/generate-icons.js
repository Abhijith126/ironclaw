const sharp = require('sharp');
const fs = require('fs');

const sizes = [192, 512];
const svg = fs.readFileSync('./public/icon.svg');

sizes.forEach(size => {
  sharp(svg)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(`./public/icon-${size}x${size}.png`)
    .then(() => console.log(`Generated icon-${size}x${size}.png`))
    .catch(err => console.error(err));
});
