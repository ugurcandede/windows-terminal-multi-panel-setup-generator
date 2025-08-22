// Local Storage and Import/Export Management
class StorageManager {
    constructor() {
        this.storageKey = 'wt-generator-config';
        this.historyKey = 'wt-generator-history';
        this.settingsKey = 'wt-generator-settings';
        this.maxHistoryItems = 10;
    }

    // Save current configuration to localStorage
    saveConfiguration(panels, metadata = {}) {
        try {
            const config = {
                version: "1.0",
                timestamp: new Date().toISOString(),
                panels: this.sanitizePanels(panels),
                metadata: {
                    totalPanels: panels.length,
                    hasCommands: panels.some(p => p.commands && p.commands.trim()),
                    ...metadata
                }
            };

            localStorage.setItem(this.storageKey, JSON.stringify(config));
            this.addToHistory(config);
            return true;
        } catch (error) {
            console.error('Failed to save configuration:', error);
            return false;
        }
    }

    // Load configuration from localStorage
    loadConfiguration() {
        try {
            const configStr = localStorage.getItem(this.storageKey);
            if (!configStr) return null;

            const config = JSON.parse(configStr);
            return this.validateConfiguration(config) ? config : null;
        } catch (error) {
            console.error('Failed to load configuration:', error);
            return null;
        }
    }

    // Add configuration to history
    addToHistory(config) {
        try {
            const historyStr = localStorage.getItem(this.historyKey);
            let history = historyStr ? JSON.parse(historyStr) : [];

            // Remove duplicates and add new config
            history = history.filter(item =>
                JSON.stringify(item.panels) !== JSON.stringify(config.panels)
            );

            history.unshift({
                ...config,
                id: this.generateId(),
                name: this.generateConfigName(config.panels)
            });

            // Limit history size
            if (history.length > this.maxHistoryItems) {
                history = history.slice(0, this.maxHistoryItems);
            }

            localStorage.setItem(this.historyKey, JSON.stringify(history));
        } catch (error) {
            console.error('Failed to add to history:', error);
        }
    }

    // Get configuration history
    getHistory() {
        try {
            const historyStr = localStorage.getItem(this.historyKey);
            return historyStr ? JSON.parse(historyStr) : [];
        } catch (error) {
            console.error('Failed to get history:', error);
            return [];
        }
    }

    // Load configuration from history
    loadFromHistory(id) {
        const history = this.getHistory();
        return history.find(item => item.id === id) || null;
    }

    // Delete configuration from history
    deleteFromHistory(id) {
        try {
            const history = this.getHistory();
            const filteredHistory = history.filter(item => item.id !== id);
            localStorage.setItem(this.historyKey, JSON.stringify(filteredHistory));
            return true;
        } catch (error) {
            console.error('Failed to delete from history:', error);
            return false;
        }
    }

    // Save user settings
    saveSettings(settings) {
        try {
            const currentSettings = this.getSettings();
            const newSettings = { ...currentSettings, ...settings };
            localStorage.setItem(this.settingsKey, JSON.stringify(newSettings));
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }

    // Get user settings
    getSettings() {
        try {
            const settingsStr = localStorage.getItem(this.settingsKey);
            const defaultSettings = {
                theme: 'system', // 'light', 'dark', 'system'
                defaultProfile: 'PowerShell',
                defaultDirectory: 'C:\\',
                autoSave: true,
                showPreview: true,
                compactMode: false,
                notifications: true
            };

            return settingsStr ? { ...defaultSettings, ...JSON.parse(settingsStr) } : defaultSettings;
        } catch (error) {
            console.error('Failed to get settings:', error);
            return this.getDefaultSettings();
        }
    }

    // Get default settings
    getDefaultSettings() {
        return {
            theme: 'system',
            defaultProfile: 'PowerShell',
            defaultDirectory: 'C:\\',
            autoSave: true,
            showPreview: true,
            compactMode: false,
            notifications: true
        };
    }

    // Export configuration to JSON file
    exportConfiguration(panels, filename = null) {
        try {
            const config = {
                version: "1.0",
                exported: new Date().toISOString(),
                generator: "Windows Terminal Multi-Panel Setup Generator",
                configuration: {
                    panels: this.sanitizePanels(panels),
                    metadata: {
                        totalPanels: panels.length,
                        hasCommands: panels.some(p => p.commands && p.commands.trim()),
                        exportedBy: "User",
                        exportedAt: new Date().toISOString()
                    }
                }
            };

            const jsonString = JSON.stringify(config, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });

            // Generate filename if not provided
            if (!filename) {
                const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
                filename = `wt-config-${timestamp}.json`;
            }

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Failed to export configuration:', error);
            return false;
        }
    }

    // Import configuration from JSON file
    importConfiguration(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }

            if (!file.type.includes('json')) {
                reject(new Error('Invalid file type. Please select a JSON file.'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    const config = this.parseImportedConfig(jsonData);

                    if (this.validateConfiguration(config)) {
                        resolve(config);
                    } else {
                        reject(new Error('Invalid configuration format'));
                    }
                } catch (error) {
                    reject(new Error('Failed to parse JSON file: ' + error.message));
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsText(file);
        });
    }

