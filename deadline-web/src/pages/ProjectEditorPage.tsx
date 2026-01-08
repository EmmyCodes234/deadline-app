import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { DocumentEditor } from '../components/DocumentEditor';
import { useProjects } from '@/contexts/ProjectContext';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

export const ProjectEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProject, getProject, loading } = useProjects();

  useEffect(() => {
    if (id) {
      getProject(id);
    }
  }, [id, getProject]);

  const handleBackToProjects = () => {
    horrorAudio.playClick();
    navigate('/projects');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-zinc-400 font-['Cinzel']">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4 font-['Cinzel']">Project Not Found</h1>
          <p className="text-zinc-400 mb-6 font-['Cinzel']">The project you're looking for doesn't exist.</p>
          <button
            onClick={handleBackToProjects}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
            onMouseEnter={() => horrorAudio.playHover()}
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Project Header - Fixed height, no positioning */}
      <header className="h-14 bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800">
        <div className="px-6 py-3 flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToProjects}
              className="p-2 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              onMouseEnter={() => horrorAudio.playHover()}
              title="Back to Projects"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className="text-lg font-bold text-zinc-100 font-['Cinzel']">
                {currentProject.name}
              </h1>
              <p className="text-sm text-zinc-400 font-['Cinzel']">
                {currentProject.documents.length} {currentProject.documents.length === 1 ? 'document' : 'documents'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              onMouseEnter={() => horrorAudio.playHover()}
              title="Project Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Workspace - Takes remaining space */}
      <div className="flex-1 flex flex-row">
        <DocumentEditor />
      </div>
    </div>
  );
};