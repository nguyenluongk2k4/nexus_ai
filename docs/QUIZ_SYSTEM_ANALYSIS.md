# 🎯 Phân tích & Thiết kế Hệ thống Quiz - AI Skill Tree

## 📊 1. Phân tích Cấu trúc hiện tại

### Hierarchy của Skill Tree (5 cấp)
```
Root (Lĩnh vực: IT/Auto)
  └── Specialization (Chuyên ngành: AI/ML, Cloud, Security...)
      └── Ability (Khả năng: thiết kế thuật toán, phát triển phần mềm...)
          └── Skill (Kỹ năng: phân tích độ phức tạp, quản lý vòng đời...)
              └── Knowledge (Kiến thức: Big-O, OOP principles...)
```

### Trạng thái Node hiện tại
- **Unlocked**: Đã hoàn thành (màu xanh lá)
- **Available**: Có thể học (màu tím) - hardcoded 70% skills, 30% knowledge
- **Locked**: Chưa mở khóa (màu xám)

### Hệ thống hiện có
✅ Learning Progress Tracking (trạng thái: not_started, in_progress, completed)
✅ Study Sessions với timer
✅ Timeline & Reminders
✅ Learning Insights & Stats (streak, total time, achievements)
❌ **Quiz System - CHƯA CÓ**
❌ **Dynamic Unlock Mechanism - CHƯA CÓ**

---

## 🎓 2. Đề xuất Chiến lược Quiz & Unlock

### ⭐ Phương án Khuyến nghị: Progressive Quiz - Hybrid Model

Triển khai quiz ở **3 mốc quan trọng** với độ khó tăng dần:

### 📝 Level 1: Knowledge-Level Quiz
**Mục đích:** Mở khóa Knowledge node tiếp theo trong cùng Skill

**Timing:** Khi hoàn thành học tài liệu của 1 Knowledge node

**Điều kiện kích hoạt:**
- ✅ Đã đánh dấu "Học xong" (completed) tài liệu trong Knowledge đó
- ✅ Thời gian học >= 70% thời gian ước tính
- ✅ Có ghi chú hoặc rating (chứng tỏ học kỹ)

**Cấu trúc Quiz:**
- **Số câu:** 3-5 câu trắc nghiệm
- **Loại câu:** Multiple Choice, True/False
- **Thời gian:** 5 phút
- **Điểm đậu:** 60% (2/3 hoặc 3/5 câu đúng)

**Nguồn câu hỏi:**
1. Từ `description` của Knowledge node (2 câu)
2. Từ `keywords` của Knowledge node (2-3 câu)

**Kết quả khi đậu:**
- 🔓 Unlock **Knowledge node kế tiếp** trong cùng Skill
- 🏆 +10 XP
- ⭐ Badge "Quick Learner" nếu làm nhanh < 3 phút

**Ví dụ:**
```
Skill: Phân tích độ phức tạp
  ├─ Knowledge 1: Big-O ✅ 
  │    └─ [Làm Quiz] → ✅ Pass (3/5 đúng) 
  │         └─ 🔓 Unlock Knowledge 2
  ├─ Knowledge 2: Phân tích đệ quy 🟣 (available)
  └─ Knowledge 3: 🔒 (locked)
```

---

### 📚 Level 2: Skill-Level Quiz
**Mục đích:** Mở khóa Skill node tiếp theo trong cùng Ability

**Timing:** Khi hoàn thành TẤT CẢ Knowledge nodes trong 1 Skill

**Điều kiện kích hoạt:**
- ✅ Tất cả Knowledge nodes = "Completed"
- ✅ Đã pass hết các Knowledge-level quizzes
- ✅ Đã học ít nhất 80% tài liệu trong toàn bộ Skill
- ✅ Tổng thời gian học Skill >= thời gian ước tính

**Cấu trúc Quiz:**
- **Số câu:** 8-12 câu
- **Loại câu:** Mix (MC, True/False, Code Snippet)
- **Thời gian:** 12-15 phút
- **Điểm đậu:** 70% (6/8 hoặc 8/12 câu đúng)

**Nguồn câu hỏi:**
1. 50% từ các Knowledge nodes (random từ bank đã tạo ở Level 1)
2. 30% câu tổng hợp kiến thức (so sánh, phân biệt concepts)
3. 20% câu áp dụng thực tế (code snippets, scenarios)

**Kết quả khi đậu:**
- 🔓 Unlock **Skill node kế tiếp** trong cùng Ability
- 🏆 +50 XP
- ⭐ Badge "Skill Master" cho Skill đó
- 📈 Stats: +1 Completed Skill