    // Parse imported configuration (handle different formats)
    parseImportedConfig(jsonData) {
        // Handle direct panel array (legacy format)
        if (Array.isArray(jsonData)) {
            return {
                version: "1.0",
                panels: jsonData,
                metadata: {}
            };
        }

        // Handle template format
        if (jsonData.template && jsonData.template.panels) {
            return {
                version: "1.0",
                panels: jsonData.template.panels,
                metadata: { importedTemplate: jsonData.template.name }
            };
        }

        // Handle configuration format
        if (jsonData.configuration && jsonData.configuration.panels) {
            return {
                version: jsonData.version || "1.0",
                panels: jsonData.configuration.panels,
                metadata: jsonData.configuration.metadata || {}
            };
        }

        // Handle direct configuration format
        if (jsonData.panels) {
            return {
                version: jsonData.version || "1.0",
                panels: jsonData.panels,
                metadata: jsonData.metadata || {}
            };
        }

        throw new Error('Unsupported configuration format');
    }

    // Generate configuration from URL parameters
    generateUrlParams(panels) {
        try {
            const config = {
                v: "1",
                p: this.compressPanels(panels)
            };

            const params = new URLSearchParams();
            Object.entries(config).forEach(([key, value]) => {
                params.set(key, value);
            });

            return params.toString();
        } catch (error) {
            console.error('Failed to generate URL params:', error);
            return '';
        }
    }

    // Load configuration from URL parameters
    loadFromUrlParams(urlParams = null) {
        try {
            const params = new URLSearchParams(urlParams || window.location.search);
            const version = params.get('v');
            const panelsData = params.get('p');

            if (!panelsData) return null;

            const panels = this.decompressPanels(panelsData);
            return {
                version: version || "1.0",
                panels: panels,
                metadata: { source: 'url' }
            };
        } catch (error) {
            console.error('Failed to load from URL params:', error);
            return null;
        }
    }

    // Update URL with current configuration
    updateUrl(panels, replace = false) {
        try {
            const params = this.generateUrlParams(panels);
            const url = params ? `${window.location.pathname}?${params}` : window.location.pathname;

            if (replace) {
                window.history.replaceState({}, '', url);
            } else {
                window.history.pushState({}, '', url);
            }
        } catch (error) {
            console.error('Failed to update URL:', error);
        }
    }

    // Compress panels data for URL
    compressPanels(panels) {
        const compressed = panels.map(panel => ({
            t: panel.title,
            d: panel.directory,
            c: panel.commands || '',
            cl: panel.color,
            p: panel.profile,
            s: panel.split,
            sz: panel.size
        }));

        return btoa(JSON.stringify(compressed));
    }

    // Decompress panels data from URL
    decompressPanels(compressedData) {
        const compressed = JSON.parse(atob(compressedData));

        return compressed.map(panel => ({
            title: panel.t,
            directory: panel.d,
            commands: panel.c || '',
            color: panel.cl,
            profile: panel.p,
            split: panel.s,
            size: panel.sz
        }));
    }

    // Validate configuration structure
    validateConfiguration(config) {
        if (!config || typeof config !== 'object') return false;
        if (!config.panels || !Array.isArray(config.panels)) return false;
        if (config.panels.length === 0 || config.panels.length > 6) return false;

        return config.panels.every(panel => {
            return panel.title &&
                   panel.directory &&
                   panel.color &&
                   panel.profile &&
                   (panel.split === null || panel.split === 'vertical' || panel.split === 'horizontal') &&
                   (typeof panel.size === 'number' && panel.size > 0 && panel.size <= 1);
        });
    }

    // Sanitize panels data before saving
    sanitizePanels(panels) {
        return panels.map(panel => ({
            title: (panel.title || '').trim(),
            directory: (panel.directory || '').trim(),
            commands: (panel.commands || '').trim(),
            color: panel.color || '#64748b',
            profile: panel.profile || 'PowerShell',
            split: panel.split,
            size: Math.max(0.1, Math.min(0.9, panel.size || 1.0))
        }));
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Generate configuration name
    generateConfigName(panels) {
        if (panels.length === 1) {
            return panels[0].title || 'Single Panel';
        }

        const titles = panels.map(p => p.title).filter(t => t).slice(0, 2);
        const name = titles.join(' + ');

        if (panels.length > 2) {
            return `${name} + ${panels.length - 2} more`;
        }

        return name || `${panels.length} Panels`;
    }

    // Clear all stored data
    clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.historyKey);
            localStorage.removeItem(this.settingsKey);
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }

    // Get storage usage statistics
    getStorageStats() {
        try {
            const config = localStorage.getItem(this.storageKey);
            const history = localStorage.getItem(this.historyKey);
            const settings = localStorage.getItem(this.settingsKey);

            return {
                configSize: config ? config.length : 0,
                historySize: history ? history.length : 0,
                settingsSize: settings ? settings.length : 0,
                historyCount: this.getHistory().length,
                totalSize: (config?.length || 0) + (history?.length || 0) + (settings?.length || 0)
            };
        } catch (error) {
            console.error('Failed to get storage stats:', error);
            return null;
        }
    }
}

// Global instance
window.storageManager = new StorageManager();
