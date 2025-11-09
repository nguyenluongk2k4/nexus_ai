import { useState } from 'react';
import { MessageSquare, Eye, User, PenSquare, Bot, Code, Database } from 'lucide-react';

interface ForumPost {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  category: string;
  categoryColor: string;
  excerpt: string;
  comments: number;
  views: string;
  timestamp: string;
}

interface ForumProps {
  onNavigateToSubForum?: (category: string) => void;
  onNavigateToThread?: (postId: number) => void;
}

export function Forum({ onNavigateToSubForum, onNavigateToThread }: ForumProps) {
  const [posts] = useState<ForumPost[]>([
    {
      id: 1,
      title: "Thảo luận về mô hình GPT-4 và ứng dụng trong thực tế",
      author: "Nguyễn Văn A",
      authorAvatar: "👨‍💻",
      category: "AI",
      categoryColor: "from-violet-500 to-purple-600",
      excerpt: "GPT-4 đã mang lại nhiều cải tiến đáng kể so với các phiên bản trước. Chúng ta hãy cùng thảo luận về các ứng dụng thực tế...",
      comments: 15,
      views: "2.5k",
      timestamp: "2 giờ trước"
    },
    {
      id: 2,
      title: "Hướng dẫn tối ưu React Performance với useMemo và useCallback",
      author: "Trần Thị B",
      authorAvatar: "👩‍💻",
      category: "Software",
      categoryColor: "from-blue-500 to-cyan-600",
      excerpt: "Trong bài viết này, tôi sẽ chia sẻ các kỹ thuật tối ưu performance cho React application bằng cách sử dụng hooks...",
      comments: 23,
      views: "3.2k",
      timestamp: "4 giờ trước"
    },
    {
      id: 3,
      title: "Phân tích dữ liệu lớn với Apache Spark và Python",
      author: "Lê Văn C",
      authorAvatar: "🧑‍💼",
      category: "Data Analysis",
      categoryColor: "from-orange-500 to-red-600",
      excerpt: "Apache Spark là framework mạnh mẽ cho xử lý dữ liệu lớn. Hãy cùng tìm hiểu cách tích hợp với Python...",
      comments: 12,
      views: "1.8k",
      timestamp: "5 giờ trước"
    },
    {
      id: 4,
      title: "Machine Learning Deployment Best Practices 2024",
      author: "Phạm Thị D",
      authorAvatar: "👨‍🔬",
      category: "AI",
      categoryColor: "from-violet-500 to-purple-600",
      excerpt: "Triển khai ML models vào production đòi hỏi nhiều kỹ thuật và best practices. Tôi muốn chia sẻ kinh nghiệm...",
      comments: 31,
      views: "4.1k",
      timestamp: "6 giờ trước"
    },
    {
      id: 5,
      title: "TypeScript 5.0 - Những tính năng mới đáng chú ý",
      author: "Hoàng Văn E",
      authorAvatar: "👨‍🎓",
      category: "Software",
      categoryColor: "from-blue-500 to-cyan-600",
      excerpt: "TypeScript 5.0 đã được release với nhiều cải tiến về performance và developer experience...",
      comments: 18,
      views: "2.9k",
      timestamp: "8 giờ trước"
    },
    {
      id: 6,
      title: "Data Visualization với D3.js và React",
      author: "Vũ Thị F",
      authorAvatar: "👩‍🎨",
      category: "Data Analysis",
      categoryColor: "from-orange-500 to-red-600",
      excerpt: "Tạo các biểu đồ tương tác đẹp mắt bằng D3.js trong React application của bạn...",
      comments: 9,
      views: "1.5k",
      timestamp: "1 ngày trước"
    },
    {
      id: 7,
      title: "Neural Networks từ cơ bản đến nâng cao",
      author: "Đặng Văn G",
      authorAvatar: "🧑‍🏫",
      category: "AI",
      categoryColor: "from-violet-500 to-purple-600",
      excerpt: "Cùng tìm hiểu chi tiết về cách neural networks hoạt động, từ perceptron đơn giản đến deep learning...",
      comments: 27,
      views: "5.3k",
      timestamp: "1 ngày trước"
    }
  ]);

  const categories = [
    {
      id: 'ai',
      name: 'Trí tuệ Nhân tạo (AI)',
      icon: Bot,
      color: 'from-violet-500 to-purple-600',
      description: 'Machine Learning, Deep Learning, NLP'
    },
    {
      id: 'software',
      name: 'Phát triển Phần mềm',
      icon: Code,
      color: 'from-blue-500 to-cyan-600',
      description: 'Web, Mobile, Desktop Development'
    },
    {
      id: 'data',
      name: 'Phân tích Dữ liệu',
      icon: Database,
      color: 'from-orange-500 to-red-600',
      description: 'Data Science, Analytics, Visualization'
    }
  ];

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-accent/20">
      <div className="max-w-[1400px] mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500">
            Diễn Đàn Công Nghệ
          </h1>
          <p className="text-muted-foreground">
            Nơi chia sẻ kiến thức và kinh nghiệm về Công nghệ thông tin
          </p>
        </div>

        {/* Main Layout - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          {/* Left Column - Latest Posts Feed */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-violet-600" />
              Bài viết mới nhất
            </h2>

            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-border cursor-pointer"
                  onClick={() => onNavigateToThread?.(post.id)}
                >
                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-teal-100 flex items-center justify-center text-xl">
                      {post.authorAvatar}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                    <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${post.categoryColor}`}>
                      {post.category}
                    </span>
                  </div>

                  {/* Post Title */}
                  <h3 className="text-xl font-bold mb-2 hover:text-violet-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Post Excerpt */}
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Post Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments} bình luận</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views} lượt xem</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Categories & Actions */}
          <div className="space-y-4">
            {/* Create Post Button */}
            <button className="w-full bg-gradient-to-r from-violet-600 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <PenSquare className="w-5 h-5" />
              Tạo bài viết mới
            </button>

            {/* Categories Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
              <h3 className="text-lg font-bold mb-4">Danh mục Diễn đàn</h3>
              <div className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => onNavigateToSubForum?.(category.id)}
                      className="w-full flex items-start gap-3 p-4 rounded-lg hover:bg-accent transition-all text-left group"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm mb-1 group-hover:text-violet-600 transition-colors">
                          {category.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {category.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-violet-50 to-teal-50 rounded-xl p-6 border border-violet-100">
              <h3 className="text-lg font-bold mb-4">Thống kê diễn đàn</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tổng bài viết</span>
                  <span className="font-bold text-violet-600">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Thành viên</span>
                  <span className="font-bold text-violet-600">5,678</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Trực tuyến</span>
                  <span className="font-bold text-teal-600">142</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
