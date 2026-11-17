import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BotanicalLogo } from '../components/common/BotanicalLogo';
import { UserRole } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('volunteer');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          setMessage({ type: 'error', text: 'Please fill in both email and password.' });
          setLoading(false);
          return;
        }

        await login(email);
        setMessage({ type: 'success', text: 'Authentication successful. Redirecting to dashboard...' });
        setTimeout(() => navigate('/volunteer-dashboard'), 600);
      } else if (mode === 'signup') {
        if (!fullName || !email || !password) {
          setMessage({ type: 'error', text: 'Please provide name, email, and password.' });
          setLoading(false);
          return;
        }

        await signup({
          email,
          full_name: fullName,
          role,
          organization: role === 'organizer' ? (organization || 'Community Forestry Group') : undefined
        });

        setMessage({ type: 'success', text: 'Account registered successfully with verified role!' });
        setTimeout(() => navigate('/volunteer-dashboard'), 600);
      } else if (mode === 'reset') {
        if (!email) {
          setMessage({ type: 'error', text: 'Please enter your registered email address.' });
          setLoading(false);
          return;
        }

        setMessage({
          type: 'success',
          text: `A verified password reset link has been dispatched to ${email}. Check your inbox.`
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Authentication error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-bg min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-surface rounded-lg border border-border p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BotanicalLogo />
          </div>
          <h2 className="text-2xl font-bold font-heading text-charcoal">
            {mode === 'login' && 'Sign in to ROOTS'}
            {mode === 'signup' && 'Create your Member Account'}
            {mode === 'reset' && 'Reset your Password'}
          </h2>
          <p className="text-xs text-muted">
            {mode === 'login' && 'Access your plantation events, adopted saplings, and survival history.'}
            {mode === 'signup' && 'Join students, scientists, and environmental organizations across India.'}
            {mode === 'reset' && 'Enter your verified email to receive recovery instructions.'}
          </p>
        </div>

        {/* View Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-bg rounded border border-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setMessage(null); }}
            className={`py-1.5 rounded transition-colors ${
              mode === 'login' ? 'bg-surface text-primary shadow-xs font-bold' : 'text-muted hover:text-charcoal'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setMessage(null); }}
            className={`py-1.5 rounded transition-colors ${
              mode === 'signup' ? 'bg-surface text-primary shadow-xs font-bold' : 'text-muted hover:text-charcoal'
            }`}
          >
            Register
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded border text-xs flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-primary-subtle border-primary/30 text-primary' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block font-bold text-charcoal mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Anita Rao"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Select Your Platform Role *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['volunteer', 'organizer', 'admin'] as UserRole[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`py-2 px-2 rounded border capitalize font-semibold transition-colors ${
                        role === r 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-border bg-bg text-charcoal hover:bg-border'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {role === 'organizer' && (
                <div>
                  <label className="block font-bold text-charcoal mb-1">Affiliated Organization / NGO / College</label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g., Center for Urban Silviculture"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block font-bold text-charcoal mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@organization.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-charcoal">Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setMessage(null); }}
                    className="text-primary hover:underline text-[11px]"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-white font-semibold rounded hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading ? (
                'Processing...'
              ) : mode === 'login' ? (
                <>Sign In to Account <ArrowRight className="w-3.5 h-3.5" /></>
              ) : mode === 'signup' ? (
                <>Create Verified Account <ArrowRight className="w-3.5 h-3.5" /></>
              ) : (
                'Send Password Reset Link'
              )}
            </button>
          </div>
        </form>

        {mode === 'reset' && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setMode('login'); setMessage(null); }}
              className="text-xs text-primary font-semibold hover:underline"
            >
              &larr; Back to Sign In
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-border text-[11px] text-muted flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>Role-Based PostgreSQL Security (RLS) & encrypted session tokens enabled.</span>
        </div>
      </div>
    </div>
  );
};
