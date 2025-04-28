'use client';

import { useState, useEffect } from 'react';

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promptEvent = deferredPrompt as any;
    promptEvent.prompt();

    // Wait for user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) return <>All good</>;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-blue-700 transition-all"
    >
      Install App
    </button>
  );
}