**Ví dụ:**
```
Ability: Thiết kế thuật toán
  ├─ Skill 1: Phân tích độ phức tạp ✅ 
  │    └─ [Làm Skill Quiz] → ✅ Pass (9/12 đúng)
  │         └─ 🔓 Unlock Skill 2
  ├─ Skill 2: Thuật toán nâng cao 🟣 (available)
  └─ Skill 3: 🔒 (locked)
```

---

### 🎯 Level 3: Ability-Level Quiz
**Mục đích:** Mở khóa Ability node tiếp theo trong cùng Specialization

**Timing:** Khi hoàn thành TẤT CẢ Skills trong 1 Ability

**Điều kiện kích hoạt:**
- ✅ Tất cả Skill nodes = "Completed"
- ✅ Đã pass hết Skill-level quizzes
- ✅ Streak >= 5 ngày (khuyến khích học đều đặn)
- ✅ Tổng thời gian học Ability >= 10 giờ
- ✅ Hoàn thành ít nhất 1 Project Idea (optional)

**Cấu trúc Quiz:**
- **Số câu:** 15-20 câu
- **Loại câu:** Comprehensive (MC, TF, Scenarios, Code Review, Mini-case study)
- **Thời gian:** 20-25 phút
- **Điểm đậu:** 75% (12/15 hoặc 15/20 câu đúng)

**Nguồn câu hỏi:**
1. 40% câu kiến thức nền (từ Knowledge nodes)
2. 30% câu tích hợp kiến thức (cross-skill questions)
3. 30% câu scenario/project-based (từ `projectIdeas`)

**Kết quả khi đậu:**
- 🔓 Unlock **Ability node kế tiếp** trong cùng Specialization
- 🏆 +200 XP
- 🎖️ Certificate cho Ability đó (có thể download PDF)
- ⭐ Badge "Ability Achiever"
- 📊 Unlock "Mastery Level" tracking cho Ability

**Ví dụ:**
```
Specialization: Khoa học máy tính
  ├─ Ability 1: Thiết kế thuật toán ✅ 
  │    └─ [Làm Ability Quiz] → ✅ Pass (16/20 đúng)
  │         └─ 🔓 Unlock Ability 2
  │         └─ 📜 Certificate: "Algorithm Design Master"
  ├─ Ability 2: Lập trình & Cấu trúc dữ liệu 🟣 (available)
  └─ Ability 3: 🔒 (locked)
```

---

## 💡 3. So sánh các Phương án

### Phương án A: Quiz sau mỗi Knowledge ❌
**Ưu điểm:**
- Kiểm tra ngay lập tức
- Feedback nhanh

**Nhược điểm:**
- ❌ Quá nhiều quiz → Gây mệt mỏi
- ❌ Không đánh giá được khả năng tổng hợp
- ❌ User có thể bỏ qua học để chỉ làm quiz

### Phương án B: Quiz sau mỗi Skill ❌
**Ưu điểm:**
- Cân bằng giữa learning và testing
- Đánh giá tốt comprehension

**Nhược điểm:**
- ❌ Thiếu kiểm tra ở level cao (Ability)
- ❌ Không có progression nhỏ ở Knowledge level

### Phương án C: Hybrid Progressive (KHUYẾN NGHỊ) ✅
**Ưu điểm:**
- ✅ **Progressive difficulty**: Tăng dần độ khó
- ✅ **Multiple checkpoints**: 3 mốc quan trọng
- ✅ **Balanced frequency**: Không quá nhiều quiz
- ✅ **Comprehensive assessment**: Từ detail đến big picture
- ✅ **Motivation**: Unlock incentive ở mọi level
- ✅ **Flexible**: User có thể retry, học lại

**Nhược điểm:**
- Phức tạp hơn để implement
- Cần nhiều câu hỏi hơn

---

## 📋 4. Ma trận Quiz - Node Mapping

| Node Type | Quiz Trigger | Quiz Length | Pass Rate | Unlock Target | Time Limit |
|-----------|--------------|-------------|-----------|---------------|------------|
| **Knowledge** | Complete learning resources | 3-5 câu | 60% | Next Knowledge | 5 phút |
| **Skill** | Complete all Knowledge in Skill | 8-12 câu | 70% | Next Skill | 12 phút |
| **Ability** | Complete all Skills in Ability | 15-20 câu | 75% | Next Ability | 20 phút |

### Nguồn sinh câu hỏi cho từng level:

#### Knowledge Quiz
```
Input:
- knowledge.description
- knowledge.keywords
- knowledge.learningResources metadata

Output: 3-5 questions
- 2 câu về definition/concept
- 2-3 câu về application/example
```

#### Skill Quiz
```
Input:
- skill.description
- skill.children[] (all knowledge nodes)
- skill.tools

Output: 8-12 questions
- 4-6 câu từ Knowledge nodes (mix)
- 2-3 câu integration/comparison
- 2-3 câu về tools/practical
```

