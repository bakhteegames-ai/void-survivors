/**
 * Yandex Games SDK Wrapper
 * Handles SDK initialization, ads, leaderboards, and player data
 */
export class YandexSDK {
    constructor() {
        this.sdk = null;
        this.player = null;
        this.isReady = false;
        this.lastAdTime = 0;
        this.AD_COOLDOWN = 120000; // 2 minutes between interstitials
    }

    async init() {
        try {
            if (typeof YaGames === 'undefined') {
                console.warn('YaGames not found — running in local mode');
                return;
            }
            this.sdk = await YaGames.init();
            this.isReady = true;

            // Initialize player
            try {
                this.player = await this.sdk.getPlayer({ scopes: false });
            } catch (e) {
                console.warn('Player init failed:', e);
            }

            // Game ready
            this.sdk.features.LoadingAPI?.ready();
        } catch (e) {
            console.warn('Yandex SDK init failed:', e);
        }
    }

    // --- Advertising ---

    async showInterstitial() {
        if (!this.isReady) return false;
        const now = Date.now();
        if (now - this.lastAdTime < this.AD_COOLDOWN) return false;

        return new Promise((resolve) => {
            this.sdk.adv.showFullscreenAdv({
                callbacks: {
                    onOpen: () => {
                        window.dispatchEvent(new Event('ad_open'));
                        if (window.soundManager && window.soundManager.ctx) window.soundManager.ctx.suspend();
                    },
                    onClose: (wasShown) => {
                        this.lastAdTime = Date.now();
                        window.dispatchEvent(new Event('ad_close'));
                        if (window.soundManager && window.soundManager.ctx) window.soundManager.ctx.resume();
                        resolve(wasShown);
                    },
                    onError: (error) => {
                        console.warn('Interstitial error:', error);
                        window.dispatchEvent(new Event('ad_close'));
                        if (window.soundManager && window.soundManager.ctx) window.soundManager.ctx.resume();
                        resolve(false);
                    },
                },
            });
        });
    }

    async showRewarded() {
        if (!this.isReady) return false;

        return new Promise((resolve) => {
            this.sdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: () => {
                        window.dispatchEvent(new Event('ad_open'));
                        if (window.soundManager && window.soundManager.ctx) window.soundManager.ctx.suspend();
                    },
                    onRewarded: () => {
                        resolve(true);
                    },
                    onClose: () => {
                        window.dispatchEvent(new Event('ad_close'));
                        if (window.soundManager && window.soundManager.ctx) window.soundManager.ctx.resume();
                        // resolved via onRewarded
                    },
                    onError: (error) => {
                        console.warn('Rewarded ad error:', error);
                        window.dispatchEvent(new Event('ad_close'));
                        if (window.soundManager && window.soundManager.ctx) window.soundManager.ctx.resume();
                        resolve(false);
                    },
                },
            });
        });
    }

    // --- Leaderboard ---

    async submitScore(leaderboardName, score) {
        if (!this.isReady) return;
        try {
            const lb = await this.sdk.getLeaderboards();
            await lb.setLeaderboardScore(leaderboardName, score);
        } catch (e) {
            console.warn('Submit score failed:', e);
        }
    }

    async getLeaderboard(leaderboardName, count = 10) {
        if (!this.isReady) return [];
        try {
            const lb = await this.sdk.getLeaderboards();
            const result = await lb.getLeaderboardEntries(leaderboardName, {
                quantityTop: count,
            });
            return result.entries.map((entry) => ({
                rank: entry.rank,
                name: entry.player.publicName || 'Anonymous',
                score: entry.score,
                avatar: entry.player.getAvatarSrc('small'),
            }));
        } catch (e) {
            console.warn('Get leaderboard failed:', e);
            return [];
        }
    }

    // --- Player Data ---

    async saveData(data) {
        if (!this.isReady || !this.player) return;
        try {
            await this.player.setData(data, true);
        } catch (e) {
            console.warn('Save data failed:', e);
        }
    }

    async loadData() {
        if (!this.isReady || !this.player) return null;
        try {
            return await this.player.getData();
        } catch (e) {
            console.warn('Load data failed:', e);
            return null;
        }
    }

    // --- Environment ---

    getLanguage() {
        if (!this.isReady) return 'en';
        return this.sdk.environment?.i18n?.lang || 'en';
    }

    isPremium() {
        // Reserved for future premium checks
        return false;
    }
}
