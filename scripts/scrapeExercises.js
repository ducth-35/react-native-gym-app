const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

// Mapping từ muscle groups trên website sang app
const muscleGroupMapping = {
  'chest': { id: 'chest', name: 'Ngực', icon: '💪', color: '#FF6B6B' },
  'shoulders': { id: 'shoulders', name: 'Vai', icon: '💪', color: '#45B7D1' },
  'back': { id: 'back', name: 'Lưng', icon: '🏋️', color: '#4ECDC4' },
  'biceps': { id: 'arms', name: 'Tay', icon: '💪', color: '#96CEB4' },
  'triceps': { id: 'arms', name: 'Tay', icon: '💪', color: '#96CEB4' },
  'forearm': { id: 'arms', name: 'Tay', icon: '💪', color: '#96CEB4' },
  'abs': { id: 'abs', name: 'Bụng', icon: '🔥', color: '#DDA0DD' },
  'leg': { id: 'legs', name: 'Chân', icon: '🦵', color: '#FFEAA7' },
  'calf': { id: 'legs', name: 'Chân', icon: '🦵', color: '#FFEAA7' },
  'hip': { id: 'legs', name: 'Chân', icon: '🦵', color: '#FFEAA7' },
  'cardio': { id: 'fullbody', name: 'Toàn thân', icon: '🏃', color: '#FD79A8' },
  'full-body': { id: 'fullbody', name: 'Toàn thân', icon: '🏃', color: '#FD79A8' },
  'neck': { id: 'shoulders', name: 'Vai', icon: '💪', color: '#45B7D1' },
  'trapezius': { id: 'shoulders', name: 'Vai', icon: '💪', color: '#45B7D1' },
  'erector-spinae': { id: 'back', name: 'Lưng', icon: '🏋️', color: '#4ECDC4' }
};

// Mapping difficulty levels
const difficultyMapping = {
  'Stretching': 'Beginner',
  'Beginner': 'Beginner',
  'Intermediate': 'Intermediate',
  'Advanced': 'Advanced'
};

class ExerciseScraper {
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

