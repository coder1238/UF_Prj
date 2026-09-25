import React, { useState } from 'react';
import { Camera, Layers, CheckCircle2, Sliders, X, Upload, Sparkles, MapPin, Clock } from 'lucide-react';

export default function BeforeAfterSliderModal({ report, isOpen, onClose, onAddFollowUpPhoto }) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [selectedTab, setSelectedTab] = useState('slider'); // 'slider' | 'exif' | 'upload'
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [uploadNote, setUploadNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen || !report) return null;

  const beforePhoto = report.beforePhotoUrl || report.photoUrl || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=60';
  const afterPhoto = uploadedPreview || report.afterPhotoUrl || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60';

  const exif = report.exifMetadata || {
    device: 'Citizen Device (Camera EXIF)',
    gpsPrecision: '±2.1m precision',
    capturedAt: report.submittedAt || 'Today',
    opticalDepthTag: `Water level measured ~${report.depth} cm`
  };

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      // Mock photo uploaded
      const newMockPhoto = 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=60';
      setUploadedPreview(newMockPhoto);
      setIsUploading(false);
      if (onAddFollowUpPhoto) {
        onAddFollowUpPhoto(report.id, newMockPhoto, uploadNote || 'Follow-up citizen photo: water receding after dewatering');
      }
      setSelectedTab('slider');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-primary" />
            <h3 className="font-bold text-ink text-base">Ground Evidence & Visual Verification</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 border-b border-slate-100 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setSelectedTab('slider')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              selectedTab === 'slider' 
                ? 'border-purple-primary text-purple-primary font-bold' 
                : 'border-transparent text-slate-500 hover:text-ink'
            }`}
          >
            <Sliders className="w-4 h-4" /> Before vs After Comparison
          </button>
          <button
            onClick={() => setSelectedTab('exif')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              selectedTab === 'exif' 
                ? 'border-purple-primary text-purple-primary font-bold' 
                : 'border-transparent text-slate-500 hover:text-ink'
            }`}
          >
            <Camera className="w-4 h-4" /> EXIF Metadata & AI Audit
          </button>
          <button
            onClick={() => setSelectedTab('upload')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              selectedTab === 'upload' 
                ? 'border-purple-primary text-purple-primary font-bold' 
                : 'border-transparent text-slate-500 hover:text-ink'
            }`}
          >
            <Upload className="w-4 h-4" /> Upload Follow-up Evidence
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedTab === 'slider' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                  BEFORE: Peak Waterlogging ({report.depth} cm)
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  AFTER: Post-Intervention Status
                </span>
              </div>

              {/* Visual Split Screen Slider */}
              <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden select-none border border-slate-200 shadow-inner bg-slate-900">
                {/* Background image: AFTER */}
                <img
                  src={afterPhoto}
                  alt="After de-watering"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Foreground image clipped: BEFORE */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={beforePhoto}
                    alt="Before flood peak"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%', minWidth: '100%' }}
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-mono font-bold">
                    Incident Inception ({report.submittedAt || report.timestamp})
                  </div>
                </div>

                {/* Right label */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-mono font-bold">
                  Cleared Observation
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-purple-primary shadow-lg flex items-center justify-center font-bold text-xs border-2 border-purple-primary">
                    ↔
                  </div>
                </div>

                {/* Drag range control overlay */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Drag slider horizontally or use percentage control</span>
                <span className="font-bold text-purple-primary">{sliderPos}% Split View</span>
              </div>
            </div>
          )}

          {selectedTab === 'exif' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-sm font-bold text-ink">
                  <Sparkles className="w-4 h-4 text-purple-primary" /> Multi-Spectral Computer Vision EXIF Verification
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">DEVICE & SENSOR</span>
                    <span className="font-bold text-slate-800">{exif.device}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">GEOLOCATION ACCURACY</span>
                    <span className="font-bold text-emerald-600">{exif.gpsPrecision}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">TIMESTAMP CERTIFICATION</span>
                    <span className="font-bold text-slate-800">{exif.capturedAt}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">AI CURB SEGMENTATION</span>
                    <span className="font-bold text-purple-primary">{exif.opticalDepthTag}</span>
                  </div>
                </div>

                <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200 text-purple-900 mt-2">
                  <strong>Verification Engine:</strong> ResNet-50 Waterline Ingress model matched tire hubcap submerged ratio. GNN confidence score: <strong>{report.aiConfidence || 94}%</strong>.
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'upload' && (
            <form onSubmit={handleSimulateUpload} className="space-y-4 text-xs font-sans">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-purple-primary transition-colors cursor-pointer bg-slate-50">
                <Upload className="w-8 h-8 text-purple-primary mx-auto mb-2" />
                <span className="font-bold text-slate-800 block text-sm">Select Follow-up Water Clearance Photo</span>
                <span className="text-slate-400 mt-1 block">Help the municipal war room verify that the road is safe for reopening.</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Citizen Field Note:</label>
                <input
                  type="text"
                  value={uploadNote}
                  onChange={(e) => setUploadNote(e.target.value)}
                  placeholder="e.g., Water has fully receded to curb level. Two-wheelers passing safely."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-primary text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 rounded-xl bg-purple-primary hover:bg-purple-deep text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isUploading ? (
                  <span>Ingesting and Cross-Referencing Image...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Submit Verification Photo
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
