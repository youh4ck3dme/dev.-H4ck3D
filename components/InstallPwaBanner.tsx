import React, { useState, useEffect } from 'react';

// This interface is needed to extend the Window object for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

const InstallPwaBanner: React.FC = () => {
    const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [isBannerVisible, setIsBannerVisible] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
            event.preventDefault();
            setInstallPromptEvent(event);
            
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            if (!isStandalone) {
                setIsBannerVisible(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        const handleAppInstalled = () => {
            setIsBannerVisible(false);
            setInstallPromptEvent(null);
        };

        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPromptEvent) {
            return;
        }

        await installPromptEvent.prompt();
        const { outcome } = await installPromptEvent.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the PWA installation');
        } else {
            console.log('User dismissed the PWA installation');
        }

        setInstallPromptEvent(null);
        setIsBannerVisible(false);
    };

    const handleDismissClick = () => {
        setIsBannerVisible(false);
    };

    if (!isBannerVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl flex items-center justify-between gap-4 animate-slideIn">
            <div>
                <p className="font-semibold text-gray-900 dark:text-white">Install H4CK3D App</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get a better experience. It's fast and offline-ready.</p>
            </div>
            <div className="flex-shrink-0 flex gap-2">
                <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 text-sm font-semibold text-black bg-cyan-500 rounded-md hover:bg-cyan-400 transition-colors"
                >
                    Install
                </button>
                 <button
                    onClick={handleDismissClick}
                    aria-label="Dismiss install banner"
                    className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default InstallPwaBanner;