import { ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { horrorAudio } from '@/lib/audio/HorrorAudio';
import { useSettings } from '@/contexts/SettingsContext';

export function AbjurationsPage() {
  // Use settings context
  const {
    typewriterSounds,
    setTypewriterSounds,
    ghostMode,
    setGhostMode,
    ambientNoise,
    setAmbientNoise,
    fontFace,
    setFontFace,
    fontSize,
    setFontSize,
    resetAllSettings,
  } = useSettings();

  const handleDeleteAllData = () => {
    // Play horror sound effect
    horrorAudio.playGrowl();
    
    // Show confirmation (in a real app, you'd use a proper modal)
    if (window.confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      // Reset all settings and clear localStorage
      resetAllSettings();
      localStorage.clear();
      
      // Show success message
      alert('All data has been purged from the void.');
    }
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-[#e5e5e5] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <Link 
          to="/hub" 
          className="flex items-center gap-2 text-zinc-400 hover:text-[#e5e5e5] transition-colors"
          onClick={() => horrorAudio.playClick()}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>
        
        <h1 
          className="text-3xl font-bold text-center flex-1"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Abjurations
        </h1>
        
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      {/* Container */}
      <div className="flex-1 max-w-4xl mx-auto px-6 py-2 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          
          {/* Atmosphere Section */}
          <Card className="bg-[#121212] border-zinc-800 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#e5e5e5] text-base font-semibold">
                Atmosphere
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Typewriter Sounds */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#e5e5e5] font-medium text-sm">Typewriter Sounds</h3>
                  <p className="text-xs text-zinc-400">Mechanical typing sounds</p>
                </div>
                <Switch
                  checked={typewriterSounds}
                  onCheckedChange={setTypewriterSounds}
                  className="data-[state=checked]:bg-[#f97316]"
                />
              </div>

              {/* Ghost Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#e5e5e5] font-medium text-sm">Ghost Mode</h3>
                  <p className="text-xs text-zinc-400">Enhanced focus mode</p>
                </div>
                <Switch
                  checked={ghostMode}
                  onCheckedChange={setGhostMode}
                  className="data-[state=checked]:bg-[#f97316]"
                />
              </div>

              {/* Ambient Noise */}
              <div className="space-y-2">
                <h3 className="text-[#e5e5e5] font-medium text-sm">Ambient Noise</h3>
                <Select value={ambientNoise} onValueChange={setAmbientNoise}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-[#e5e5e5] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Silence">Silence</SelectItem>
                    <SelectItem value="Rain">Rain</SelectItem>
                    <SelectItem value="Crypt">Crypt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inscription Section */}
          <Card className="bg-[#121212] border-zinc-800 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#e5e5e5] text-base font-semibold">
                Inscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Font Face */}
              <div className="space-y-2">
                <h3 className="text-[#e5e5e5] font-medium text-sm">Font Face</h3>
                <Select value={fontFace} onValueChange={setFontFace}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-[#e5e5e5] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Serif">Serif</SelectItem>
                    <SelectItem value="Mono">Mono</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#e5e5e5] font-medium text-sm">Font Size</h3>
                  <span className="text-xs text-zinc-400">{fontSize}px</span>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* The Void Section - Danger Zone */}
          <Card className="bg-[#121212] border-red-900/50 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#e5e5e5] text-base font-semibold">
                The Void
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center h-full">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-[#e5e5e5] font-medium text-sm mb-1">Delete All Data</h3>
                  <p className="text-xs text-zinc-400">Permanently erase all stored information</p>
                </div>
                <button
                  onClick={handleDeleteAllData}
                  className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-colors rounded-md mx-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Purge</span>
                </button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}