
import React, { useState } from 'react';
import { generateScript, generateThumbnail, generateVoiceover, generateVideoClip, analyzeMoodAndMusic } from '../services/geminiService';
import { uploadToYouTube, scheduleVideo } from '../services/youtubeService';

const VideoCreator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('Productivity & Motivation');
  const [scheduleTime, setScheduleTime] = useState('18:00');
  const [addMusic, setAddMusic] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [progress, setProgress] = useState<{ step: string; status: 'idle' | 'loading' | 'done' | 'error' }[]>([
    { step: 'AI Script Generation', status: 'idle' },
    { step: 'Voiceover Synthesis', status: 'idle' },
    { step: 'Mood & Music Selection', status: 'idle' },
    { step: 'Thumbnail Creation', status: 'idle' },
    { step: 'Scene Assembly (Veo)', status: 'idle' },
    { step: 'YouTube Upload & Scheduling', status: 'idle' },
  ]);

  const [result, setResult] = useState<{
    script?: any;
    thumbnail?: string;
    audioUrl?: string;
    videoUrl?: string;
    youtubeUrl?: string;
    musicInfo?: { mood: string; genre: string; tempo: string };
  }>({});

  const checkAndRequestKey = async () => {
    const studio = (window as any).aistudio;
    if (studio) {
      const hasKey = await studio.hasSelectedApiKey();
      if (!hasKey) {
        await studio.openSelectKey();
      }
    }
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setResult({});
    
    setProgress([
      { step: 'AI Script Generation', status: 'idle' },
      { step: 'Voiceover Synthesis', status: 'idle' },
      { step: 'Mood & Music Selection', status: 'idle' },
      { step: 'Thumbnail Creation', status: 'idle' },
      { step: 'Scene Assembly (Veo)', status: 'idle' },
      { step: 'YouTube Upload & Scheduling', status: 'idle' },
    ]);

    try {
      // Step 1: Script
      setProgress(p => p.map((s, i) => i === 0 ? { ...s, status: 'loading' } : s));
      const script = await generateScript(niche, topic);
      setResult(prev => ({ ...prev, script }));
      setProgress(p => p.map((s, i) => i === 0 ? { ...s, status: 'done' } : s));

      // Step 2: Voiceover
      setProgress(p => p.map((s, i) => i === 1 ? { ...s, status: 'loading' } : s));
      const audioBase64 = await generateVoiceover(script.body);
      const audioUrl = `data:audio/pcm;base64,${audioBase64}`;
      setResult(prev => ({ ...prev, audioUrl }));
      setProgress(p => p.map((s, i) => i === 1 ? { ...s, status: 'done' } : s));

      // Step 3: Music Selection
      setProgress(p => p.map((s, i) => i === 2 ? { ...s, status: 'loading' } : s));
      let musicInfo = null;
      if (addMusic) {
        musicInfo = await analyzeMoodAndMusic(script.body);
        setResult(prev => ({ ...prev, musicInfo }));
      }
      setProgress(p => p.map((s, i) => i === 2 ? { ...s, status: 'done' } : s));

      // Step 4: Thumbnail
      setProgress(p => p.map((s, i) => i === 3 ? { ...s, status: 'loading' } : s));
      const thumb = await generateThumbnail(script.title);
      setResult(prev => ({ ...prev, thumbnail: thumb }));
      setProgress(p => p.map((s, i) => i === 3 ? { ...s, status: 'done' } : s));

      // Step 5: Video Clip (Veo)
      setProgress(p => p.map((s, i) => i === 4 ? { ...s, status: 'loading' } : s));
      await checkAndRequestKey();
      
      const descriptivePrompt = `A high-quality cinematic scene for a YouTube video titled "${script.title}". 
      Visual style: Clean, professional, and matching the niche of ${niche}. 
      Key scene elements: ${script.hook.substring(0, 150)}. 
      Aesthetic: High contrast, vibrant colors, minimal text overlay. ${musicInfo ? `Mood: ${musicInfo.mood}, Genre: ${musicInfo.genre}.` : ''}`;
      
      const videoUrl = await generateVideoClip(descriptivePrompt);
      setResult(prev => ({ ...prev, videoUrl }));
      setProgress(p => p.map((s, i) => i === 4 ? { ...s, status: 'done' } : s));

      // Step 6: YouTube Upload & Scheduling
      setProgress(p => p.map((s, i) => i === 5 ? { ...s, status: 'loading' } : s));
      
      const uploadResult = await uploadToYouTube(videoUrl, {
        title: script.title,
        description: script.description,
        tags: script.tags,
        scheduleTime: scheduleTime
      });
      
      await scheduleVideo(uploadResult.videoId, scheduleTime);
      
      setResult(prev => ({ ...prev, youtubeUrl: uploadResult.url }));
      setProgress(p => p.map((s, i) => i === 5 ? { ...s, status: 'done' } : s));

    } catch (err) {
      console.error("Generation error:", err);
      setProgress(p => {
        const newProgress = [...p];
        const loadingIdx = newProgress.findIndex(s => s.status === 'loading');
        if (loadingIdx !== -1) newProgress[loadingIdx].status = 'error';
        return newProgress;
      });
      
      if (err instanceof Error && err.message.includes("Requested entity was not found")) {
        (window as any).aistudio?.openSelectKey();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Autopilot Creator</h1>
          <p className="text-gray-500">Define your topic, set your schedule, and let AI handle the rest.</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Channel Niche</label>
              <select 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              >
                <option>Productivity & Motivation</option>
                <option>Finance & Stocks</option>
                <option>True Crime & Mysteries</option>
                <option>Tech & Gadgets</option>
                <option>Health & Wellness</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Post Time (Daily)</label>
              <input 
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Background Music</p>
                <p className="text-xs text-gray-500">Auto-select royalty-free track</p>
              </div>
            </div>
            <button 
              onClick={() => setAddMusic(!addMusic)}
              className={`w-12 h-6 rounded-full transition-colors relative ${addMusic ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${addMusic ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Video Topic / Content Pillar</label>
            <textarea
              placeholder="e.g. The dark side of social media algorithms"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl h-24 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
              isGenerating || !topic ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                Running Autopilot Engine...
              </span>
            ) : 'Start Production Pipeline'}
          </button>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-gray-900 flex items-center justify-between">
            <span>Pipeline Activity</span>
            {isGenerating && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full animate-pulse">ACTIVE</span>}
          </h3>
          <div className="space-y-4">
            {progress.map((s, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  s.status === 'done' ? 'bg-green-100 text-green-600' : 
                  s.status === 'loading' ? 'bg-indigo-100 text-indigo-600' : 
                  s.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {s.status === 'done' ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${s.status === 'loading' ? 'text-indigo-600' : s.status === 'done' ? 'text-gray-900' : 'text-gray-400'}`}>
                      {s.step}
                    </span>
                    {s.status === 'loading' && (
                      <div className="animate-spin h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                    )}
                  </div>
                  {s.status === 'loading' && i === 4 && <p className="text-[10px] text-indigo-400 mt-0.5">Veo is rendering cinematic frames...</p>}
                  {s.status === 'loading' && i === 5 && <p className="text-[10px] text-indigo-400 mt-0.5">Authenticating with YouTube Data API...</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {result.youtubeUrl && (
          <div className="bg-green-50 border border-green-100 p-6 rounded-3xl shadow-sm text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-green-200">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-green-900">Successfully Scheduled!</h3>
            <p className="text-green-700 text-sm mt-1">Your video is live on YouTube at {scheduleTime}.</p>
            <a 
              href={result.youtubeUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-block mt-4 text-indigo-600 font-bold text-sm hover:underline"
            >
              View on YouTube Dashboard →
            </a>
          </div>
        )}

        {result.musicInfo && (
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl flex items-center justify-between">
             <div className="flex items-center space-x-3">
                <div className="text-indigo-600 animate-bounce">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 3v9.135A3.495 3.495 0 004 12c-1.933 0-3.5 1.567-3.5 3.5S2.067 19 4 19s3.5-1.567 3.5-3.5V5.48l9-1.8v8.455a3.495 3.495 0 00-2 0.135c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5 3.5-1.567 3.5-3.5V3z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-900 uppercase">Selected Audio Mood</p>
                  <p className="text-sm text-indigo-700">{result.musicInfo.mood} • {result.musicInfo.genre} ({result.musicInfo.tempo})</p>
                </div>
             </div>
             <div className="text-[10px] text-indigo-400 font-medium">Royalty Free</div>
          </div>
        )}

        {result.videoUrl && (
          <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm">
            <h3 className="font-bold mb-3 px-2 flex justify-between items-center text-sm">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Master Export
              </span>
              <div className="flex space-x-2">
                <a href={result.videoUrl} download="autopilot_export.mp4" className="text-xs bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">Download MP4</a>
              </div>
            </h3>
            <video 
              src={result.videoUrl} 
              controls 
              autoPlay 
              loop 
              className="w-full rounded-2xl aspect-video bg-black shadow-inner"
            />
          </div>
        )}

        {result.script && (
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm max-h-[600px] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                Script Output
              </div>
              <div className="flex space-x-1">
                {result.script.tags.map((t: string) => <span key={t} className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">#{t}</span>)}
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-6 leading-tight">
              {result.script.title}
            </h2>
            
            <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
              <section>
                <h4 className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-2">Hook (0:00 - 0:05)</h4>
                <p className="italic text-gray-900 text-base">{result.script.hook}</p>
              </section>
              
              <section>
                <h4 className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-2">Body Content</h4>
                <p>{result.script.body}</p>
              </section>
              
              <section>
                <h4 className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-2">Call To Action</h4>
                <p className="font-medium text-indigo-600">{result.script.cta}</p>
              </section>

              <section className="pt-6 border-t border-gray-50">
                 <h4 className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-2">Video Description</h4>
                 <p className="text-xs text-gray-400 italic line-clamp-3">{result.script.description}</p>
              </section>
            </div>
          </div>
        )}

        {!result.script && !isGenerating && (
          <div className="h-full min-h-[450px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] p-12 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for Action</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Your AI-generated assets, script, and YouTube deployment status will be displayed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCreator;
