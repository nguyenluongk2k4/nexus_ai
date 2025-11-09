# 🚀 Quiz System Implementation Guide

## Phase 1: Types & Data Structure (Week 1)

### Files to create:
1. `src/types/quiz.ts` - Quiz types
2. `src/types/unlock.ts` - Unlock mechanism types

### Key Types:
```typescript
// Quiz Question, Quiz, QuizAttempt, QuizProgress
// UnlockState, UnlockPrerequisites, GlobalUnlockState
```

---

## Phase 2: Core Services (Week 2-3)

### Files to create:
1. `src/services/QuizGenerator.ts` - Generate quizzes from nodes
2. `src/services/UnlockManager.ts` - Handle unlock logic
3. `src/contexts/QuizContext.tsx` - React context for quiz state

### QuizGenerator responsibilities:
- `generateKnowledgeQuiz(node)` → 3-5 questions
- `generateSkillQuiz(node)` → 8-12 questions  
- `generateAbilityQuiz(node)` → 15-20 questions
- Question templates & distractor generation

### UnlockManager responsibilities:
- `calculateUnlockState(nodeId)` → UnlockState
- `canAttemptQuiz()` → boolean
- `getPrerequisites()` → UnlockPrerequisites
- Tree navigation helpers

---

## Phase 3: UI Components (Week 4)

### Components to create:
1. `src/components/QuizTrigger.tsx` - Button to start quiz
2. `src/components/QuizInterface.tsx` - Main quiz taking interface
3. `src/components/QuizResults.tsx` - Results & review
4. `src/components/UnlockBadge.tsx` - Visual indicator of unlock status

### Integration points:
- **SkillTree.tsx**: Add QuizTrigger in node detail panel
- **LearningResourceManager.tsx**: Show quiz requirement progress
- **LearningInsights.tsx**: Display quiz stats

---

## Phase 4: Data Persistence (Week 5)

### LocalStorage keys:
```
- nexus_quiz_progress
- nexus_quiz_attempts
- nexus_unlock_states
```

### Integration with existing:
- Merge with `nexus_learning_progress`
- Update `LearningProgressContext` to include quiz data

---

## MVP Implementation Priority

### ✅ Must Have (MVP):
1. Knowledge-level quiz (basic)
2. Simple unlock: complete 1 knowledge → unlock next
3. Quiz interface with 5 MC questions
4. Basic results screen
5. LocalStorage persistence

### 🔄 Should Have (V1.1):
1. Skill-level quiz
2. Full unlock prerequisites
3. Review answers feature
4. Retry mechanism
5. Quiz stats in Insights

### 🎯 Nice to Have (V2.0):
1. Ability-level quiz
2. AI-generated questions
3. Adaptive difficulty
4. Spaced repetition quiz
5. Certificate generation

---

## Quick Start Implementation

### Step 1: Add Types
Create `src/types/quiz.ts` with basic quiz types.

### Step 2: Create QuizGenerator (Simplified)
```typescript
export function generateSimpleQuiz(node: any): Quiz {
  // 3-5 hardcoded questions for MVP
  // Based on node.description and keywords
}
```

### Step 3: Add Quiz Button to SkillTree
In `SkillTree.tsx`, after learning resources:
```tsx
{canTakeQuiz && (
  <button onClick={() => startQuiz(node.id)}>
    Take Quiz to Unlock Next
  </button>
)}
```

### Step 4: Create QuizInterface
Modal with questions → Submit → Show score → Unlock if pass.

### Step 5: Update Unlock Logic
In `convertSpecializationToNodes()`, change hardcoded status to dynamic based on quiz results.

---

## Testing Strategy

### Unit Tests:
- QuizGenerator: question generation
- UnlockManager: prerequisite calculation
- Quiz scoring logic

### Integration Tests:
- Complete quiz flow end-to-end
- Unlock mechanism works correctly
- Data persistence

### E2E Tests:
- User completes knowledge → takes quiz → passes → next unlocks
- User fails quiz → can retry after cooldown
- Progress saves and reloads correctly

---

## Database Schema (Future - Backend)

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY,
  node_id VARCHAR,
  node_type VARCHAR,
  questions JSONB,
  passing_score INT
);

CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY,
  user_id UUID,
  quiz_id UUID,
  answers JSONB,
  score INT,
  passed BOOLEAN,
  created_at TIMESTAMP
);
```

---

## Next Steps

1. ✅ **Review this design** with team
2. Create detailed Figma mockups for UI
3. Start Phase 1: Implement types
4. Build MVP QuizGenerator (template-based)
5. Add quiz button to SkillTree
6. Implement basic QuizInterface
7. Test end-to-end flow
8. Iterate based on user feedback

---

## Questions to Resolve

1. **Quiz Bank**: Pre-generate all quizzes or generate on-demand?
   - **Recommendation**: On-demand for MVP, migrate to pre-generated later

2. **Retry Cooldown**: How long between retry attempts?
   - **Recommendation**: Knowledge: 1 hour, Skill: 3 hours, Ability: 24 hours

3. **AI Integration**: Use GPT for question generation?
   - **Recommendation**: Phase 2, start with templates

4. **Multi-language**: Support Vietnamese + English?
   - **Recommendation**: Vietnamese only for MVP

5. **Offline Mode**: Work without internet?
   - **Recommendation**: Yes, all LocalStorage-based

---

**Ready to implement!** Start with MVP Knowledge-level quiz → iterate based on user feedback.
