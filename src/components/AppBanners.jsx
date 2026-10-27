import { useEffect, useState } from 'react'

const DISMISS_KEY = 'gocos-install-dismissed'

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

function isIOS() {
  const ua = window.navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && 'ontouchend' in document)
}

function wasDismissed() {
  try { return localStorage.getItem(DISMISS_KEY) === '1' } catch { return false }
}

export default function AppBanners() {
  const [online, setOnline] = useState(navigator.onLine)
  const [deferred, setDeferred] = useState(null)
  const [showIOS, setShowIOS] = useState(false)
  const [hidden, setHidden] = useState(wasDismissed())

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    const onPrompt = e => { e.preventDefault(); setDeferred(e) }
    const onInstalled = () => { setDeferred(null); setHidden(true) }
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    if (isIOS() && !isStandalone()) setShowIOS(true)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  function dismiss() {
    setHidden(true)
    try { localStorage.setItem(DISMISS_KEY, '1') } catch { /* storage unavailable */ }
  }

  async function install() {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
  }

  const showInstall = !hidden && !isStandalone() && (deferred || showIOS)

  return (
    <>
      {!online && (
        <div className="offline-banner" role="status">
          You are offline. Showing saved data; it will refresh when you reconnect.
        </div>
      )}
      {showInstall && (
        <div className="install-banner" role="dialog" aria-label="Install GOCOS">
          <img src="/icon-192.png" alt="" className="install-icon" />
          <div className="install-text">
            <strong>Install GOCOS</strong>
            {deferred
              ? <span>Add the app to your home screen for quick, offline access.</span>
              : <span>Tap the Share button, then “Add to Home Screen.”</span>}
          </div>
          {deferred && <button className="install-btn" onClick={install}>Install</button>}
          <button className="install-close" onClick={dismiss} aria-label="Dismiss">×</button>
        </div>
      )}
    </>
  )
}
