import React, { useState } from 'react';
import { 
  Users, Phone, PhoneCall, ShieldAlert, Plus, Trash2, 
  Send, Sparkles, AlertTriangle, CheckCircle2, MessageSquare
} from 'lucide-react';

export default function ProfileEmergencyContacts({ 
  contacts, 
  onUpdateContacts, 
  userWardName, 
  speakAlert 
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [simulatedPingSent, setSimulatedPingSent] = useState(null);

  const [newContact, setNewContact] = useState({
    name: '',
    relationship: 'Family Member',
    phone: '',
    notifyOnRedAlert: true
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    const item = { ...newContact, id: 'ice-' + Date.now() };
    const updated = [...contacts, item];
    onUpdateContacts(updated);
    setShowAddModal(false);
    setNewContact({ name: '', relationship: 'Family Member', phone: '', notifyOnRedAlert: true });
    speakAlert(`Emergency contact ${item.name} added to your SOS speed-dial.`);
  };

  const handleDelete = (id) => {
    const updated = contacts.filter(c => c.id !== id);
    onUpdateContacts(updated);
  };

  const handleSimulatePing = (contact) => {
    const message = `[EMERGENCY SOS] Urgent Flood Warning: I am in ${userWardName}. Current location beacon sent. Live coordinates available on Urban Flood Portal.`;
    setSimulatedPingSent({ contact: contact.name, phone: contact.phone, message });
    speakAlert(`Simulated emergency SOS SMS sent to ${contact.name}`);
    setTimeout(() => {
      setSimulatedPingSent(null);
    }, 4500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-soft text-purple-primary shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Emergency SOS Contact Mesh (In Case of Emergency - ICE)</h2>
            <p className="text-xs text-muted">
              Auto-dispatched via cellular SMS and disaster mesh radio during rapid inundation triggers.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-purple-primary hover:bg-purple-deep text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add ICE Contact</span>
        </button>
      </div>

      {simulatedPingSent && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold">
              Emergency Broadcast Dispatched to {simulatedPingSent.contact} ({simulatedPingSent.phone})
            </div>
            <div className="text-[11px] font-mono text-emerald-700 mt-1 bg-white/70 p-2 rounded-lg border border-emerald-200">
              "{simulatedPingSent.message}"
            </div>
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-extrabold text-sm text-ink">{c.name}</h4>
                  <span className="text-[11px] text-muted font-medium block">{c.relationship}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                  title="Remove Contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80 mb-3">
                <Phone className="w-3.5 h-3.5 text-purple-primary shrink-0" />
                <span>{c.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSimulatePing(c)}
                className="flex-1 py-1.5 px-2 bg-purple-soft hover:bg-purple-100 text-purple-deep rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
              >
                <Send className="w-3 h-3 text-purple-primary" />
                <span>Test SOS Ping</span>
              </button>
              <a
                href={`tel:${c.phone}`}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                title="Dial Phone"
              >
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}

        {/* Built-in Municipal Control Room Card */}
        <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-900">BMC Disaster Management Helpline</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-200 text-purple-900">
                OFFICIAL
              </span>
            </div>
            <p className="text-[11px] text-purple-700 mb-2">
              Direct emergency command for ward dewatering pumps and boat mobilizations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:1916"
              className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Call 1916 (Toll-Free)
            </a>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6">
            <h3 className="text-lg font-bold text-ink mb-1">Add Emergency ICE Contact</h3>
            <p className="text-xs text-muted mb-4">This person will receive high-priority automated alerts when water rises.</p>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-muted uppercase font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newContact.name}
                  onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase font-semibold mb-1">Relationship</label>
                <select
                  value={newContact.relationship}
                  onChange={e => setNewContact({ ...newContact, relationship: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none"
                >
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Child">Child</option>
                  <option value="Neighbor">Building Neighbor / CHS Secretary</option>
                  <option value="Physician">Personal Doctor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase font-semibold mb-1">Mobile Phone (with SMS)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 00000"
                  value={newContact.phone}
                  onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-primary/30"
                />
              </div>

              <div className="p-3 bg-canvas rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newContact.notifyOnRedAlert}
                    onChange={e => setNewContact({ ...newContact, notifyOnRedAlert: e.target.checked })}
                    className="w-4 h-4 accent-purple-primary rounded"
                  />
                  <span className="text-xs font-bold text-ink">
                    Send automated beacon if water in ward exceeds 25cm
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-primary hover:bg-purple-deep text-white text-xs font-bold rounded-xl transition"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

