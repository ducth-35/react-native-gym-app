const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// Mapping từ muscle groups trên website sang app
const muscleGroupMapping = {
  'shoulders': { id: 'shoulders', name: 'Vai', icon: '💪', color: '#45B7D1' }
};

// Mapping difficulty levels
const difficultyMapping = {
  'Stretching': 'Beginner',
  'Beginner': 'Beginner',
  'Intermediate': 'Intermediate',
  'Advanced': 'Advanced'
};

class ShoulderScraper {
  constructor() {
    this.baseUrl = 'https://fitnessprogramer.com';
    this.delay = 2000; // 2 giây delay giữa các request
    this.existingExercises = [];
    this.newExercises = [];
  }

  async loadExistingExercises() {
    try {
      const data = await fs.readFile(path.join(__dirname, '../src/data/exercises.json'), 'utf8');
      this.existingExercises = JSON.parse(data);
      console.log(`Đã tải ${this.existingExercises.length} bài tập hiện có`);
    } catch (error) {
      console.log('Không thể tải file exercises.json hiện có:', error.message);
      this.existingExercises = [];
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateExerciseId(name) {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .trim();
  }

  isExerciseExists(exerciseName) {
    const id = this.generateExerciseId(exerciseName);
    return this.existingExercises.some(ex => ex.id === id || ex.name.toLowerCase() === exerciseName.toLowerCase());
  }

  async downloadImage(imageUrl, filename) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imagePath = path.join(__dirname, '../src/assets/images', filename);
      
      // Tạo thư mục nếu chưa có
      await fs.mkdir(path.dirname(imagePath), { recursive: true });
      
      // Ghi file
      await fs.writeFile(imagePath, response.data);
      
      return true;
    } catch (error) {
      console.error(`Lỗi khi tải ảnh ${filename}:`, error.message);
      return false;
    }
  }

