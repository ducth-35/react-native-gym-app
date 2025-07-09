const fs = require('fs').promises;
const path = require('path');

async function fixInstructions() {
  try {
    // Đọc file exercises.json
    const exercisesPath = path.join(__dirname, '../src/data/exercises.json');
    const data = await fs.readFile(exercisesPath, 'utf8');
    const exercises = JSON.parse(data);
    
    console.log(`Đang sửa instructions cho ${exercises.length} bài tập...`);
    
    // Sửa instructions cho các bài tập có vấn đề
    const fixedExercises = exercises.map(exercise => {
      // Kiểm tra nếu instructions có vấn đề (chứa menu items)
      const hasProblematicInstructions = exercise.instructions.some(instruction => 
        instruction.includes('Calculator') || 
        instruction.includes('Body Mass Index') ||
        instruction.includes('Home') ||
        instruction.length < 10
      );
      
      if (hasProblematicInstructions) {
        console.log(`Sửa instructions cho: ${exercise.name}`);
        
        // Tạo instructions mặc định dựa trên tên bài tập
        const defaultInstructions = generateDefaultInstructions(exercise.name, exercise.muscleGroup.name);
        
        return {
          ...exercise,
          instructions: defaultInstructions
        };
      }
      
      return exercise;
    });
    
    // Lưu lại file
    await fs.writeFile(exercisesPath, JSON.stringify(fixedExercises, null, 2), 'utf8');
    console.log('✓ Đã sửa xong instructions cho tất cả bài tập');
    
  } catch (error) {
    console.error('Lỗi khi sửa instructions:', error.message);
  }
}

function generateDefaultInstructions(exerciseName, muscleGroup) {
  const name = exerciseName.toLowerCase();
  
  // Instructions dựa trên loại bài tập
  if (name.includes('squat')) {
    return [
      "Đứng thẳng, chân rộng bằng vai",
      "Hạ thấp cơ thể như ngồi xuống ghế",
      "Giữ lưng thẳng, đầu gối không vượt qua mũi chân",
      "Đứng lên về vị trí ban đầu"
    ];
  }
  
  if (name.includes('curl')) {
    return [
      "Đứng thẳng hoặc ngồi, giữ tạ ở vị trí ban đầu",
      "Cuốn tạ lên về phía vai bằng cơ tay trước",
      "Siết chặt cơ tay trước ở đỉnh",
      "Hạ xuống từ từ về vị trí ban đầu"
    ];
  }
  
  if (name.includes('press')) {
    return [
      "Chuẩn bị tư thế với tạ ở vị trí ban đầu",
      "Đẩy tạ lên trên theo quỹ đạo thẳng",
      "Duỗi thẳng tay ở đỉnh",
      "Hạ xuống từ từ về vị trí ban đầu"
    ];
  }
  
  if (name.includes('pull') || name.includes('row')) {
    return [
      "Chuẩn bị tư thế ban đầu",
      "Kéo tạ về phía cơ thể bằng cơ lưng",
      "Siết chặt cơ lưng ở đỉnh",
      "Hạ xuống từ từ về vị trí ban đầu"
    ];
  }
  
  if (name.includes('fly')) {
    return [
      "Nằm hoặc đứng với tạ ở hai bên",
      "Mở rộng tay ra hai bên",
      "Đưa tay về phía trước như ôm",
      "Trở về vị trí ban đầu"
    ];
  }
  
  if (name.includes('dip')) {
    return [
      "Nắm chặt thanh song song hoặc mép ghế",
      "Nâng cơ thể lên, duỗi thẳng tay",
      "Hạ thấp cơ thể bằng cách uốn cùi chỏ",
      "Đẩy mạnh để trở về vị trí ban đầu"
    ];
  }
  
  if (name.includes('plank')) {
    return [
      "Nằm sấp, chống cẳng tay và mũi chân xuống sàn",
      "Giữ cơ thể thẳng từ đầu đến chân",
      "Siết chặt cơ bụng và mông",
      "Giữ tư thế trong thời gian quy định"
    ];
  }
  
  if (name.includes('crunch')) {
    return [
      "Nằm ngửa, gập đầu gối",
      "Đặt tay sau đầu hoặc chéo ngực",
      "Nâng vai và đầu lên khỏi sàn",
      "Hạ xuống từ từ về vị trí ban đầu"
    ];
  }
  
  if (name.includes('lunge')) {
    return [
      "Đứng thẳng, chân rộng bằng vai",
      "Bước một chân ra phía trước",
      "Hạ thấp cơ thể cho đến khi cả hai đầu gối tạo góc 90 độ",
      "Đẩy mạnh để trở về vị trí ban đầu"
    ];
  }
  
  // Instructions mặc định chung
  return [
    `Chuẩn bị tư thế ban đầu cho bài tập ${exerciseName}`,
    `Thực hiện động tác theo đúng kỹ thuật`,
    `Tập trung vào nhóm cơ ${muscleGroup.toLowerCase()}`,
    `Kiểm soát tốc độ và trở về vị trí ban đầu`
  ];
}

// Chạy script
if (require.main === module) {
  fixInstructions();
}

module.exports = { fixInstructions, generateDefaultInstructions };
