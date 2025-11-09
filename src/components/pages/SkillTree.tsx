import { useState, useEffect } from 'react';
import { Lock, CheckCircle2, Circle, BookOpen, Target, Clock, TrendingUp, Award, ExternalLink, Lightbulb, Code } from 'lucide-react';
import { LearningResourceManager } from '../LearningResourceManager';

// Import all specialization data statically
import aiMachineLearningData from '../../data/ai_and_machine_learning.json';
import cloudComputingData from '../../data/cloud_computing.json';
import cyberSecurityData from '../../data/cyber_security.json';
import dataScienceBigDataData from '../../data/data_science_and_big_data.json';
import softwareEngineerData from '../../data/software_engineer.json';

interface SkillNode {
  id: string;
  label: string;
  fullName: string;
  status: 'unlocked' | 'available' | 'locked';
  level: number;
  x: number;
  y: number;
  connections: string[];
  nodeData: any; // Full node data from JSON
}

interface SpecializationData {
  id: string;
  name: string;
  type: string;
  fileName: string;
  icon: string;
  color: string;
  data?: any[];
}

// Data mapping for static imports
const SPECIALIZATION_DATA_MAP: Record<string, any> = {
  'ai_ml': aiMachineLearningData,
  'cloud': cloudComputingData,
  'security': cyberSecurityData,
  'data_science': dataScienceBigDataData,
  'software_eng': softwareEngineerData
};

const SPECIALIZATIONS: SpecializationData[] = [
  {
    id: 'ai_ml',
    name: 'AI & Machine Learning',
    type: 'specialization',
    fileName: 'ai_and_machine_learning.json',
    icon: '🤖',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    type: 'specialization',
    fileName: 'cloud_computing.json',
    icon: '☁️',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'security',
    name: 'Cyber Security',
    type: 'specialization',
    fileName: 'cyber_security.json',
    icon: '🔒',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'data_science',
    name: 'Data Science & Big Data',
    type: 'specialization',
    fileName: 'data_science_and_big_data.json',
    icon: '📊',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'software_eng',
    name: 'Software Engineering',
    type: 'specialization',
    fileName: 'software_engineer.json',
    icon: '💻',
    color: 'from-indigo-500 to-violet-500'
  }
];