  async scrapeExerciseDetail(exerciseUrl) {
    try {
      console.log(`Đang cào chi tiết bài tập: ${exerciseUrl}`);
      await this.sleep(this.delay);
      
      const response = await axios.get(exerciseUrl);
      const $ = cheerio.load(response.data);
      
      const title = $('h1').first().text().trim();
      
      // Kiểm tra xem bài tập đã tồn tại chưa
      if (this.isExerciseExists(title)) {
        console.log(`Bài tập "${title}" đã tồn tại, bỏ qua`);
        return null;
      }

      // Lấy ảnh GIF
      const imageElement = $('img[src*=".gif"]').first();
      let imageUrl = imageElement.attr('src');
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = this.baseUrl + imageUrl;
      }

      // Tạo filename cho ảnh
      const exerciseId = this.generateExerciseId(title);
      const imageFilename = `${exerciseId}.gif`;

      // Tải ảnh về
      if (imageUrl) {
        try {
          await this.downloadImage(imageUrl, imageFilename);
          console.log(`Đã tải ảnh: ${imageFilename}`);
        } catch (error) {
          console.error(`Không thể tải ảnh cho ${title}:`, error.message);
        }
      }

      // Tạo instructions mặc định cho bài tập vai
      const instructions = this.generateShoulderInstructions(title);

      // Lấy equipment
      const equipment = [];
      const equipmentText = $('.equipment, [class*="equipment"]').text().toLowerCase();
      if (equipmentText.includes('barbell')) equipment.push('Thanh tạ');
      if (equipmentText.includes('dumbbell')) equipment.push('Tạ đơn');
      if (equipmentText.includes('bench')) equipment.push('Ghế bench');
      if (equipmentText.includes('cable')) equipment.push('Cable');
      if (equipmentText.includes('machine')) equipment.push('Máy tập');

      // Lấy difficulty
      let difficulty = 'Intermediate'; // Mặc định cho bài tập vai
      const difficultyText = $('[class*="difficulty"], .difficulty').text().trim();
      if (difficultyMapping[difficultyText]) {
        difficulty = difficultyMapping[difficultyText];
      }

      // Tạo object bài tập mới
      const exercise = {
        id: exerciseId,
        name: title,
        muscleGroup: muscleGroupMapping['shoulders'],
        description: `Bài tập ${title.toLowerCase()} giúp phát triển cơ vai`,
        instructions: instructions,
        sets: 3,
        reps: difficulty === 'Beginner' ? '10-15' : difficulty === 'Intermediate' ? '8-12' : '6-10',
        restTime: difficulty === 'Beginner' ? 60 : difficulty === 'Intermediate' ? 75 : 90,
        difficulty: difficulty,
        equipment: equipment,
        image: imageFilename,
        tips: [
          'Giữ lưng thẳng trong suốt bài tập',
          'Kiểm soát tốc độ thực hiện',
          'Tập trung vào cơ vai'
        ],
        commonMistakes: [
          'Sử dụng trọng lượng quá nặng',
          'Thực hiện quá nhanh',
          'Không giữ tư thế đúng'
        ],
        breathingTechnique: 'Thở ra khi đẩy lên, hít vào khi hạ xuống'
      };

      return exercise;
    } catch (error) {
      console.error(`Lỗi khi cào chi tiết bài tập ${exerciseUrl}:`, error.message);
      return null;
    }
  }

  generateShoulderInstructions(exerciseName) {
    const name = exerciseName.toLowerCase();
    
    if (name.includes('press') || name.includes('push')) {
      return [
        "Đứng thẳng hoặc ngồi, giữ tạ ở vai",
        "Đẩy tạ lên trên đầu theo đường thẳng",
        "Duỗi thẳng tay ở đỉnh",
        "Hạ xuống từ từ về vị trí ban đầu"
      ];
    }
    
    if (name.includes('raise') || name.includes('lateral')) {
      return [
        "Đứng thẳng, giữ tạ ở hai bên hông",
        "Nâng tay ra hai bên đến ngang vai",
        "Giữ một chút ở đỉnh",
        "Hạ xuống từ từ về vị trí ban đầu"
      ];
    }
    
    if (name.includes('row') || name.includes('rear')) {
      return [
        "Cúi người về phía trước, giữ tạ",
        "Kéo tạ về phía sau vai",
        "Siết chặt cơ vai sau ở đỉnh",
        "Hạ xuống từ từ về vị trí ban đầu"
      ];
    }
    
    // Instructions mặc định
    return [
      `Chuẩn bị tư thế ban đầu cho bài tập ${exerciseName}`,
      `Thực hiện động tác theo đúng kỹ thuật`,
      `Tập trung vào cơ vai`,
      `Kiểm soát tốc độ và trở về vị trí ban đầu`
    ];
  }

  async scrapeShoulderExercises() {
    console.log(`\nĐang cào bài tập vai từ fitnessprogramer.com`);
    
    for (let page = 1; page <= 3; page++) {
      try {
        const url = page === 1 
          ? `${this.baseUrl}/exercise-primary-muscle/shoulders/`
          : `${this.baseUrl}/exercise-primary-muscle/shoulders/page/${page}/`;
        
        console.log(`Đang cào trang ${page}: ${url}`);
        await this.sleep(this.delay);
        
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        const exerciseLinks = [];
        $('a[href*="/exercise/"]').each((i, elem) => {
          const href = $(elem).attr('href');
          if (href && href.includes('/exercise/') && !href.includes('#')) {
            const fullUrl = href.startsWith('http') ? href : this.baseUrl + href;
            if (!exerciseLinks.includes(fullUrl)) {
              exerciseLinks.push(fullUrl);
            }
          }
        });

        console.log(`Tìm thấy ${exerciseLinks.length} bài tập trên trang ${page}`);

        // Cào chi tiết từng bài tập
        for (const link of exerciseLinks.slice(0, 8)) { // Lấy 8 bài tập mỗi trang
          const exercise = await this.scrapeExerciseDetail(link);
          if (exercise) {
            this.newExercises.push(exercise);
            console.log(`✓ Đã thêm bài tập: ${exercise.name}`);
          }
        }

        // Kiểm tra xem có trang tiếp theo không
        const hasNextPage = $('a[href*="page/"]').length > 0;
        if (!hasNextPage) {
          console.log('Không có trang tiếp theo');
          break;
        }

      } catch (error) {
        console.error(`Lỗi khi cào trang ${page}:`, error.message);
        // Thử tiếp trang sau
        continue;
      }
    }
  }

  async saveNewExercises() {
    if (this.newExercises.length === 0) {
      console.log('Không có bài tập vai mới để lưu');
      return;
    }

    // Kết hợp bài tập cũ và mới
    const allExercises = [...this.existingExercises, ...this.newExercises];
    
    // Lưu vào file
    const outputPath = path.join(__dirname, '../src/data/exercises.json');
    await fs.writeFile(outputPath, JSON.stringify(allExercises, null, 2), 'utf8');
    
    console.log(`\n✓ Đã lưu ${this.newExercises.length} bài tập vai mới vào exercises.json`);
    console.log(`Tổng số bài tập: ${allExercises.length}`);
  }

  async run() {
    try {
      console.log('🚀 Bắt đầu cào dữ liệu bài tập vai từ fitnessprogramer.com');
      
      await this.loadExistingExercises();
      await this.scrapeShoulderExercises();
      await this.saveNewExercises();
      
      console.log('\n🎉 Hoàn thành cào dữ liệu bài tập vai!');
    } catch (error) {
      console.error('❌ Lỗi trong quá trình cào dữ liệu:', error.message);
    }
  }
}

// Chạy script
if (require.main === module) {
  const scraper = new ShoulderScraper();
  scraper.run();
}

module.exports = ShoulderScraper;
