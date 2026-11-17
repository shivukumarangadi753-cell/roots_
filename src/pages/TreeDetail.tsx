import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { localDb } from '../lib/supabase';
import { TreeRecord, TreeGrowthUpdate, GrowthCheckpoint, TreeHealthStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  TreePine, 
  Calendar, 
  MapPin, 
  Activity, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Clock, 
  ArrowLeft,
  Heart,
  Droplets,
  LineChart as LineChartIcon
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const TreeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [tree, setTree] = useState<TreeRecord | null>(null);
  const [updates, setUpdates] = useState<TreeGrowthUpdate[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New checkpoint form
  const [checkpoint, setCheckpoint] = useState<GrowthCheckpoint>('Day 30');
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [heightCm, setHeightCm] = useState('75');
  const [canopySpreadCm, setCanopySpreadCm] = useState('35');
  const [healthStatus, setHealthStatus] = useState<TreeHealthStatus>('Healthy');
  const [observations, setObservations] = useState('');
  const [maintenancePerformed, setMaintenancePerformed] = useState('Organic leaf mulching and weed clearance.');

  const loadTreeData = () => {
    if (!id) return;
    const t = localDb.getTreeById(id);
    if (t) {
      setTree(t);
      setUpdates(localDb.getGrowthUpdates(t.id));
    }
  };

  useEffect(() => {
    loadTreeData();
  }, [id]);

  const handleLogCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tree) return;

    if (!observations) {
      setNotification({ type: 'error', message: 'Please record field observations.' });
      return;
    }

    localDb.addGrowthUpdate({
      tree_id: tree.id,
      checkpoint,
      assessment_date: assessmentDate,
      height_cm: parseFloat(heightCm) || 75,
      canopy_spread_cm: parseFloat(canopySpreadCm) || 30,
      health_status: healthStatus,
      observations,
      maintenance_performed: maintenancePerformed
    });

    setNotification({
      type: 'success',
      message: `Survival checkpoint "${checkpoint}" recorded and added to verification history.`
    });

    setShowLogModal(false);
    loadTreeData();
  };

  if (!tree) {
    return (
      <div className="py-20 text-center bg-bg min-h-screen">
        <p className="text-sm text-muted">Tree record not found.</p>
        <Link to="/tree-adoption" className="text-primary text-xs font-semibold underline mt-2 block">
          Return to Registry Gallery
        </Link>
      </div>
    );
  }

  // Prepare chart data from recorded checkpoints
  const chartData = updates.map((u) => ({
    checkpoint: u.checkpoint,
    height: u.height_cm,
    date: u.assessment_date
  }));

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          to="/tree-adoption"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-charcoal mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Tree Adoption Registry
        </Link>

        {/* Notification Banner */}
        {notification && (
          <div className={`mb-6 p-4 rounded border text-xs flex items-center justify-between ${
            notification.type === 'success' 
              ? 'bg-primary-subtle border-primary/30 text-primary' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="p-1">
              &times;
            </button>
          </div>
        )}

        {/* Tree Profile Header Card */}
        <div className="bg-surface rounded-lg border border-border p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tree Photo */}
            <div className="lg:col-span-4">
              <img
                src={tree.photo_url}
                alt={tree.species_name}
                className="w-full h-64 object-cover rounded border border-border"
              />
              <div className="mt-3 text-center">
                <span className="font-mono text-xs font-bold bg-bg border border-border px-3 py-1 rounded text-charcoal">
                  {tree.tree_code}
                </span>
              </div>
            </div>

            {/* Tree Specs */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-charcoal">
                    {tree.species_name}
                  </h1>
                  <p className="text-xs italic text-muted font-serif">
                    {tree.scientific_name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded ${
                    tree.current_health_status === 'Healthy'
                      ? 'bg-primary text-white'
                      : 'bg-amber-700 text-white'
                  }`}>
                    {tree.current_health_status}
                  </span>
                  {tree.is_adopted && (
                    <span className="text-xs px-2.5 py-1 rounded bg-primary-subtle text-primary font-semibold flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-primary" />
                      Adopted
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-bg p-4 rounded border border-border">
                <div>
                  <span className="text-muted block">Planted On:</span>
                  <strong className="text-charcoal">{tree.plantation_date}</strong>
                </div>
                <div>
                  <span className="text-muted block">Registered Planter:</span>
                  <strong className="text-charcoal">{tree.planter_name}</strong>
                </div>
                <div>
                  <span className="text-muted block">Soil Classification:</span>
                  <strong className="text-charcoal">{tree.soil_type_name}</strong>
                </div>
                <div>
                  <span className="text-muted block">Location:</span>
                  <strong className="text-charcoal truncate block">{tree.location_name}</strong>
                </div>
                <div>
                  <span className="text-muted block">Baseline Height:</span>
                  <strong className="text-charcoal">{tree.initial_height_cm} cm</strong>
                </div>
                <div>
                  <span className="text-muted block">Guardian / Adopter:</span>
                  <strong className="text-primary">{tree.adopted_by_name || 'Available for Adoption'}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted">
                  Recorded Assessments: <strong>{updates.length}</strong>
                </span>

                <button
                  onClick={() => setShowLogModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-hover shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Record Survival Checkpoint
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Curve Chart */}
        {chartData.length > 1 && (
          <div className="bg-surface rounded-lg border border-border p-6 mb-8">
            <h3 className="text-sm font-bold font-heading text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-primary" />
              Stem Height Growth Trajectory (cm)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3E8E2" />
                  <XAxis dataKey="checkpoint" tick={{ fill: '#747B75', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#747B75', fontSize: 11 }} unit=" cm" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E3E8E2', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="height" 
                    stroke="#244C3A" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#244C3A', r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Growth Timeline Checkpoints */}
        <div className="bg-surface rounded-lg border border-border p-6 sm:p-8">
          <h3 className="text-sm font-bold font-heading text-charcoal uppercase tracking-wider mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Verified Growth Checkpoints Timeline
          </h3>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-border">
            {updates.map((upd, idx) => (
              <div key={upd.id} className="relative pl-8 space-y-2">
                <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white -translate-x-1/2" />
                <div className="bg-bg p-4 rounded border border-border space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-heading text-charcoal">
                        {upd.checkpoint} Milestone Assessment
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        upd.health_status === 'Healthy' ? 'bg-primary text-white' : 'bg-amber-700 text-white'
                      }`}>
                        {upd.health_status}
                      </span>
                    </div>
                    <span className="text-xs text-muted">
                      {upd.assessment_date} &bull; Logged by {upd.recorded_by_name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-medium text-charcoal py-1">
                    <div>Stem Height: <strong>{upd.height_cm} cm</strong></div>
                    {upd.canopy_spread_cm && (
                      <div>Canopy Diameter: <strong>{upd.canopy_spread_cm} cm</strong></div>
                    )}
                  </div>

                  <div className="text-xs text-muted leading-relaxed">
                    <strong>Observations:</strong> {upd.observations}
                  </div>

                  {upd.maintenance_performed && (
                    <div className="text-xs text-primary bg-primary-subtle p-2 rounded flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 shrink-0" />
                      <span>Maintenance: {upd.maintenance_performed}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Record Survival Checkpoint */}
        {showLogModal && (
          <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-lg max-w-lg w-full border border-border shadow-card p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-lg font-bold font-heading text-charcoal">
                  Record Survival Checkpoint for {tree.tree_code}
                </h3>
                <button onClick={() => setShowLogModal(false)} className="text-muted hover:text-charcoal">
                  &times;
                </button>
              </div>

              <form onSubmit={handleLogCheckpoint} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Growth Checkpoint *</label>
                  <select
                    value={checkpoint}
                    onChange={(e) => setCheckpoint(e.target.value as GrowthCheckpoint)}
                    className="w-full p-2 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  >
                    <option value="Day 30">Day 30 (First Monthly Evaluation)</option>
                    <option value="Day 90">Day 90 (Root Establishment)</option>
                    <option value="Day 180">Day 180 (Seasonal Adaptation)</option>
                    <option value="Day 365">Day 365 (1-Year Climax Survival)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-charcoal mb-1">Assessment Date *</label>
                    <input
                      type="date"
                      required
                      value={assessmentDate}
                      onChange={(e) => setAssessmentDate(e.target.value)}
                      className="w-full p-2 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-charcoal mb-1">Health Status *</label>
                    <select
                      value={healthStatus}
                      onChange={(e) => setHealthStatus(e.target.value as TreeHealthStatus)}
                      className="w-full p-2 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary font-medium"
                    >
                      <option value="Healthy">Healthy</option>
                      <option value="Needs Attention">Needs Attention</option>
                      <option value="Under Observation">Under Observation</option>
                      <option value="Dead or Replaced">Dead or Replaced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-charcoal mb-1">Measured Stem Height (cm) *</label>
                    <input
                      type="number"
                      required
                      min="10"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      className="w-full p-2 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-charcoal mb-1">Canopy Spread Diameter (cm)</label>
                    <input
                      type="number"
                      value={canopySpreadCm}
                      onChange={(e) => setCanopySpreadCm(e.target.value)}
                      className="w-full p-2 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Physical Observations *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe foliage color, leaf pests, apical shoot health, moisture in basin..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="w-full p-2 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">Maintenance Carried Out</label>
                  <input
                    type="text"
                    value={maintenancePerformed}
                    onChange={(e) => setMaintenancePerformed(e.target.value)}
                    className="w-full p-2 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-4 py-2 border border-border rounded bg-bg text-charcoal hover:bg-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary text-white font-semibold rounded hover:bg-primary-hover shadow-sm"
                  >
                    Submit Verified Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