#### Ability Quiz
```
Input:
- ability.description
- ability.children[] (all skill + knowledge nodes)
- ability.projectIdeas

Output: 15-20 questions
- 6-8 câu knowledge foundation
- 5-6 câu skill integration
- 4-6 câu scenario/project-based
```

---

## 🔄 5. User Flow

### Flow 1: Học và mở khóa Knowledge
```
1. User chọn Knowledge node (available)
2. Xem tài liệu học tập
3. Bắt đầu Study Session
4. Đánh dấu "Completed" + Rating
5. 🎯 [Nút "Làm Quiz" hiện lên]
6. Click "Làm Quiz" → Mở QuizInterface
7. Làm 5 câu hỏi (5 phút)
8. Nộp bài → Xem kết quả
9. Nếu Pass (>=60%):
   - 🔓 Knowledge tiếp theo unlock
   - +10 XP
   - Hiển thị celebration animation
10. Nếu Fail:
   - Suggest ôn lại tài liệu
   - Cho phép retry sau 1 giờ
```

### Flow 2: Học và mở khóa Skill
```
1. User hoàn thành tất cả Knowledge trong 1 Skill
2. Tất cả Knowledge quizzes đã pass
3. 🎯 [Banner "Ready for Skill Challenge" hiện ở Skill node]
4. Click vào Skill node → Xem overview progress
5. Click "Take Skill Quiz"
6. Làm 10 câu hỏi (12 phút)
7. Submit → Xem kết quả chi tiết
8. Nếu Pass (>=70%):
   - 🔓 Skill tiếp theo unlock
   - +50 XP
   - Badge "Skill Master"
   - Skill node chuyển sang "Mastered" status
9. Nếu Fail:
   - Review lại các câu sai
   - Highlight Knowledge nodes cần ôn
   - Retry sau 3 giờ
```

### Flow 3: Mở khóa Ability (Major Milestone)
```
1. User hoàn thành tất cả Skills trong Ability
2. Check streak >= 5 days
3. 🎖️ [Special "Ability Challenge" notification]
4. Preparation screen:
   - Xem lại timeline
   - Review key concepts
   - Check prerequisites
5. Click "Start Ability Assessment"
6. Làm 15-20 câu (20 phút)
7. Submit → Detailed results
8. Nếu Pass (>=75%):
   - 🎉 Celebration screen
   - 🔓 Ability tiếp theo unlock
   - 📜 Generate certificate
   - +200 XP + Special badge
   - Email/notification about achievement
9. Nếu Fail:
   - Comprehensive review report
   - Personalized study plan
   - Retry sau 24 giờ
```

---

## 📊 6. Metrics & Analytics

### Quiz Performance Metrics
```typescript
interface QuizMetrics {
  // Per Quiz
  averageScore: number;
  passRate: number; // % users who pass
  averageTimeSpent: number;
  averageAttempts: number;
  
  // Per Question
  questionDifficulty: Record<string, number>; // % users who answer correctly
  
  // Per User
  userStrengths: string[]; // Topics with >80% correct
  userWeaknesses: string[]; // Topics with <60% correct
  improvementRate: number; // Score improvement over attempts
}
```

### Unlock Statistics
```typescript
interface UnlockStats {
  totalUnlocked: number;
  unlocksByLevel: Record<QuizLevel, number>;
  averageTimeToUnlock: number; // days
  streakWhenUnlocked: number;
  certificatesEarned: number;
}
```

---

## 🎨 7. Gamification & Incentives

### XP System
- Knowledge Quiz Pass: +10 XP
- Skill Quiz Pass: +50 XP
- Ability Quiz Pass: +200 XP
- Perfect Score (100%): +Bonus 50% XP
- Speed Bonus (<50% time): +Bonus 25% XP

### Badges
- 🎯 **Quick Learner**: Pass Knowledge quiz first try
- 📚 **Skill Master**: Pass Skill quiz with >85%
- 🎓 **Ability Achiever**: Pass Ability quiz
- 🔥 **Perfectionist**: Get 100% on any quiz
- ⚡ **Speed Demon**: Complete quiz in <50% time
- 🧠 **Knowledge Collector**: Pass 10 Knowledge quizzes
- 💪 **Skill Accumulator**: Pass 5 Skill quizzes
- 🏆 **Master of Mastery**: Complete entire Ability tree

### Leaderboard (Optional)
- Weekly top quiz takers
- Highest average scores
- Most skills unlocked
- Longest streak

---

**Tổng kết:** Phương án **Progressive Quiz - Hybrid Model** cân bằng tốt giữa learning verification, user engagement, và progressive difficulty. Triển khai theo 3 levels (Knowledge, Skill, Ability) đảm bảo kiểm tra đầy đủ mà không gây áp lực quá mức cho người học.