  async scrapeExerciseDetail(exerciseUrl, muscleGroup) {
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

      // Lấy hướng dẫn từ phần "How To Do"
      const instructions = [];

      // Tìm các bullet points trong phần hướng dẫn
      $('ul li, ol li').each((i, elem) => {
        const text = $(elem).text().trim();
        // Lọc các hướng dẫn hợp lệ (không phải menu, không quá ngắn/dài)
        if (text &&
            text.length > 15 &&
            text.length < 150 &&
            !text.includes('Calculator') &&
            !text.includes('Home') &&
            !text.includes('Login') &&
            !text.includes('Profile') &&
            !text.includes('Workout Plans') &&
            (text.includes('Stand') || text.includes('Sit') || text.includes('Lie') ||
             text.includes('Hold') || text.includes('Keep') || text.includes('Place') ||
             text.includes('Lower') || text.includes('Raise') || text.includes('Push') ||
             text.includes('Pull') || text.includes('Extend') || text.includes('Bend') ||
             text.includes('Grip') || text.includes('Position') || text.includes('Start'))) {
          instructions.push(text);
        }
      });

      // Nếu không tìm thấy instructions phù hợp, tạo instructions mặc định
      if (instructions.length === 0) {
        instructions.push(
          `Chuẩn bị tư thế ban đầu cho bài tập ${title}`,
          `Thực hiện động tác theo đúng kỹ thuật`,
          `Kiểm soát tốc độ và nhịp thở`,
          `Trở về vị trí ban đầu và lặp lại`
        );
      }

      // Lấy equipment
      const equipment = [];
      const equipmentText = $('.equipment, [class*="equipment"]').text().toLowerCase();
      if (equipmentText.includes('barbell')) equipment.push('Thanh tạ');
      if (equipmentText.includes('dumbbell')) equipment.push('Tạ đơn');
      if (equipmentText.includes('bench')) equipment.push('Ghế bench');
      if (equipmentText.includes('cable')) equipment.push('Cable');
      if (equipmentText.includes('machine')) equipment.push('Máy tập');

      // Lấy difficulty
      let difficulty = 'Beginner';
      const difficultyText = $('[class*="difficulty"], .difficulty').text().trim();
      if (difficultyMapping[difficultyText]) {
        difficulty = difficultyMapping[difficultyText];
      }

      // Tạo object bài tập mới
      const exercise = {
        id: exerciseId,
        name: title,
        muscleGroup: muscleGroupMapping[muscleGroup] || muscleGroupMapping['chest'],
        description: `Bài tập ${title.toLowerCase()} giúp phát triển cơ ${muscleGroupMapping[muscleGroup]?.name.toLowerCase() || 'ngực'}`,
        instructions: instructions.slice(0, 4), // Lấy tối đa 4 bước
        sets: 3,
        reps: difficulty === 'Beginner' ? '10-15' : difficulty === 'Intermediate' ? '8-12' : '5-8',
        restTime: difficulty === 'Beginner' ? 60 : difficulty === 'Intermediate' ? 75 : 90,
        difficulty: difficulty,
        equipment: equipment,
        image: imageFilename,
        tips: [
          'Giữ tư thế đúng trong suốt bài tập',
          'Kiểm soát tốc độ thực hiện',
          'Tập trung vào cơ đích'
        ],
        commonMistakes: [
          'Thực hiện quá nhanh',
          'Không giữ tư thế đúng',
          'Sử dụng trọng lượng không phù hợp'
        ],
        breathingTechnique: 'Thở đều trong suốt bài tập'
      };

      return exercise;
    } catch (error) {
      console.error(`Lỗi khi cào chi tiết bài tập ${exerciseUrl}:`, error.message);
      return null;
    }
  }

  async scrapeExerciseList(muscleGroup, maxPages = 3) {
    console.log(`\nĐang cào danh sách bài tập cho nhóm cơ: ${muscleGroup}`);
    
    for (let page = 1; page <= maxPages; page++) {
      try {
        const url = page === 1 
          ? `${this.baseUrl}/exercise-primary-muscle/${muscleGroup}/`
          : `${this.baseUrl}/exercise-primary-muscle/${muscleGroup}/page/${page}/`;
        
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
        for (const link of exerciseLinks.slice(0, 5)) { // Giới hạn 5 bài tập mỗi trang để test
          const exercise = await this.scrapeExerciseDetail(link, muscleGroup);
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
        console.error(`Lỗi khi cào trang ${page} của ${muscleGroup}:`, error.message);
        break;
      }
    }
  }

  async scrapeAllMuscleGroups() {
    const muscleGroups = ['chest', 'shoulders', 'back', 'biceps', 'triceps', 'abs', 'leg'];
    
    for (const muscleGroup of muscleGroups) {
      await this.scrapeExerciseList(muscleGroup, 2); // Chỉ cào 2 trang đầu để test
      console.log(`Hoàn thành cào nhóm cơ: ${muscleGroup}`);
    }
  }

  async saveNewExercises() {
    if (this.newExercises.length === 0) {
      console.log('Không có bài tập mới để lưu');
      return;
    }

    // Kết hợp bài tập cũ và mới
    const allExercises = [...this.existingExercises, ...this.newExercises];
    
    // Lưu vào file
    const outputPath = path.join(__dirname, '../src/data/exercises.json');
    await fs.writeFile(outputPath, JSON.stringify(allExercises, null, 2), 'utf8');
    
    console.log(`\n✓ Đã lưu ${this.newExercises.length} bài tập mới vào exercises.json`);
    console.log(`Tổng số bài tập: ${allExercises.length}`);
    
    // Lưu danh sách bài tập mới riêng để review
    const newExercisesPath = path.join(__dirname, '../src/data/new_exercises.json');
    await fs.writeFile(newExercisesPath, JSON.stringify(this.newExercises, null, 2), 'utf8');
    console.log(`✓ Đã lưu danh sách bài tập mới vào new_exercises.json để review`);
  }

  async run() {
    try {
      console.log('🚀 Bắt đầu cào dữ liệu bài tập từ fitnessprogramer.com');
      
      await this.loadExistingExercises();
      await this.scrapeAllMuscleGroups();
      await this.saveNewExercises();
      
      console.log('\n🎉 Hoàn thành cào dữ liệu!');
    } catch (error) {
      console.error('❌ Lỗi trong quá trình cào dữ liệu:', error.message);
    }
  }
}

// Chạy script
if (require.main === module) {
  const scraper = new ExerciseScraper();
  scraper.run();
}

module.exports = ExerciseScraper;
