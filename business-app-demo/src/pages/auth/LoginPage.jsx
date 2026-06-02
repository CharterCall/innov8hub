import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithPassword, setRememberMe,
  getAal, listMfaFactors, challengeAndVerifyMfa, signOut,
  sendPasswordResetEmail,
} from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const DEMO_EMAIL    = 'demo@innov8hub.io'
const DEMO_PASSWORD = 'Innov8HubDemo2026!'

export default function LoginPage() {
  const { session } = useAuth()
  const navigate    = useNavigate()

  // Only redirect once MFA is satisfied (if required)
  useEffect(() => {
    if (!session) return
    getAal().then(({ data }) => {
      if (data?.nextLevel === 'aal2' && data?.currentLevel !== 'aal2') return // wait for MFA
      navigate('/', { replace: true })
    })
  }, [session, navigate])

  const [stage,    setStage]    = useState('password') // 'password' | 'mfa' | 'forgot' | 'forgot-sent'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [mfaCode,  setMfaCode]  = useState('')
  const [mfaFactorId, setMfaFactorId] = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true); setError(null)
    setRememberMe(remember)

    const { error: signInErr } = await signInWithPassword(email, password)
    if (signInErr) {
      setError('Incorrect email or password. If you\'re not yet a subscriber, contact hello@innov8hub.io to get access.')
      setLoading(false)
      return
    }

    // Check if MFA is required
    const { data: aal } = await getAal()
    if (aal?.nextLevel === 'aal2' && aal?.currentLevel !== 'aal2') {
      const { data: factors } = await listMfaFactors()
      const totp = factors?.totp?.[0]
      if (totp) {
        setMfaFactorId(totp.id)
        setStage('mfa')
      }
    }
    setLoading(false)
  }

  const handleMfaVerify = async (e) => {
    e.preventDefault()
    if (!mfaCode || mfaCode.length !== 6) return
    setLoading(true); setError(null)
    const { error: vErr } = await challengeAndVerifyMfa(mfaFactorId, mfaCode)
    if (vErr) {
      setError('Incorrect code. Please try again.')
      setMfaCode('')
    }
    setLoading(false)
  }

  const handleMfaCancel = async () => {
    await signOut()
    setStage('password')
    setMfaCode('')
    setMfaFactorId(null)
    setError(null)
  }

  const handleDemo = async () => {
    setLoading(true); setError(null)
    setRememberMe(false)
    const { error } = await signInWithPassword(DEMO_EMAIL, DEMO_PASSWORD)
    if (error) setError('Demo unavailable right now. Please try again shortly.')
    setLoading(false)
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true); setError(null)
    const { error } = await sendPasswordResetEmail(email)
    if (error) setError(error.message)
    else      setStage('forgot-sent')
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Branding */}
        <div className="text-center mb-lg">
          <img
            src="/logo.png"
            alt="Innov8Hub logo"
            style={{ maxWidth: '180px', width: '100%', height: 'auto', objectFit: 'contain', margin: '0 auto 0.75rem', display: 'block' }}
          />
          <p className="text-secondary" style={{ margin: 0, fontSize: '0.875rem' }}>Business Operations Portal</p>
        </div>

        {/* Client login — subscribers only */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          {stage === 'forgot-sent' ? (
            <div className="text-center">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📬</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Check your email</h3>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                If <strong>{email}</strong> has an account, we've sent a link to reset your password.
              </p>
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => { setStage('password'); setError(null) }}>
                Back to sign in
              </button>
            </div>
          ) : stage === 'forgot' ? (
            <>
              <h3 style={{ marginBottom: '0.25rem' }}>Reset your password</h3>
              <p className="text-secondary" style={{ fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                Enter your email and we'll send you a link to set a new password.
              </p>
              <form onSubmit={handleForgot}>
                <div className="mb-md">
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
                {error && (
                  <p className="text-danger" style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>{error}</p>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.5rem' }} disabled={loading}>
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
                <button type="button" className="btn btn-outline" style={{ width: '100%', fontSize: '0.825rem' }} onClick={() => { setStage('password'); setError(null) }}>
                  Back to sign in
                </button>
              </form>
            </>
          ) : stage === 'mfa' ? (
            <>
              <h3 style={{ marginBottom: '0.25rem' }}>Two-factor verification</h3>
              <p className="text-secondary" style={{ fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                Enter the 6-digit code from your authenticator app.
              </p>
              <form onSubmit={handleMfaVerify}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={mfaCode}
                  onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  autoFocus
                  required
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.5rem', fontFamily: 'monospace', marginBottom: '1rem' }}
                />
                {error && (
                  <p className="text-danger" style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>{error}</p>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.5rem' }} disabled={loading || mfaCode.length !== 6}>
                  {loading ? 'Verifying…' : 'Verify'}
                </button>
                <button type="button" className="btn btn-outline" style={{ width: '100%', fontSize: '0.825rem' }} onClick={handleMfaCancel}>
                  Cancel and sign out
                </button>
              </form>
            </>
          ) : (
          <>
          <h3 style={{ marginBottom: '0.25rem' }}>Client Login</h3>
          <p className="text-secondary" style={{ fontSize: '0.8rem', marginBottom: '1.25rem' }}>
            Subscriber access only. Contact{' '}
            <a href="mailto:hello@innov8hub.io" style={{ color: 'var(--primary-accent)' }}>hello@innov8hub.io</a>
            {' '}to get access.
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-md">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem' }}
              />
            </div>

            <div className="mb-md">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem' }}
              />
            </div>

            {/* Remember me — opts in to localStorage persistence */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-accent)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                Keep me signed in on this device
              </span>
            </label>

            {error && (
              <p className="text-danger" style={{ fontSize: '0.82rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>{error}</p>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            <div className="text-center" style={{ marginTop: '0.875rem' }}>
              <button type="button" onClick={() => { setStage('forgot'); setError(null) }}
                style={{ background: 'none', border: 'none', color: 'var(--primary-accent)', fontSize: '0.825rem', cursor: 'pointer', padding: 0, fontWeight: 600 }}>
                Forgot your password?
              </button>
            </div>
          </form>
          </>
          )}
        </div>

        {/* Demo section — hidden during MFA / forgot password */}
        {stage === 'password' && (
        <div className="card" style={{ background: 'linear-gradient(135deg, #EAF6F8, #E0F8FA)', border: '1px solid rgba(0,168,187,0.25)' }}>
          <p style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '0.9rem', color: '#0A1A2E' }}>
            Not a client yet?
          </p>
          <p className="text-secondary" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
            Explore a demo of the job tracker and invoice system in the Innov8Hub client portal.
          </p>
          <button
            className="btn"
            style={{ width: '100%', background: 'var(--primary-accent)', color: 'white', fontWeight: 600 }}
            onClick={handleDemo}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Demo'}
          </button>
        </div>
        )}

        <p className="text-center text-secondary" style={{ fontSize: '0.75rem', marginTop: '1.25rem' }}>
          © {new Date().getFullYear()} Innov8Hub. All rights reserved.
        </p>
      </div>
    </div>
  )
}
