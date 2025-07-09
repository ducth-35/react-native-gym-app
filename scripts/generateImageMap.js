const fs = require('fs').promises;
const path = require('path');

async function generateImageMap() {
  try {
    const imagesDir = path.join(__dirname, '../src/assets/images');
    const files = await fs.readdir(imagesDir);
    
    // Lọc chỉ lấy file .gif
    const gifFiles = files.filter(file => file.endsWith('.gif'));
    
    console.log(`Tìm thấy ${gifFiles.length} file GIF:`);
    gifFiles.forEach(file => console.log(`  - ${file}`));
    
    // Tạo imageMap code
    const imageMapEntries = gifFiles.map(file => {
      return `  '${file}': require('../assets/images/${file}'),`;
    });
    
    const imageMapCode = `const imageMap: Record<string, any> = {
${imageMapEntries.join('\n')}
};`;
    
    console.log('\n=== IMAGE MAP CODE ===');
    console.log(imageMapCode);
    
    // Lưu vào file để copy
    const outputPath = path.join(__dirname, 'imageMap.txt');
    await fs.writeFile(outputPath, imageMapCode, 'utf8');
    console.log(`\n✓ Đã lưu imageMap code vào: ${outputPath}`);
    
    // Tạo danh sách các file thiếu (nếu có)
    const exercisesPath = path.join(__dirname, '../src/data/exercises.json');
    const exercisesData = await fs.readFile(exercisesPath, 'utf8');
    const exercises = JSON.parse(exercisesData);
    
    const usedImages = exercises.map(ex => ex.image);
    const missingImages = usedImages.filter(img => !gifFiles.includes(img));
    const unusedImages = gifFiles.filter(img => !usedImages.includes(img));
    
    if (missingImages.length > 0) {
      console.log('\n⚠️  Ảnh bị thiếu:');
      missingImages.forEach(img => console.log(`  - ${img}`));
    }
    
    if (unusedImages.length > 0) {
      console.log('\n📁 Ảnh không được sử dụng:');
      unusedImages.forEach(img => console.log(`  - ${img}`));
    }
    
    if (missingImages.length === 0 && unusedImages.length === 0) {
      console.log('\n✅ Tất cả ảnh đều khớp với dữ liệu exercises!');
    }
    
  } catch (error) {
    console.error('Lỗi khi tạo imageMap:', error.message);
  }
}

// Chạy script
if (require.main === module) {
  generateImageMap();
}

module.exports = { generateImageMap };
