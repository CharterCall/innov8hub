import { useEffect, useState } from 'react'
import { Check, Lock, Zap } from 'lucide-react'
import { getPlanEntitlements } from '../lib/supabase'
import { useBusiness }         from '../context/BusinessContext'

const PLAN_ORDER = ['admin_assistant','recurring_engine','growth_platform','automation_plus']
const isPlanAtOrAbove = (current, required) =>
  PLAN_ORDER.indexOf(current) >= PLAN_ORDER.indexOf(required)

const PLAN_PRICE = {
  admin_assistant:  { monthly: 99,  setup: 799  },
  recurring_engine: { monthly: 229, setup: 1499 },
  growth_platform:  { monthly: 399, setup: 2500 },
  automation_plus:  { monthly: 899, setup: 5000 },
}

const MOST_POPULAR = 'recurring_engine'

export default function SubscriptionPage() {
  const { subscription } = useBusiness()
  const [entitlements, setEntitlements] = useState([])
  const [showContact,  setShowContact]  = useState(null)

  const currentPlan  = subscription?.plan   ?? 'admin_assistant'
  const currentStatus = subscription?.status ?? 'active'
  const hasStripe    = Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

  useEffect(() => {
    getPlanEntitlements().then(({ data }) => {
      if (!data) return
      // Sort by defined plan order, not alphabetically
      const sorted = PLAN_ORDER.map(p => data.find(e => e.plan === p)).filter(Boolean)
      setEntitlements(sorted)
    })
  }, [])

  const handleUpgrade = (plan) => {
    if (hasStripe) {
      // TODO: call create-checkout-session edge function
      // const { data } = await supabase.functions.invoke('create-checkout-session', { body: { plan } })
      // if (data?.url) window.location.href = data.url
    }
    setShowContact(plan)
  }

  const statusBadge = (status) => ({
    trialing: { label: 'Trial',   color: '#92400e', bg: '#fef3c7' },
    active:   { label: 'Active',  color: '#065f46', bg: '#d1fae5' },
    past_due: { label: 'Past Due',color: '#991b1b', bg: '#fee2e2' },
    cancelled:{ label: 'Cancelled',color:'#374151', bg: '#f3f4f6' },
  }[status] ?? { label: status, color: '#374151', bg: '#f3f4f6' })

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-md">
        <h3 style={{ margin: 0 }}>Subscription</h3>
        {subscription && (() => {
          const b = statusBadge(currentStatus)
          return <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: b.bg, color: b.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.label}</span>
        })()}
      </div>

      {showContact && (
        <div className="card mb-md" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#16a34a', fontSize: '0.9rem' }}>
            To upgrade to {entitlements.find(e => e.plan === showContact)?.label ?? showContact}, contact us:
          </p>
          <a href="mailto:hello@innov8hub.com.au" style={{ color: 'var(--primary-color)', fontWeight: 600, display: 'block', marginTop: '0.35rem' }}>
            hello@innov8hub.com.au
          </a>
          <button className="btn btn-outline" style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', minHeight: '36px', fontSize: '0.8rem' }} onClick={() => setShowContact(null)}>
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-col gap-md">
        {entitlements.map(plan => {
          const isCurrent   = plan.plan === currentPlan
          const isLocked    = !isPlanAtOrAbove(currentPlan, plan.plan)
          const isPopular   = plan.plan === MOST_POPULAR
          const price       = PLAN_PRICE[plan.plan]
          const features    = Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features ?? '[]')

          return (
            <div key={plan.plan} className="card" style={{
              border: isCurrent ? '2px solid var(--primary-accent)' : isPopular ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
              position: 'relative',
            }}>
              {isCurrent && (
                <span style={{ position: 'absolute', top: '-1px', right: '1rem', background: 'var(--primary-accent)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: '0 0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Current Plan
                </span>
              )}
              {isPopular && !isCurrent && (
                <span style={{ position: 'absolute', top: '-1px', right: '1rem', background: 'var(--primary-color)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: '0 0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Most Popular
                </span>
              )}

              <div className="flex justify-between items-start mb-sm">
                <div>
                  <h4 style={{ margin: '0 0 0.2rem' }}>{plan.label}</h4>
                  <p className="text-secondary" style={{ margin: 0, fontSize: '0.8rem' }}>{plan.description}</p>
                </div>
                {price && (
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary-color)' }}>${price.monthly}</span>
                      <span className="text-secondary" style={{ fontSize: '0.75rem' }}>/mo</span>
                    </div>
                    {price.setup && <div className="text-secondary" style={{ fontSize: '0.7rem' }}>+ ${price.setup.toLocaleString()} setup</div>}
                  </div>
                )}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 1rem' }}>
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-sm" style={{ fontSize: '0.825rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    <Check size={14} style={{ color: 'var(--primary-accent)', flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.875rem' }} disabled>
                  Your current plan
                </button>
              ) : isLocked ? (
                <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.875rem' }} onClick={() => handleUpgrade(plan.plan)}>
                  <Zap size={15} /> Upgrade to {plan.label}
                </button>
              ) : (
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.875rem', color: 'var(--text-secondary)' }} disabled>
                  <Check size={15} /> Included in your plan
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="card mt-md" style={{ background: 'var(--bg-color)', border: 'none', textAlign: 'center' }}>
        <p className="text-secondary" style={{ fontSize: '0.8rem', margin: '0 0 0.5rem' }}>Need a custom plan or have questions?</p>
        <a href="mailto:hello@innov8hub.com.au" className="text-primary" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
          hello@innov8hub.com.au
        </a>
      </div>
    </div>
  )
}
