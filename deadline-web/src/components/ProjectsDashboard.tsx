import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Settings, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { CreateProjectData } from '@/types/project';
import { useProjects } from '@/contexts/ProjectContext';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

export function ProjectsDashboard() {
  const navigate = useNavigate();
  const { projects, createProject, loading } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState<CreateProjectData>({
    name: '',
    description: '',
  });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Filter projects based on search query
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle new project creation
  const handleCreateProject = async () => {
    if (!newProjectData.name.trim()) return;

    try {
      const newProject = await createProject(newProjectData);
      setNewProjectData({ name: '', description: '' });
      setIsNewProjectModalOpen(false);

      // Play creation sound
      horrorAudio.playClick();

      // Navigate to the new editor
      if (newProject) {
        navigate(`/write/${newProject.id}`);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Disable scrolling on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,69,19,0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Navigation Bar */}
        <header className="flex-none border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/hub" className="flex items-center space-x-2 group">
              <h1 className="text-2xl font-bold text-zinc-100 font-['Creepster'] tracking-wider group-hover:text-orange-400 transition-colors">
                DEADLINE
              </h1>
            </Link>

            {/* Center: Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => {
                  setIsNewProjectModalOpen(true);
                  horrorAudio.playHover();
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
                onMouseEnter={() => horrorAudio.playHover()}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>

              <Link to="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                  onMouseEnter={() => horrorAudio.playHover()}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-zinc-100 mb-2 font-['Cinzel']">
                Your Projects
              </h1>
              <p className="text-zinc-400 font-['Cinzel']">
                Manage your dark literary creations
              </p>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                  {searchQuery ? 'No projects found' : 'No projects yet'}
                </h3>
                <p className="text-zinc-500 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Create your first project to begin your dark literary journey'
                  }
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setIsNewProjectModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onMouseEnter={() => horrorAudio.playHover()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/write/${project.id}`}
                    className="block group"
                    onMouseEnter={() => {
                      setHoveredCard(project.id);
                      horrorAudio.playHover();
                    }}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Card className={`
                      bg-zinc-800 border-zinc-700 hover:border-orange-500 transition-all duration-300 h-full
                      ${hoveredCard === project.id ? 'shadow-lg shadow-orange-500/20 transform -translate-y-1' : ''}
                    `}>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-zinc-100 mb-2 font-['Cinzel'] group-hover:text-orange-400 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-zinc-400 text-sm truncate mb-4 font-['Cinzel']">
                          {project.description}
                        </p>
                      </CardContent>

                      <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>
                            {project.documents.length} {project.documents.length === 1 ? 'document' : 'documents'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(project.lastEdited)}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* New Project Modal */}
      <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
        <DialogContent>
          <DialogClose onClick={() => setIsNewProjectModalOpen(false)} />
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Begin a new dark literary creation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium text-zinc-300 mb-2">
                Project Name
              </label>
              <Input
                id="project-name"
                type="text"
                placeholder="Enter project name..."
                value={newProjectData.name}
                onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>

            <div>
              <label htmlFor="project-description" className="block text-sm font-medium text-zinc-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="project-description"
                placeholder="Describe your project..."
                value={newProjectData.description}
                onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsNewProjectModalOpen(false)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectData.name.trim() || loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}