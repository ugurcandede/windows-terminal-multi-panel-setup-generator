// Main Application Controller
class WindowsTerminalGenerator {
    constructor() {
        this.currentFormat = 'powershell';
        this.isInitialized = false;
        this.keyboardShortcuts = {
            'ctrl+n': () => this.panelManager.addPanel(),
            'delete': () => this.handleDeleteKey(),
            'ctrl+s': () => this.exportConfiguration(),
            'ctrl+c': () => this.copyCurrentOutput(),
            'escape': () => this.panelManager.hideSuggestions()
        };

        this.init();
    }

    // Initialize application
    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
                return;
            }

            // Initialize managers
            this.templateManager = window.templateManager;
            this.storageManager = window.storageManager;
            this.commandGenerator = window.commandGenerator;
            this.panelManager = window.panelManager;

            // Initialize UI components
            this.initializeTheme();
            this.initializeEventListeners();
            this.initializeTemplates();
            
            // Load saved configuration or URL parameters BEFORE initializing output
            await this.loadInitialConfiguration();
            
            // Initialize output AFTER panels are loaded
            this.initializeOutput();

            // Mark as initialized
            this.isInitialized = true;

            console.log('Windows Terminal Generator initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showToast('Failed to initialize application', 'error');
        }
    }

    // Initialize theme system
    initializeTheme() {
        const settings = this.storageManager.getSettings();
        const themeToggle = document.getElementById('theme-toggle');

        // Apply saved theme or detect system preference
        this.applyTheme(settings.theme);

        // Theme toggle event listener
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.applyTheme(newTheme);
                this.storageManager.saveSettings({ theme: newTheme });
            });
        }
    }

    // Apply theme
    applyTheme(theme) {
        const html = document.documentElement;

        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }

        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

        // Update theme toggle icon
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const moonIcon = themeToggle.querySelector('.fa-moon');
            const sunIcon = themeToggle.querySelector('.fa-sun');

            if (theme === 'dark') {
                moonIcon?.classList.add('hidden');
                sunIcon?.classList.remove('hidden');
            } else {
                moonIcon?.classList.remove('hidden');
                sunIcon?.classList.add('hidden');
            }
        }
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Template buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.template-btn, .template-btn *')) {
                const button = e.target.closest('.template-btn');
                const templateId = button?.dataset.template;
                if (templateId) this.loadTemplate(templateId);
            }
        });

        // Output format tabs
        document.addEventListener('click', (e) => {
            if (e.target.matches('.output-tab, .output-tab *')) {
                const tab = e.target.closest('.output-tab');
                const format = tab?.dataset.format;
                if (format) this.switchOutputFormat(format);
            }
        });

        // Copy output button
        document.addEventListener('click', (e) => {
            if (e.target.matches('#copy-output, #copy-output *')) {
                e.preventDefault();
                this.copyCurrentOutput();
            }
        });

        // Refresh output button
        document.addEventListener('click', (e) => {
            if (e.target.matches('#refresh-output, #refresh-output *')) {
                e.preventDefault();
                this.refreshOutput();
            }
        });

        // Import/Export buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('#import-config, #import-config *')) {
                e.preventDefault();
                this.importConfiguration();
            } else if (e.target.matches('#export-config, #export-config *')) {
                e.preventDefault();
                this.exportConfiguration();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Auto-save on panel changes
        document.addEventListener('panelsChanged', () => {
            this.updateOutput();
            this.updateUrlIfNeeded();
        });

        // Window beforeunload for unsaved changes warning
        window.addEventListener('beforeunload', (e) => {
            const hasUnsavedChanges = this.panelManager.getPanels().length > 0;
            if (hasUnsavedChanges && !this.storageManager.getSettings().autoSave) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.loadFromUrlIfAvailable();
        });
    }

    // Initialize templates
    initializeTemplates() {
        // Template buttons are already rendered in HTML
        // Just ensure they're working properly
        const templateButtons = document.querySelectorAll('.template-btn');
        templateButtons.forEach(button => {
            const templateId = button.dataset.template;
            const template = this.templateManager.getTemplate(templateId);

            if (!template) {
                button.style.display = 'none';
            }
        });
    }

    // Initialize output section
    initializeOutput() {
        this.switchOutputFormat(this.currentFormat);
        this.updateOutput();
    }

    // Load initial configuration
    async loadInitialConfiguration() {
        try {
            // First try to load from URL parameters
            const urlConfig = this.storageManager.loadFromUrlParams();
            if (urlConfig && urlConfig.panels.length > 0) {
                this.panelManager.loadPanels(urlConfig.panels);
                this.showToast('Configuration loaded from URL', 'success');
                return;
            }

            // Then try to load from localStorage
            const savedConfig = this.storageManager.loadConfiguration();
            if (savedConfig && savedConfig.panels.length > 0) {
                this.panelManager.loadPanels(savedConfig.panels);
                this.showToast('Previous configuration restored', 'info');
                return;
            }

            // Finally, load default template
            this.loadTemplate('custom');
        } catch (error) {
            console.error('Error loading initial configuration:', error);
            this.loadTemplate('custom');
        }
    }

    // Load template
    loadTemplate(templateId) {
        try {
            const template = this.templateManager.getTemplate(templateId);
            if (!template) {
                this.showToast('Template not found', 'error');
                return;
            }

            // Clear existing panels
            this.panelManager.clearAllPanels();

            // Load template panels
            if (template.panels && template.panels.length > 0) {
                this.panelManager.loadPanels(template.panels);
                this.showToast(`${template.name} template loaded`, 'success');
            }

            // Update output
            this.updateOutput();

        } catch (error) {
            console.error('Error loading template:', error);
            this.showToast('Failed to load template', 'error');
        }
    }

    // Switch output format
    switchOutputFormat(format) {
        if (!this.commandGenerator.supportedFormats.includes(format)) {
            return;
        }

        this.currentFormat = format;

        // Update tab active state
        document.querySelectorAll('.output-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.format === format) {
                tab.classList.add('active');
            }
        });

        // Update title
        const title = this.commandGenerator.getTitleForFormat(format);
        const titleElement = document.getElementById('output-title');
        if (titleElement) {
            titleElement.textContent = title;
        }

        // Update output
        this.updateOutput();
    }

    // Update output display
    updateOutput() {
        try {
            const panels = this.panelManager.getPanels();
            const codeElement = document.getElementById('output-code');

            if (!codeElement) return;

            // Check if there are no panels first
            if (!panels || panels.length === 0) {
                codeElement.textContent = '# Configure panels to see generated output';
                codeElement.className = 'language-text';

                // Re-highlight syntax
                if (window.Prism) {
                    window.Prism.highlightElement(codeElement);
                }
                return;
            }

            // Validate panels for other errors
            const errors = this.commandGenerator.validatePanels(panels);
            if (errors.length > 0) {
                codeElement.textContent = `# Configuration Errors:\n# ${errors.join('\n# ')}`;
                codeElement.className = 'language-text';
            } else {
                // Generate output based on current format
                let output = '';
                switch (this.currentFormat) {
                    case 'powershell':
                        output = this.commandGenerator.generatePowerShellCommand(panels);
                        break;
                    case 'json':
                        output = this.commandGenerator.generateJSONAction(panels);
                        break;
                    case 'batch':
                        output = this.commandGenerator.generateBatchFile(panels);
                        break;
                    default:
                        output = '# Unknown format';
                }

                codeElement.textContent = output;
                codeElement.className = `language-${this.commandGenerator.getLanguageForFormat(this.currentFormat)}`;
            }

            // Re-highlight syntax
            if (window.Prism) {
                window.Prism.highlightElement(codeElement);
            }

        } catch (error) {
            console.error('Error updating output:', error);
            const codeElement = document.getElementById('output-code');
            if (codeElement) {
                codeElement.textContent = '# Error generating output: ' + error.message;
                codeElement.className = 'language-text';
            }
        }
    }

    // Copy current output to clipboard
    async copyCurrentOutput() {
        try {
            const codeElement = document.getElementById('output-code');
            if (!codeElement) return;

            const success = await this.commandGenerator.copyToClipboard(codeElement.textContent);

            if (success) {
                this.showToast('Copied to clipboard!', 'success');

                // Visual feedback on copy button
                const copyButton = document.getElementById('copy-output');
                if (copyButton) {
                    const originalText = copyButton.innerHTML;
                    copyButton.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
                    copyButton.classList.add('bg-green-500');
                    copyButton.classList.remove('bg-primary');

                    setTimeout(() => {
                        copyButton.innerHTML = originalText;
                        copyButton.classList.remove('bg-green-500');
                        copyButton.classList.add('bg-primary');
                    }, 2000);
                }
            } else {
                this.showToast('Failed to copy to clipboard', 'error');
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.showToast('Failed to copy to clipboard', 'error');
        }
    }

    // Import configuration
    importConfiguration() {
        const fileInput = document.getElementById('file-input');
        if (!fileInput) return;

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const config = await this.storageManager.importConfiguration(file);

                if (config && config.panels) {
                    this.panelManager.loadPanels(config.panels);
                    // Force output update after importing panels
                    this.updateOutput();
                    this.showToast('Configuration imported successfully', 'success');
                } else {
                    this.showToast('Invalid configuration file', 'error');
                }
            } catch (error) {
                console.error('Import error:', error);
                this.showToast(error.message, 'error');
            } finally {
                fileInput.value = ''; // Reset file input
            }
        };

        fileInput.click();
    }

    // Export configuration
    exportConfiguration() {
        try {
            const panels = this.panelManager.getPanels();

            if (panels.length === 0) {
                this.showToast('No panels to export', 'warning');
                return;
            }

            const success = this.storageManager.exportConfiguration(panels);

            if (success) {
                this.showToast('Configuration exported successfully', 'success');
            } else {
                this.showToast('Failed to export configuration', 'error');
            }
        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Failed to export configuration', 'error');
        }
    }

    // Refresh output manually
    refreshOutput() {
        // Update output immediately
        this.updateOutput();

        // Visual feedback on refresh button
        const refreshButton = document.getElementById('refresh-output');
        if (refreshButton) {
            const originalText = refreshButton.innerHTML;
            const icon = refreshButton.querySelector('.fa-sync-alt');

            // Add spinning animation
            if (icon) {
                icon.classList.add('fa-spin');
            }

            // Show refreshed state briefly
            setTimeout(() => {
                if (icon) {
                    icon.classList.remove('fa-spin');
                }
            }, 500);
        }

        this.showToast('Output refreshed', 'success', 2000);
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Build shortcut key string
        const keys = [];
        if (e.ctrlKey) keys.push('ctrl');
        if (e.altKey) keys.push('alt');
        if (e.shiftKey) keys.push('shift');
        keys.push(e.key.toLowerCase());

        const shortcut = keys.join('+');

        // Execute shortcut if exists
        if (this.keyboardShortcuts[shortcut]) {
            e.preventDefault();
            this.keyboardShortcuts[shortcut]();
        }
    }

    // Handle delete key for focused panels
    handleDeleteKey() {
        const activeElement = document.activeElement;
        const panelCard = activeElement?.closest('.panel-card');

        if (panelCard && !activeElement.matches('input, textarea, select')) {
            const panelId = panelCard.id;
            this.panelManager.deletePanel(panelId);
        }
    }

    // Update URL with current configuration (debounced)
    updateUrlIfNeeded() {
        if (this.urlUpdateTimeout) {
            clearTimeout(this.urlUpdateTimeout);
        }

        this.urlUpdateTimeout = setTimeout(() => {
            const panels = this.panelManager.getPanels();
            if (panels.length > 0) {
                this.storageManager.updateUrl(panels, true);
            }
        }, 1000);
    }

    // Load configuration from URL if available
    loadFromUrlIfAvailable() {
        try {
            const urlConfig = this.storageManager.loadFromUrlParams();
            if (urlConfig && urlConfig.panels.length > 0) {
                this.panelManager.loadPanels(urlConfig.panels);
            }
        } catch (error) {
            console.error('Error loading from URL:', error);
        }
    }

    // Show toast notification
    showToast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type} scale-in`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${this.getToastIcon(type)} mr-3"></i>
                <span>${message}</span>
                <button class="toast-close ml-4">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add to container
        container.appendChild(toast);

        // Auto remove after duration
        const removeToast = () => {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        };

        // Close button event
        toast.querySelector('.toast-close').addEventListener('click', removeToast);

        // Auto remove
        setTimeout(removeToast, duration);
    }

    // Get icon for toast type
    getToastIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            case 'info': return 'info-circle';
            default: return 'info-circle';
        }
    }

    // Get current application state
    getState() {
        return {
            panels: this.panelManager.getPanels(),
            format: this.currentFormat,
            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
            settings: this.storageManager.getSettings()
        };
    }

    // Development/debugging helper
    debug() {
        console.log('=== Windows Terminal Generator Debug Info ===');
        console.log('Initialized:', this.isInitialized);
        console.log('Current format:', this.currentFormat);
        console.log('Panels:', this.panelManager.getPanels());
        console.log('Settings:', this.storageManager.getSettings());
        console.log('Storage stats:', this.storageManager.getStorageStats());
        console.log('===========================================');
    }
}

// Initialize application when DOM is ready
let app;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new WindowsTerminalGenerator();
        window.app = app; // Make globally accessible
    });
} else {
    app = new WindowsTerminalGenerator();
    window.app = app;
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WindowsTerminalGenerator;
}
