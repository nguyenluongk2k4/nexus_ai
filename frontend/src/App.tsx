import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Landing } from './components/pages/Landing';
import { Dashboard } from './components/pages/Dashboard';
import { SkillTree } from './components/pages/SkillTree';
import { Quiz } from './components/pages/Quiz';
import { JobRecommendation } from './components/pages/JobRecommendation';
import { LearningInsights } from './components/pages/LearningInsights';
import { Chat } from './components/pages/Chat';
import { Forum } from './components/pages/Forum';
import { SubForum } from './components/pages/SubForum';
import { ThreadDetail } from './components/pages/ThreadDetail';
import { Timeline } from './components/pages/Timeline';
import { LearningProgressProvider } from './contexts/LearningProgressContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [forumCategory, setForumCategory] = useState('ai');
  const [threadId, setThreadId] = useState(1);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'skilltree':
        return <SkillTree />;
      case 'quiz':
        return <Quiz />;
      case 'jobs':
        return <JobRecommendation />;
      case 'insights':
        return <LearningInsights />;
      case 'timeline':
        return <Timeline />;
      case 'chat':
        return <Chat />;
      case 'forum':
        return (
          <Forum
            onNavigateToSubForum={(category) => {
              setForumCategory(category);
              setCurrentPage('subforum');
            }}
            onNavigateToThread={(id) => {
              setThreadId(id);
              setCurrentPage('thread');
            }}
          />
        );
      case 'subforum':
        return (
          <SubForum
            category={forumCategory}
            onNavigateToForum={() => setCurrentPage('forum')}
            onNavigateToThread={(id) => {
              setThreadId(id);
              setCurrentPage('thread');
            }}
          />
        );
      case 'thread':
        return (
          <ThreadDetail
            threadId={threadId}
            onNavigateToForum={() => setCurrentPage('forum')}
            onNavigateToSubForum={() => setCurrentPage('subforum')}
          />
        );
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  if (currentPage === 'landing') {
    return <Landing onNavigate={setCurrentPage} />;
  }

  return (
    <LearningProgressProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}
      </div>
    </LearningProgressProvider>
  );
}
