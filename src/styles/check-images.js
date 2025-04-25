// Save this as check-images.js in your project root
const fs = require('fs');
const path = require('path');
const data = require('./src/data/data.js');

const publicImagesDir = path.join(__dirname, 'public/images');

console.log('Checking for required images...');
const requiredImages = data.MenuList.map(item => {
  return item.image.startsWith('/') ? item.image.substring(1) : item.image;
});

// Add other images used in the app
requiredImages.push('images/mm.jpg'); // Banner image
requiredImages.push('images/banner.jpeg'); // About page banner

let missingImages = [];
for (const imagePath of requiredImages) {
  const fullPath = path.join(__dirname, 'public', imagePath.startsWith('/') ? imagePath.substring(1) : imagePath);
  if (!fs.existsSync(fullPath)) {
    missingImages.push(imagePath);
  }
}

if (missingImages.length > 0) {
  console.log('Missing images:');
  missingImages.forEach(img => console.log(`- ${img}`));
} else {
  console.log('All required images are present!');
}