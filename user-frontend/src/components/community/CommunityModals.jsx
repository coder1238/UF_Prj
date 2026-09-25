import React, { useState } from 'react';
import { 
  X, Camera, MapPin, AlertTriangle, CheckCircle2, ShieldCheck, 
  Droplets, Upload, Sliders, ThumbsUp, Send, Share2, Download,
  Radio, Check, Sparkles, Award, HeartHandshake, PhoneCall,
  UserCheck, AlertOctagon, HelpCircle, FileText, ExternalLink
} from 'lucide-react';

// ==========================================
// 1. PIN-DROP OBSERVATION SUBMISSION MODAL
// ==========================================
export function PinDropModal({
  isOpen,
  onClose,
  initialCoords = { lat: 19.0760, lng: 72.8777 },
  onSubmitReport
}) {
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [wardId, setWardId] = useState('ward-l');
  const [category, setCategory] = useState('Waterlogging');
  const [depthCm, setDepthCm] = useState(25);
  const [selectedHazards, setSelectedHazards] = useState(['Submerged Curb']);
  const [description, setDescription] = useState('');
  const [scoutName, setScoutName] = useState('Citizen Observer');
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80');

  if (!isOpen) return null;

  const hazardOptions = [
    'Fast Current', 'Subway Dip', 'Open Manhole', 'Dislodged Cover',
    'Stalled Vehicle', 'Power Cable Sparks', 'Tree Branch Debris', 'Submerged Curb'
  ];

  const toggleHazard = (haz) => {
    setSelectedHazards(prev => 
      prev.includes(haz) ? prev.filter(h => h !== haz) : [...prev, haz]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim()) return;

    const newReport = {
      id: `CMD-${Math.floor(4100 + Math.random() * 900)}`,
      title,
      location: locationName,
      wardId,
      wardName: wardId === 'ward-l' ? 'Ward L (Kurla)' : wardId === 'ward-k-west' ? 'Ward K-West (Andheri/Santacruz)' : wardId === 'ward-f-north' ? 'Ward F-North (Dadar)' : 'Ward H-West (Bandra)',
      type: category,
      category,
      timestamp: 'Just now (Live)',
      timeAgo: 'Just now',
      recencyMinutes: 1,
      depth: Number(depthCm),
      modelDepth: Math.max(0, Number(depthCm) - Math.floor(Math.random() * 4)),
      scoutDepth: Number(depthCm),
      sensorDepth: Math.max(0, Number(depthCm) + 1.2),
      sensorId: 'FIELD-INGEST-PIN',
      agreementPct: 98,
      scoutName: scoutName.trim() || 'Citizen Scout',
      trustTier: 'Level 1 Active Contributor',
      upvotes: 1,
      downvotes: 0,
      userConfirmed: true,
      userDisputed: false,
      verified: true,
      description: description || `Reported ${category} at ${locationName} with estimated water depth of ${depthCm} cm.`,
      hazards: selectedHazards,
      coordinates: initialCoords,
      evidencePhoto: photoPreview,
      exif: {
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        device: 'Citizen Device (EXIF Verified)',
        accuracyMeters: 2.4,
        tamperProofHash: `sha256:${Math.random().toString(16).substring(2, 12)}`,
        aiWaterlineDetected: true,
        aiTireSubmersionPct: Math.min(100, Math.round(depthCm * 1.8))
      },
      comments: [
        { id: `c-${Date.now()}`, author: scoutName, time: 'Just now', text: 'Initial citizen pin logged from ground.', verified: true }
      ],
      status: 'VERIFIED_MATCH'
    };

    onSubmitReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-primary text-white flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-base">Drop Ground Truth Observation</h3>
              <p className="text-xs text-muted font-mono">
                GPS: {initialCoords.lat.toFixed(4)}°N, {initialCoords.lng.toFixed(4)}°E
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-ink mb-1">Observation Landmark / Headline *</label>
            <input 
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., LBS Marg Rail Culvert Water Accumulation"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-primary focus:ring-1 focus:ring-purple-primary outline-none font-semibold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-ink mb-1">Specific Location / Street *</label>
              <input 
                type="text"
                required
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                placeholder="e.g., Near Sion Station Road"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-primary outline-none text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-ink mb-1">Administrative Ward</label>
              <select 
                value={wardId}
                onChange={e => setWardId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none"
              >
                <option value="ward-l">Ward L (Kurla)</option>
                <option value="ward-k-west">Ward K-West (Andheri/Santacruz)</option>
                <option value="ward-f-north">Ward F-North (Dadar/Matunga)</option>
                <option value="ward-h-west">Ward H-West (Bandra/Khar)</option>
              </select>
            </div>
          </div>

          {/* Hazard Category */}
          <div>
            <label className="block font-bold text-ink mb-1.5">Hazard Category</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Waterlogging', label: 'Waterlogging', icon: Droplets, color: 'text-purple-600' },
                { id: 'Open Manhole', label: 'Open Manhole', icon: AlertOctagon, color: 'text-red-600' },
                { id: 'Stalled Vehicle', label: 'Stalled Car', icon: AlertTriangle, color: 'text-amber-600' },
                { id: 'Electrical Hazard', label: 'Live Wire', icon: AlertTriangle, color: 'text-red-500' },
                { id: 'Tree Fall', label: 'Tree Fall', icon: AlertTriangle, color: 'text-emerald-600' },
                { id: 'Receding / Cleared', label: 'Dry / Cleared', icon: CheckCircle2, color: 'text-emerald-600' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 font-semibold text-[11px] transition-all ${
                    category === cat.id
                      ? 'border-purple-primary bg-purple-50/60 text-purple-primary shadow-sm ring-1 ring-purple-primary'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                  }`}
                >
                  <cat.icon className={`w-4 h-4 ${cat.color}`} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Depth Slider */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-ink">Estimated Flood Depth:</span>
              <span className="font-mono font-extrabold text-sm px-2.5 py-0.5 rounded-lg bg-red-100 text-red-700">
                {depthCm} cm
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="120"
              step="1"
              value={depthCm}
              onChange={e => setDepthCm(e.target.value)}
              className="w-full accent-purple-primary cursor-pointer"
            />
            <div className="flex justify-between font-mono text-[10px] text-muted mt-1.5">
              <span>0 cm (Dry)</span>
              <span>15 cm (Curb)</span>
              <span>30 cm (Exhaust)</span>
              <span>50 cm (Knee)</span>
              <span>80+ cm (Waist)</span>
            </div>
          </div>

          {/* Quick Hazard Tags */}
          <div>
            <label className="block font-bold text-ink mb-1.5">Environmental Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {hazardOptions.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleHazard(tag)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium transition-all ${
                    selectedHazards.includes(tag)
                      ? 'bg-ink text-white shadow-xs'
                      : 'bg-canvas border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {selectedHazards.includes(tag) ? '✓ ' : '+ '} {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Reporter */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-ink mb-1">Your Name / Scout Alias</label>
              <input 
                type="text"
                value={scoutName}
                onChange={e => setScoutName(e.target.value)}
                placeholder="Citizen Scout"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-ink mb-1">Observation Notes</label>
              <input 
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief advice for commuters..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-slate-800"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Publish Pin to Map & Feed
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. EVIDENCE VIEWER & AI WATERLINE MODAL
// ==========================================
export function EvidenceViewerModal({
  isOpen,
  onClose,
  report
}) {
  const [showAiSegmentation, setShowAiSegmentation] = useState(true);

  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/65 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-primary">
                {report.id}
              </span>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                EXIF Certified
              </span>
            </div>
            <h3 className="font-extrabold text-ink text-base mt-1">{report.title}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Photo Frame with AI Waterline Overlay */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
            <img 
              src={report.evidencePhoto || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'} 
              alt={report.title}
              className="w-full h-64 object-cover opacity-90"
            />

            {/* AI Waterline Overlay Simulation */}
            {showAiSegmentation && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-4">
                <div className="w-full border-t-2 border-dashed border-cyan-400 relative">
                  <div className="absolute -top-3 left-4 bg-cyan-500 text-ink text-[10px] font-mono font-black px-2 py-0.5 rounded shadow">
                    AI Waterline Cutoff: ~{report.depth} cm
                  </div>
                </div>
                <div className="h-20 bg-cyan-500/20 backdrop-blur-[1px] border-t border-cyan-400/40 mt-1 rounded-b-xl flex items-center justify-center">
                  <span className="text-[11px] font-mono font-bold text-cyan-200 bg-cyan-900/60 px-2 py-1 rounded">
                    Tire Submersion Index: {report.exif?.aiTireSubmersionPct || 55}%
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowAiSegmentation(!showAiSegmentation)}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold text-slate-800 shadow-sm border border-slate-200 hover:bg-white transition-all"
            >
              {showAiSegmentation ? 'Hide AI Overlay' : 'Show AI Waterline'}
            </button>
          </div>

          {/* EXIF Metadata & Hardware Audit */}
          <div className="bg-canvas rounded-2xl p-4 border border-slate-200 space-y-2.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-ink font-bold border-b border-slate-200/80 pb-1.5">
              <span>EXIF Verification Certificate</span>
              <span className="text-emerald-700">SHA-256 Validated</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-muted block text-[10px]">Capture Device:</span>
                <span className="font-semibold text-ink">{report.exif?.device || 'Citizen Mobile'}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px]">Timestamp:</span>
                <span className="font-semibold text-ink">{report.exif?.timestamp || report.timestamp}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px]">GPS Accuracy:</span>
                <span className="font-semibold text-ink">± {report.exif?.accuracyMeters || 2.5} meters</span>
              </div>
              <div>
                <span className="text-muted block text-[10px]">Integrity Signature:</span>
                <span className="font-semibold text-purple-primary truncate block">{report.exif?.tamperProofHash || 'sha256:7f01a9b'}</span>
              </div>
            </div>
          </div>

          {/* Scout Credentials */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-primary text-white flex items-center justify-center font-bold">
                {report.scoutName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-ink">{report.scoutName}</h4>
                <p className="text-[11px] text-purple-700 font-mono">{report.trustTier}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-white border border-purple-200 font-mono text-[10px] font-extrabold text-purple-primary">
              {report.upvotes} Confirmations
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

// ==========================================
// 3. DISCUSSION & LIVE FIELD NOTES DRAWER
// ==========================================
export function DiscussionDrawer({
  isOpen,
  onClose,
  report,
  onAddComment
}) {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('Citizen');

  if (!isOpen || !report) return null;

  const handlePost = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(report.id, {
      id: `c-${Date.now()}`,
      author: authorName.trim() || 'Citizen',
      time: 'Just now',
      text: commentText.trim(),
      verified: false
    });

    setCommentText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 max-w-md w-full bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <span className="text-[10px] font-mono font-bold text-purple-primary uppercase">
            Field Notes • {report.id}
          </span>
          <h3 className="font-bold text-ink text-sm truncate max-w-xs">{report.title}</h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-3">
        {(!report.comments || report.comments.length === 0) ? (
          <div className="text-center py-12 text-muted text-xs font-mono">
            No community field notes yet. Be the first to post an update!
          </div>
        ) : (
          report.comments.map(c => (
            <div key={c.id} className="p-3.5 rounded-2xl bg-canvas border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-ink flex items-center gap-1.5">
                  {c.author}
                  {c.verified && (
                    <span className="text-[9px] bg-purple-100 text-purple-primary px-1.5 py-0.2 rounded font-bold">
                      Scout
                    </span>
                  )}
                </span>
                <span className="text-muted text-[10px]">{c.time}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handlePost} className="p-4 border-t border-slate-200 bg-white space-y-2">
        <div className="flex gap-2">
          <input 
            type="text"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            placeholder="Your Alias"
            className="w-1/3 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-purple-primary"
          />
          <input 
            type="text"
            required
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Write field note or traffic status..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-primary"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 bg-purple-primary hover:bg-purple-deep text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" /> Post Ground Update
        </button>
      </form>

    </div>
  );
}

// ==========================================
// 4. VOLUNTEER & MUTUAL AID DISPATCH MODAL
// ==========================================
export function VolunteerAidModal({
  isOpen,
  onClose,
  onSubmitAidRequest
}) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Sandbags');
  const [urgency, setUrgency] = useState('HIGH');
  const [neededVolunteers, setNeededVolunteers] = useState(4);
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    onSubmitAidRequest({
      id: `AID-${Math.floor(920 + Math.random() * 80)}`,
      title,
      location,
      wardId: 'ward-l',
      coordinates: { lat: 19.0680, lng: 72.8790 },
      category,
      urgency,
      neededVolunteers: Number(neededVolunteers),
      pledgedVolunteers: 1,
      description,
      postedBy: 'Citizen Volunteer Organizer',
      contactPhone: contactPhone || '+91 98200 00000',
      timestamp: 'Just now',
      fulfilled: false
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-base">Request Community Mutual Aid</h3>
              <p className="text-xs text-emerald-800">Dispatch neighborhood volunteers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-ink mb-1">Aid Title *</label>
            <input 
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Sandbags Needed for Substation Perimeter"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-slate-800 focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-ink mb-1">Location / Landmark *</label>
              <input 
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Building or Gate"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-ink mb-1">Aid Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Sandbags">Sandbag Wall</option>
                <option value="Evacuation">Senior Evacuation</option>
                <option value="Food/Water">Water / Food Supply</option>
                <option value="Vehicle Assist">Car Push / Tow</option>
                <option value="Medical">Medical First Aid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-ink mb-1">Urgency Level</label>
              <select 
                value={urgency}
                onChange={e => setUrgency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="CRITICAL">Critical (Immediate)</option>
                <option value="HIGH">High (Within 1 hr)</option>
                <option value="MEDIUM">Medium</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-ink mb-1">Volunteers Needed</label>
              <input 
                type="number"
                min="1"
                max="20"
                value={neededVolunteers}
                onChange={e => setNeededVolunteers(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Emergency Contact Phone</label>
            <input 
              type="text"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              placeholder="+91 98200 XXXXX"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Instructions / Specifics</label>
            <textarea 
              rows="2"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what help is needed..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
            >
              Publish Mutual Aid Request
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// ==========================================
// 5. CITIZEN SCOUT LEADERBOARD MODAL
// ==========================================
export function ScoutLeaderboardModal({
  isOpen,
  onClose,
  leaderboard = []
}) {
  const [showApplyBadge, setShowApplyBadge] = useState(false);
  const [badgeApplied, setBadgeApplied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-primary text-white flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink text-base">Citizen Scout Honor Board</h3>
              <p className="text-xs text-muted">Top verified ground-truth reporters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3 text-xs">
          {leaderboard.map((scout) => (
            <div 
              key={scout.rank}
              className="flex items-center justify-between p-3 rounded-2xl bg-canvas border border-slate-200/80 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                  scout.rank === 1 ? 'bg-amber-400 text-ink' : scout.rank === 2 ? 'bg-slate-300 text-ink' : scout.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {scout.rank}
                </span>
                <span className="text-xl">{scout.avatar}</span>
                <div>
                  <h4 className="font-bold text-ink">{scout.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-muted font-mono">
                    <span>{scout.badge}</span>
                    <span>•</span>
                    <span className="text-purple-primary">{scout.ward}</span>
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="font-extrabold text-ink text-sm">{scout.points} XP</span>
                <span className="block text-[10px] text-emerald-700">{scout.accuracyPct}% Accuracy</span>
              </div>
            </div>
          ))}

          {/* Become a verified scout */}
          <div className="mt-4 p-4 rounded-2xl bg-purple-50/80 border border-purple-200 text-center space-y-2">
            <h4 className="font-bold text-purple-900 text-xs">Want to become a Verified Ground Scout?</h4>
            <p className="text-[11px] text-purple-700">
              Contribute 5 photo-verified flood observations with EXIF tags to earn the Level 3 Scout Badge and automatic model weighting.
            </p>
            {badgeApplied ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Scout Application In Review
              </span>
            ) : (
              <button
                onClick={() => setBadgeApplied(true)}
                className="px-4 py-2 bg-purple-primary hover:bg-purple-deep text-white rounded-xl font-bold text-xs transition-colors"
              >
                Apply for Verified Scout Accreditation
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 6. SITREP EXPORT & WHATSAPP SHARE MODAL
// ==========================================
export function SitRepShareModal({
  isOpen,
  onClose,
  reports = [],
  wardName = 'Mumbai'
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sitrepText = `🚨 *MUMBAI FLOOD SITUATION REPORT (SITREP)* 🚨
📍 Ward: ${wardName} | Time: ${new Date().toLocaleTimeString('en-IN')} IST
---------------------------------------------
⚠️ Active Hazard Observations: ${reports.length}
🌊 Deepest Inundation: ${Math.max(...reports.map(r => r.depth || 0))} cm

Key Hotspots:
${reports.slice(0, 4).map(r => `• ${r.title}: ${r.depth}cm (${r.category})`).join('\n')}

🛡️ Safe Shelters Open: High-Ground Municipal Centers Active
📡 Powered by Urban Flood Ground-Truth Network
Direct Live Map: http://localhost:3000/community`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sitrepText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `mumbai_community_sitrep_${Date.now()}.json`);
    dl.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-primary" />
            <h3 className="font-extrabold text-ink text-base">Broadcast Neighborhood SitRep</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-canvas border border-slate-200 font-mono text-[11px] whitespace-pre-wrap text-slate-700 max-h-56 overflow-y-auto">
            {sitrepText}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy for WhatsApp'}
            </button>
            <button
              onClick={handleDownloadJson}
              className="py-2.5 px-3 bg-canvas border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" /> Export JSON
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 7. COMMUNITY SAFETY PLEDGE CHECKLIST MODAL
// ==========================================
export function SafetyPledgeModal({
  isOpen,
  onClose,
  onPledgeComplete
}) {
  const [checkedItems, setCheckedItems] = useState([true, false, false, false, false]);

  if (!isOpen) return null;

  const checklist = [
    'Check on senior citizen neighbors living on the ground floor',
    'Switch off main electrical circuit breaker if water approaches doorway',
    'Never walk or drive into submerged underpasses or flooded subways',
    'Report open manholes or displaced culvert grates immediately on app',
    'Keep emergency drinking water and mobile power bank charged'
  ];

  const toggleItem = (idx) => {
    setCheckedItems(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  const allChecked = checkedItems.every(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-primary" />
            <h3 className="font-extrabold text-ink text-base">Community Flood Safety Pledge</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3.5 text-xs">
          <p className="text-muted">
            Commit to the 5 essential good-neighbor actions during Mumbai monsoon cloudbursts:
          </p>

          <div className="space-y-2.5">
            {checklist.map((item, idx) => (
              <label 
                key={idx}
                onClick={() => toggleItem(idx)}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  checkedItems[idx] 
                    ? 'bg-purple-50/50 border-purple-primary/60 text-purple-950 font-semibold' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                  checkedItems[idx] ? 'bg-purple-primary border-purple-primary text-white' : 'border-slate-300'
                }`}>
                  {checkedItems[idx] && <Check className="w-3 h-3" />}
                </div>
                <span className="text-[11px] leading-snug">{item}</span>
              </label>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => {
                onPledgeComplete();
                onClose();
              }}
              className="w-full py-2.5 bg-purple-primary hover:bg-purple-deep text-white rounded-xl font-bold shadow-sm transition-all"
            >
              Sign Responsible Citizen Pledge & Earn Badge
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 8. IOT SENSOR TELEMETRY MODAL
// ==========================================
export function IoTSensorModal({
  isOpen,
  onClose,
  sensor,
  onPollSensor
}) {
  const [isPolling, setIsPolling] = useState(false);

  if (!isOpen || !sensor) return null;

  const handlePoll = () => {
    setIsPolling(true);
    setTimeout(() => {
      onPollSensor(sensor.id);
      setIsPolling(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-cyan-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-800">{sensor.id}</span>
              <h3 className="font-extrabold text-ink text-sm">{sensor.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-canvas border border-slate-200">
              <span className="text-[10px] font-mono text-muted block">Live Depth:</span>
              <span className="text-xl font-mono font-extrabold text-cyan-700">{sensor.currentDepthCm} cm</span>
            </div>
            <div className="p-3 rounded-2xl bg-canvas border border-slate-200">
              <span className="text-[10px] font-mono text-muted block">Telemetry Rate:</span>
              <span className="text-xs font-mono font-bold text-slate-700">Every 30s • Ping {sensor.lastPingSecondsAgo}s ago</span>
            </div>
          </div>

          {/* Mini 60m Trend Graph (SVG) */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-400">Depth Progression (Past 60 mins):</span>
              <span className="text-cyan-400 font-bold uppercase">{sensor.trend}</span>
            </div>
            <div className="h-20 flex items-end gap-2 pt-2 border-b border-slate-800">
              {sensor.historical60m.map((val, idx) => {
                const heightPct = Math.round((val / 65) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-cyan-400 rounded-t group-hover:bg-cyan-300 transition-all"
                    />
                    <span className="text-[8px] font-mono text-slate-400">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] text-muted">
            <span>Battery: {sensor.batteryPct}% Solar</span>
            <span>Signal: {sensor.rssiSignalDbm} dBm</span>
          </div>

          <button
            onClick={handlePoll}
            disabled={isPolling}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Radio className={`w-4 h-4 ${isPolling ? 'animate-spin' : ''}`} />
            {isPolling ? 'Awaiting Ultrasound Ping...' : 'Poll Real-Time Gauge Telemetry'}
          </button>
        </div>

      </div>
    </div>
  );
}