export function SkillTree() {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<SpecializationData | null>(null);
  const [showTree, setShowTree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [visibleLevels, setVisibleLevels] = useState<number[]>([0, 1, 2, 3]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [focusedBranch, setFocusedBranch] = useState<{
    abilityId?: string;
    skillId?: string;
  } | null>(null);

  useEffect(() => {
    // Data is loaded on-demand when user selects a specialization
  }, []);

  const convertSpecializationToNodes = (specializationData: any): SkillNode[] => {
    const nodes: SkillNode[] = [];
    let currentX = 0;
    
    // Add specialization as root node (level 0) - top center
    const rootNode: SkillNode = {
      id: specializationData.id,
      label: specializationData.name.length > 20 ? specializationData.name.substring(0, 20) + '...' : specializationData.name,
      fullName: specializationData.name,
      status: 'unlocked',
      level: 0,
      x: 50,
      y: 5,
      connections: [],
      nodeData: specializationData
    };
    nodes.push(rootNode);

    // Process abilities as level 1
    if (specializationData.children) {
      const abilities = specializationData.children;
      const totalAbilities = abilities.length;
      
      abilities.forEach((ability: any, abilityIndex: number) => {
        // Distribute abilities horizontally with better spacing
        const abilityX = ((abilityIndex + 1) / (totalAbilities + 1)) * 100;
        
        const abilityNode: SkillNode = {
          id: ability.id,
          label: ability.name.length > 15 ? ability.name.substring(0, 15) + '...' : ability.name,
          fullName: ability.name,
          status: 'unlocked',
          level: 1,
          x: abilityX,
          y: 20,
          connections: [],
          nodeData: ability
        };
        nodes.push(abilityNode);
        rootNode.connections.push(ability.id);

        // Process skills as level 2
        if (ability.children) {
          const skills = ability.children;
          const totalSkills = skills.length;
          
          // Calculate the width allocated to this ability branch
          const branchWidth = 100 / totalAbilities;
          const branchStart = abilityIndex * branchWidth;
          
          skills.forEach((skill: any, skillIndex: number) => {
            // Spread skills within the branch width
            const skillX = branchStart + ((skillIndex + 1) / (totalSkills + 1)) * branchWidth;
            
            const skillNode: SkillNode = {
              id: skill.id,
              label: skill.name.length > 12 ? skill.name.substring(0, 12) + '...' : skill.name,
              fullName: skill.name,
              status: skillIndex < Math.ceil(skills.length * 0.7) ? 'available' : 'locked',
              level: 2,
              x: skillX,
              y: 40,
              connections: [],
              nodeData: skill
            };
            nodes.push(skillNode);
            abilityNode.connections.push(skill.id);

            // Process knowledge as level 3
            if (skill.children) {
              const knowledges = skill.children;
              const totalKnowledge = knowledges.length;
              
              // Further subdivide for knowledge nodes
              const skillBranchWidth = branchWidth / totalSkills;
              const skillBranchStart = branchStart + (skillIndex * skillBranchWidth);
              
              knowledges.forEach((knowledge: any, knowledgeIndex: number) => {
                const knowledgeX = skillBranchStart + ((knowledgeIndex + 1) / (totalKnowledge + 1)) * skillBranchWidth;
                
                const knowledgeNode: SkillNode = {
                  id: knowledge.id,
                  label: knowledge.name.length > 10 ? knowledge.name.substring(0, 10) + '...' : knowledge.name,
                  fullName: knowledge.name,
                  status: knowledgeIndex < Math.ceil(knowledges.length * 0.3) ? 'available' : 'locked',
                  level: 3,
                  x: Math.max(0.5, Math.min(99.5, knowledgeX)),
                  y: 60,
                  connections: [],
                  nodeData: knowledge
                };
                nodes.push(knowledgeNode);
                skillNode.connections.push(knowledge.id);
              });
            }
          });
        }
      });
    }

    return nodes;
  };

  const selectSpecialization = (spec: SpecializationData) => {
    setLoading(true);
    try {
      // Get data from static imports
      const jsonData = SPECIALIZATION_DATA_MAP[spec.id];
      
      // The JSON file contains an array with one specialization object
      if (jsonData && jsonData.length > 0) {
        const specializationData = jsonData[0];
        const nodes = convertSpecializationToNodes(specializationData);
        setSkillNodes(nodes);
        setSelectedSpecialization(spec);
        setShowTree(true);
        setSelectedNode(null);
        setExpandedNodes(new Set());
        setFocusedBranch(null);
        setZoomLevel(1);
      }
    } catch (error) {
      console.error('Error loading specialization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const backToSelection = () => {
    setShowTree(false);
    setSelectedSpecialization(null);
    setSelectedNode(null);
    setSkillNodes([]);
    setExpandedNodes(new Set());
    setFocusedBranch(null);
  };

  // Recalculate positions for visible nodes to spread them out
  const repositionVisibleNodes = (nodes: SkillNode[]): SkillNode[] => {
    const repositioned = [...nodes];
    
    // Group by level
    const byLevel: Record<number, SkillNode[]> = {};
    repositioned.forEach(node => {
      if (!byLevel[node.level]) byLevel[node.level] = [];
      byLevel[node.level].push(node);
    });
    
    // Reposition each level
    Object.keys(byLevel).forEach(levelStr => {
      const level = parseInt(levelStr);
      const nodesAtLevel = byLevel[level];
      const count = nodesAtLevel.length;
      
      if (count === 1) {
        // Single node - center it
        nodesAtLevel[0].x = 50;
      } else {
        // Multiple nodes - spread evenly across width
        const spacing = 80 / (count + 1); // Use 80% of width with padding
        const startX = 10; // 10% padding from left
        
        nodesAtLevel.forEach((node, idx) => {
          node.x = startX + (spacing * (idx + 1));
        });
      }
    });
    
    return repositioned;
  };

  // Get visible nodes based on focused branch
  const getVisibleNodes = (): SkillNode[] => {
    // Safety check
    if (!skillNodes || skillNodes.length === 0) {
      return [];
    }

    if (!focusedBranch) {
      // Show all level 0 and 1 by default - use original positions
      return skillNodes.filter(node => node.level <= 1);
    }

    const visible: SkillNode[] = [];
    
    // Always show root
    const root = skillNodes.find(n => n.level === 0);
    if (root) visible.push({...root}); // Clone to avoid mutating original

    if (focusedBranch.skillId) {
      // Focused on a skill - show: root, parent ability, this skill, and its knowledge
      const skill = skillNodes.find(n => n.id === focusedBranch.skillId);
      if (skill) {
        visible.push({...skill});
        
        // Find parent ability: ability's connections contains this skill id
        const parentAbility = skillNodes.find(n => 
          n.level === 1 && n.connections && n.connections.includes(skill.id)
        );
        if (parentAbility) {
          visible.push({...parentAbility});
        }
        
        // Add all knowledge of this skill: skill's connections contains knowledge ids
        if (skill.connections && skill.connections.length > 0) {
          const knowledge = skillNodes.filter(n => 
            n.level === 3 && skill.connections.includes(n.id)
          );
          visible.push(...knowledge.map(n => ({...n})));
        }
      }
    } else if (focusedBranch.abilityId) {
      // Focused on an ability - show: root, this ability, and its skills
      const ability = skillNodes.find(n => n.id === focusedBranch.abilityId);
      if (ability) {
        visible.push({...ability});
        
        // Add all skills of this ability: ability's connections contains skill ids
        if (ability.connections && ability.connections.length > 0) {
          const skills = skillNodes.filter(n => 
            n.level === 2 && ability.connections.includes(n.id)
          );
          visible.push(...skills.map(n => ({...n})));
        }
      }
    }

    // Reposition nodes to spread them out
    const finalVisible = visible.length > 0 ? visible : (root ? [{...root}] : []);
    return repositionVisibleNodes(finalVisible);
  };

  // Handle node click for expand/collapse
  const handleNodeClick = (node: SkillNode) => {
    try {
      setSelectedNode(node);

      if (node.level === 1) {
        // Clicked on ability
        if (focusedBranch?.abilityId === node.id) {
          // Collapse - back to showing all abilities
          setFocusedBranch(null);
        } else {
          // Expand this ability
          setFocusedBranch({ abilityId: node.id });
        }
      } else if (node.level === 2) {
        // Clicked on skill - expand to show knowledge
        // Find parent ability: ability's connections array contains this skill's id
        const parentAbility = skillNodes.find(n => 
          n.level === 1 && n.connections && n.connections.includes(node.id)
        );
        
        if (focusedBranch?.skillId === node.id) {
          // Collapse skill - back to showing ability's skills
          setFocusedBranch({ abilityId: parentAbility?.id });
        } else {
          // Expand this skill
          setFocusedBranch({ 
            abilityId: parentAbility?.id,
            skillId: node.id 
          });
        }
      } else if (node.level === 3) {
        // Clicked on knowledge - just select it
        // Keep current focus
      } else if (node.level === 0) {
        // Clicked on root - collapse all
        setFocusedBranch(null);
      }
    } catch (error) {
      console.error('Error in handleNodeClick:', error);
      // Fallback: just select the node without changing focus
      setSelectedNode(node);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unlocked':
        return 'from-teal-400 to-teal-600';
      case 'available':
        return 'from-violet-400 to-violet-600';
      default:
        return 'from-gray-300 to-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unlocked':
        return CheckCircle2;
      case 'available':
        return Circle;
      default:
        return Lock;
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-white via-violet-50/20 to-teal-50/20 p-8 overflow-auto">
      {!showTree ? (
        // Specialization Selection Screen
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Chọn Chuyên Ngành IT</h1>
            <p className="text-lg text-muted-foreground">
              Khám phá lộ trình học tập chi tiết cho 5 chuyên ngành công nghệ hàng đầu
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPECIALIZATIONS.map((spec) => (
              <button
                key={spec.id}
                onClick={() => selectSpecialization(spec)}
                disabled={loading}
                className="group p-8 rounded-2xl border-2 border-border bg-white hover:border-violet-400 hover:shadow-2xl transition-all duration-300 text-left transform hover:-translate-y-1"
              >
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${spec.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <span className="text-3xl">
                      {spec.icon}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-violet-700">
                  {spec.name}
                </h3>
                
                <div className="mt-6 inline-flex items-center text-violet-600 font-semibold group-hover:text-violet-700">
                  Khám phá skill tree
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
          
          {loading && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 shadow-2xl">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-foreground font-medium">Đang tải skill tree...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Skill Tree View
        <div className="w-[95%] max-w-[1800px] mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <button
                onClick={backToSelection}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại chọn chuyên ngành
              </button>
              <h1 className="text-2xl font-bold text-foreground mb-2">{selectedSpecialization?.name}</h1>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Cách sử dụng:</strong> Click vào Ability để xem Skills → Click vào Skill để xem Knowledge chi tiết
                </p>
                <p className="text-sm text-muted-foreground">
                  Click lại vào node đang mở để thu gọn. Dùng nút "Thu gọn tất cả" để reset về view ban đầu.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Tree Visualization */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              {/* Controls */}
              <div className="p-4 bg-gray-50 border-b border-border flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">Hiển thị level:</span>
                  {[0, 1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        if (visibleLevels.includes(level)) {
                          setVisibleLevels(visibleLevels.filter(l => l !== level));
                        } else {
                          setVisibleLevels([...visibleLevels, level].sort());
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        visibleLevels.includes(level)
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {level === 0 ? 'Root' : level === 1 ? 'Ability' : level === 2 ? 'Skill' : 'Knowledge'}
                    </button>
                  ))}
                  <div className="h-4 w-px bg-gray-300 mx-1"></div>
                  <button
                    onClick={() => setVisibleLevels([0, 1, 2, 3])}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors"
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setVisibleLevels([0])}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                  >
                    Thu gọn
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFocusedBranch(null)}
                    className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    🔄 Thu gọn tất cả
                  </button>
                  
                  <div className="h-4 w-px bg-gray-300"></div>
                  
                  <span className="text-sm font-medium text-foreground">Zoom:</span>
                  <button
                    onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.2))}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm text-muted-foreground w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.2))}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="px-3 py-1 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Reset Zoom
                  </button>
                </div>
              </div>
              
              {/* Info bar */}
              <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-violet-50 border-b border-blue-100 flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Hiển thị {getVisibleNodes().filter(n => visibleLevels.includes(n.level)).length}/{skillNodes.length} nodes
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-violet-700 font-medium">💡 Click node có dấu <span className="inline-flex items-center justify-center w-4 h-4 bg-green-500 text-white rounded-full text-[10px] font-bold mx-1">+</span> để xem chi tiết</span>
                </div>
              </div>
              
              {/* SVG Canvas */}
              <div className="p-4 overflow-auto h-[calc(100vh-25rem)]">
                <div className="relative w-full h-full" style={{ minWidth: '1200px', minHeight: '900px' }}>
                  <svg 
                    className="w-full h-full" 
                    viewBox="0 0 100 70" 
                    preserveAspectRatio="xMidYMid meet"
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                  >
                  {/* Gradient definitions */}
                  <defs>
                    {skillNodes.map((node) => (
                      <linearGradient key={`${node.id}-gradient`} id={`${node.id}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={node.status === 'unlocked' ? '#14b8a6' : node.status === 'available' ? '#8b5cf6' : '#9ca3af'} />
                        <stop offset="100%" stopColor={node.status === 'unlocked' ? '#0891b2' : node.status === 'available' ? '#7c3aed' : '#6b7280'} />
                      </linearGradient>
                    ))}
                  </defs>

                  {/* Connection Lines */}
                  {(() => {
                    const visibleNodes = getVisibleNodes();
                    const visibleNodesMap = new Map(visibleNodes.map(n => [n.id, n]));
                    
                    return visibleNodes
                      .filter(node => visibleLevels.includes(node.level))
                      .flatMap((node) =>
                        node.connections.map((targetId) => {
                          // Find target in repositioned visible nodes, not original skillNodes
                          const target = visibleNodesMap.get(targetId);
                          if (!target || !visibleLevels.includes(target.level)) return null;
                      
                          const isUnlocked = node.status === 'unlocked' && (target.status === 'unlocked' || target.status === 'available');
                          
                          return (
                            <line
                              key={`${node.id}-${targetId}`}
                              x1={node.x}
                              y1={node.y}
                              x2={target.x}
                              y2={target.y}
                              stroke={isUnlocked ? '#8b5cf6' : '#d4d4d8'}
                              strokeWidth="0.3"
                              strokeDasharray={isUnlocked ? '0' : '1,1'}
                              opacity={isUnlocked ? 0.6 : 0.3}
                            />
                          );
                        })
                      );
                  })()}

                  {/* Skill Nodes */}
                  {getVisibleNodes()
                    .filter(node => visibleLevels.includes(node.level))
                    .map((node) => {
                    const Icon = getStatusIcon(node.status);
                    const isSelected = selectedNode?.id === node.id;
                    const hasChildren = node.connections.length > 0;
                    const isExpanded = (node.level === 1 && focusedBranch?.abilityId === node.id) || 
                                      (node.level === 2 && focusedBranch?.skillId === node.id);
                    
                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={() => handleNodeClick(node)}
                        className="cursor-pointer"
                        style={{ transition: 'all 0.3s' }}
                      >
                        {/* Outer ring for selected */}
                        {isSelected && (
                          <circle
                            r="4"
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="0.4"
                            opacity="0.5"
                          />
                        )}
                        
                        {/* Node circle */}
                        <circle
                          r="2"
                          fill={`url(#${node.id}-gradient)`}
                          className={`${node.status !== 'locked' ? 'hover:opacity-80' : ''} transition-opacity`}
                        />
                        
                        {/* Expand/Collapse indicator */}
                        {hasChildren && (node.level === 1 || node.level === 2) && (
                          <circle
                            cx="2.5"
                            cy="-2.5"
                            r="1"
                            fill={isExpanded ? '#f59e0b' : '#10b981'}
                            stroke="white"
                            strokeWidth="0.2"
                          />
                        )}
                        
                        {/* Plus/Minus icon */}
                        {hasChildren && (node.level === 1 || node.level === 2) && (
                          <text
                            x="2.5"
                            y="-1.8"
                            textAnchor="middle"
                            className="pointer-events-none select-none"
                            style={{ fontSize: '1.2px', fill: 'white', fontWeight: 'bold' }}
                          >
                            {isExpanded ? '−' : '+'}
                          </text>
                        )}
                        
                        {/* Label */}
                        <text
                          y="4"
                          textAnchor="middle"
                          className="pointer-events-none select-none"
                          style={{ fontSize: '1.8px', fill: '#3f3f46', fontWeight: '500' }}
                        >
                          {node.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                </div>
              </div>
            </div>

            {/* Skill Details Sidebar */}
            <div className="space-y-4 h-[calc(100vh-16rem)] overflow-y-auto">
              {selectedNode ? (
                <div className="bg-white rounded-xl border border-border shadow-lg h-full">
                  {/* Header */}
                  <div className={`p-6 bg-gradient-to-br ${getStatusColor(selectedNode.status)} text-white rounded-t-xl`}>
                    <div className="flex items-center gap-3 mb-2">
                      {(() => {
                        const Icon = getStatusIcon(selectedNode.status);
                        return <Icon className="w-6 h-6" />;
                      })()}
                      <span className="text-sm font-medium uppercase tracking-wide">
                        {selectedNode.nodeData.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{selectedNode.fullName}</h3>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Description */}
                    {selectedNode.nodeData.description && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-violet-600" />
                          <h4 className="font-semibold text-foreground">Mô tả</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {selectedNode.nodeData.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedNode.nodeData.difficultyLevel && (
                        <div className="bg-violet-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-violet-600" />
                            <span className="text-xs font-medium text-violet-900">Độ khó</span>
                          </div>
                          <p className="text-sm font-semibold text-violet-700">
                            {selectedNode.nodeData.difficultyLevel}
                          </p>
                        </div>
                      )}
                      
                      {selectedNode.nodeData.estimatedTimeToComplete && (
                        <div className="bg-teal-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-teal-600" />
                            <span className="text-xs font-medium text-teal-900">Thời gian</span>
                          </div>
                          <p className="text-sm font-semibold text-teal-700">
                            {selectedNode.nodeData.estimatedTimeToComplete}
                          </p>
                        </div>
                      )}
                      
                      {selectedNode.nodeData.importanceScore && (
                        <div className="bg-amber-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-medium text-amber-900">Điểm quan trọng</span>
                          </div>
                          <p className="text-sm font-semibold text-amber-700">
                            {selectedNode.nodeData.importanceScore}/10
                          </p>
                        </div>
                      )}
                      
                      {selectedNode.nodeData.marketDemand && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-medium text-green-900">Nhu cầu thị trường</span>
                          </div>
                          <p className="text-sm font-semibold text-green-700">
                            {selectedNode.nodeData.marketDemand}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Tools */}
                    {selectedNode.nodeData.tools && selectedNode.nodeData.tools.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Code className="w-4 h-4 text-violet-600" />
                          <h4 className="font-semibold text-foreground">Công cụ</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedNode.nodeData.tools.map((tool: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Keywords */}
                    {selectedNode.nodeData.keywords && selectedNode.nodeData.keywords.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-violet-600" />
                          <h4 className="font-semibold text-foreground">Từ khóa</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedNode.nodeData.keywords.slice(0, 8).map((keyword: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Learning Resources */}
                    {selectedNode.nodeData.learningResources && selectedNode.nodeData.learningResources.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <ExternalLink className="w-4 h-4 text-violet-600" />
                          <h4 className="font-semibold text-foreground">Tài liệu học tập</h4>
                        </div>
                        <div className="space-y-3">
                          {selectedNode.nodeData.learningResources.map((resource: any, idx: number) => {
                            // Handle both string and object formats
                            const resourceName = typeof resource === 'string' ? resource : (resource.name || resource.title || resource.url || 'Tài liệu học tập');
                            const resourceUrl = typeof resource === 'string' ? resource : (resource.url || '#');
                            
                            return (
                              <LearningResourceManager
                                key={idx}
                                resourceUrl={resourceUrl}
                                resourceName={resourceName}
                                nodeId={selectedNode.id}
                                nodeName={selectedNode.fullName}
                                specializationId={selectedSpecialization?.id || ''}
                                specializationName={selectedSpecialization?.name || ''}
                                estimatedTime={selectedNode.nodeData.estimatedTimeToComplete}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Project Ideas */}
                    {selectedNode.nodeData.projectIdeas && selectedNode.nodeData.projectIdeas.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-violet-600" />
                          <h4 className="font-semibold text-foreground">Ý tưởng dự án</h4>
                        </div>
                        <ul className="space-y-3">
                          {selectedNode.nodeData.projectIdeas.slice(0, 3).map((idea: any, idx: number) => (
                            <li key={idx} className="pl-4 border-l-2 border-violet-300">
                              {typeof idea === 'string' ? (
                                <p className="text-sm text-muted-foreground">{idea}</p>
                              ) : (
                                <div>
                                  <p className="text-sm font-medium text-foreground mb-1">{idea.title}</p>
                                  <p className="text-xs text-muted-foreground">{idea.description}</p>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="pt-4 space-y-2">
                      {selectedNode.status === 'available' && (
                        <button className="w-full bg-gradient-to-r from-violet-600 to-teal-500 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity font-semibold">
                          Bắt đầu học
                        </button>
                      )}
                      
                      {selectedNode.status === 'unlocked' && (
                        <button className="w-full border-2 border-violet-600 text-violet-600 py-3 px-4 rounded-lg hover:bg-violet-50 transition-colors font-semibold">
                          Ôn tập lại
                        </button>
                      )}
                      
                      {selectedNode.status === 'locked' && (
                        <div className="text-center py-3 text-muted-foreground text-sm">
                          Hoàn thành các kỹ năng trước để mở khóa
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-border p-8 shadow-sm text-center">
                  <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-violet-600" />
                  </div>
                  <p className="text-muted-foreground">
                    Chọn một node để xem chi tiết
                  </p>
                </div>
              )}

              {/* Legend */}
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <h4 className="text-foreground mb-4">Legend</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-400 to-teal-600"></div>
                    <span className="text-muted-foreground">Unlocked</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-400 to-violet-600"></div>
                    <span className="text-muted-foreground">Available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                    <span className="text-muted-foreground">Locked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
