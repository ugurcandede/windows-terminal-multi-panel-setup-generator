// Panel Management and UI Components
class PanelManager {
    constructor() {
        this.panels = [];
        this.maxPanels = 6;
        this.minPanels = 0; // Allow deleting all panels
        this.panelCounter = 0;
        this.sortable = null;
        this.previewUpdateTimeout = null;

        this.initializeEventListeners();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Add panel button
        document.addEventListener('click', (e) => {
            if (e.target.matches('#add-panel, #add-panel *')) {
                e.preventDefault();
                this.addPanel();
            }
        });

        // Panel form changes
        document.addEventListener('input', (e) => {
            if (e.target.matches('.panel-input, .panel-select, .panel-textarea')) {
                this.handlePanelInputChange(e.target);
            }
        });

        // Panel color selection
        document.addEventListener('click', (e) => {
            if (e.target.matches('.color-option')) {
                this.handleColorSelection(e.target);
            }
        });

        // Custom color picker change
        document.addEventListener('input', (e) => {
            if (e.target.matches('.custom-color-input')) {
                this.handleCustomColorSelection(e.target);
            }
        });

        // Panel deletion
        document.addEventListener('click', (e) => {
            if (e.target.matches('.delete-panel, .delete-panel *')) {
                e.preventDefault();
                const panelId = this.findPanelId(e.target);
                if (panelId) this.deletePanel(panelId);
            }
        });

        // Directory suggestions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.directory-suggestion')) {
                this.handleDirectorySuggestion(e.target);
            }
        });

        // Command suggestions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.command-suggestion-item')) {
                this.handleCommandSuggestion(e.target);
            }
        });

        // Hide suggestions on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.matches('.panel-input, .directory-suggestion, .command-suggestion-item')) {
                this.hideSuggestions();
            }
        });

        // Panel collapse functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('.collapse-panel, .collapse-panel *')) {
                e.preventDefault();
                const panelId = this.findPanelId(e.target);
                if (panelId) this.togglePanelCollapse(panelId);
            }
        });

        // Collapse all panels functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('#collapse-all-panels, #collapse-all-panels *')) {
                e.preventDefault();
                this.toggleAllPanelsCollapse();
            }
        });
    }

    // Add new panel
    addPanel(panelData = null) {
        if (this.panels.length >= this.maxPanels) {
            this.showToast('Maximum 6 panels allowed', 'warning');
            return;
        }

        const panelId = `panel-${++this.panelCounter}`;
        const panel = panelData || this.createDefaultPanel();
        panel.id = panelId;

        this.panels.push(panel);
        this.renderPanelCard(panel);
        this.updatePreview();
        this.updateAddButtonState();

        // Update the "Collapse All" button icon when new panel is added
        this.updateCollapseAllButtonIcon();

        // Auto-save if enabled
        if (window.storageManager?.getSettings().autoSave) {
            this.autoSave();
        }

        // Scroll to new panel
        setTimeout(() => {
            const panelElement = document.getElementById(panelId);
            if (panelElement) {
                panelElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);

        this.showToast(`Panel ${this.panels.length} added`, 'success');
    }

    // Create default panel data
    createDefaultPanel() {
        const isFirstPanel = this.panels.length === 0;
        const settings = window.storageManager?.getSettings() || {};

        return {
            title: `Panel ${this.panels.length + 1}`,
            directory: settings.defaultDirectory || 'C:\\',
            commands: '',
            color: this.getNextColor(),
            profile: settings.defaultProfile || 'PowerShell',
            split: isFirstPanel ? null : 'vertical',
            size: isFirstPanel ? 1.0 : 0.5
        };
    }

    // Get next color in rotation
    getNextColor() {
        const colors = window.templateManager?.getPanelColors() || [
            { value: '#4ecdc4' }, { value: '#ff6b6b' }, { value: '#45b7d1' },
            { value: '#96ceb4' }, { value: '#ffeaa7' }, { value: '#dda0dd' }
        ];
        return colors[this.panels.length % colors.length].value;
    }

    // Delete panel
    deletePanel(panelId) {
        if (this.panels.length <= this.minPanels) {
            this.showToast('At least one panel is required', 'error');
            return;
        }

        const index = this.panels.findIndex(p => p.id === panelId);
        if (index === -1) return;

        // Remove from array
        const panel = this.panels[index];
        this.panels.splice(index, 1);

        // Remove from DOM
        const panelElement = document.getElementById(panelId);
        if (panelElement) {
            panelElement.style.transform = 'scale(0.9)';
            panelElement.style.opacity = '0';
            setTimeout(() => panelElement.remove(), 200);
        }

        // Update remaining panels (fix split properties for first panel)
        if (this.panels.length > 0) {
            this.panels[0].split = null;
            this.panels[0].size = 1.0;
            this.renderPanelCard(this.panels[0]);
        }

        this.updatePreview();
        this.updateAddButtonState();
        this.autoSave();

        // Dispatch panelsChanged event to trigger output update
        document.dispatchEvent(new CustomEvent('panelsChanged'));

        this.showToast(`Panel "${panel.title}" deleted`, 'success');
    }

    // Render panel card in DOM
    renderPanelCard(panel) {
        const container = document.getElementById('panels-container');
        if (!container) return;

        // Remove existing card if updating
        const existingCard = document.getElementById(panel.id);
        if (existingCard) {
            existingCard.remove();
        }

        const cardElement = document.createElement('div');
        cardElement.id = panel.id;

        // Add collapsed class if panel is collapsed
        let cardClasses = 'panel-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 fade-in';
        if (panel.collapsed) {
            cardClasses += ' panel-collapsed';
        }

        cardElement.className = cardClasses;
        cardElement.innerHTML = this.generatePanelCardHTML(panel);

        container.appendChild(cardElement);
        this.initializePanelCard(panel);
    }

    // Generate panel card HTML
    generatePanelCardHTML(panel) {
        const isFirstPanel = this.panels.findIndex(p => p.id === panel.id) === 0;
        const profiles = window.templateManager?.getProfiles() || [];
        const colors = window.templateManager?.getPanelColors() || [];
        const panelIndex = this.panels.findIndex(p => p.id === panel.id) + 1;
        const displayTitle = panel.title && panel.title.trim() !== '' && !panel.title.startsWith('Panel ')
            ? panel.title
            : `Panel ${panelIndex}`;

        // Determine initial collapse state - her zaman fa-chevron-up ile başla
        const isCollapsed = panel.collapsed || false;
        const panelContentClass = isCollapsed ? 'panel-content hidden' : 'panel-content';

        return `
            <div class="panel-header flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <div class="drag-handle cursor-move p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <i class="fas fa-grip-vertical"></i>
                    </div>
                    <h3 class="text-lg font-semibold">${displayTitle}</h3>
                    <div class="w-4 h-4 rounded-full border-2 border-white" style="background-color: ${panel.color}"></div>
                </div>
                
                <div class="flex items-center space-x-2">
                    <button class="collapse-panel btn-ghost p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg" title="Collapse/Expand">
                        <i class="fas fa-chevron-up collapse-icon ${isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}"></i>
                    </button>
                    <button class="delete-panel btn-ghost p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>

            <div class="${panelContentClass}">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Left Column -->
                    <div class="col-span-2 space-y-4">
                        <!-- Title -->
                        <div class="form-group">
                            <label class="form-label">Tab Title</label>
                            <input type="text" class="panel-input form-input" 
                                   data-field="title" data-panel="${panel.id}"
                                   value="${this.escapeHTML(panel.title)}" 
                                   placeholder="Enter panel title">
                        </div>

                        <!-- Directory -->
                        <div class="form-group relative">
                            <label class="form-label">Starting Directory</label>
                            <input type="text" class="panel-input form-input" 
                                   data-field="directory" data-panel="${panel.id}"
                                   value="${this.escapeHTML(panel.directory)}" 
                                   placeholder="C:\\Projects\\myapp">
                            <div class="directory-suggestions hidden"></div>
                        </div>

                        <!-- Commands -->
                        <div class="form-group relative">
                            <label class="form-label">Commands to Execute</label>
                            <div class="command-suggestions">
                                <textarea class="panel-textarea form-input form-textarea" 
                                        data-field="commands" data-panel="${panel.id}"
                                        placeholder="npm run dev">${this.escapeHTML(panel.commands)}</textarea>
                                <div class="command-suggestion-list hidden"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="col-span-1 space-y-4">
                        <!-- Color -->
                        <div class="form-group">
                            <label class="form-label">Tab Color</label>
                            <div class="color-picker-grid grid grid-cols-6 gap-2 mb-2">
                                ${colors.map(color => `
                                    <button class="color-option ${panel.color === color.value ? 'selected' : ''}" 
                                            data-panel="${panel.id}" data-color="${color.value}"
                                            style="background-color: ${color.value}"
                                            title="${color.name}">
                                    </button>
                                `).join('')}
                                <!-- Custom Color Picker -->
                                <div class="custom-color-wrapper relative">
                                    <input type="color" 
                                           class="custom-color-input w-10 h-10 rounded-lg border-2 border-transparent cursor-pointer"
                                           data-panel="${panel.id}"
                                           value="${panel.color}"
                                           title="Custom Color">
                                    <div class="custom-color-label absolute -bottom-6 left-0 text-xs text-gray-500 dark:text-gray-400">Custom</div>
                                </div>
                            </div>
                        </div>

                        <!-- Profile -->
                        <div class="form-group">
                            <label class="form-label">Profile</label>
                            <select class="panel-select form-input form-select" 
                                    data-field="profile" data-panel="${panel.id}">
                                ${profiles.map(profile => `
                                    <option value="${profile.value}" ${panel.profile === profile.value ? 'selected' : ''}>
                                        ${profile.label}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        ${!isFirstPanel ? `
                            <!-- Split Direction -->
                            <div class="form-group">
                                <label class="form-label">Split Direction</label>
                                <div class="flex space-x-4 mt-2">
                                    <label class="flex items-center">
                                        <input type="radio" name="split-${panel.id}" value="vertical" 
                                               ${panel.split === 'vertical' ? 'checked' : ''}
                                               class="panel-input mr-2" data-field="split" data-panel="${panel.id}">
                                        <span>Vertical</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="radio" name="split-${panel.id}" value="horizontal"
                                               ${panel.split === 'horizontal' ? 'checked' : ''}
                                               class="panel-input mr-2" data-field="split" data-panel="${panel.id}">
                                        <span>Horizontal</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Panel Size -->
                            <div class="form-group">
                                <label class="form-label">Panel Size</label>
                                <div class="flex items-center space-x-3">
                                    <input type="range" min="0.1" max="0.9" step="0.1" 
                                           value="${panel.size}" 
                                           class="panel-input range-slider flex-1" 
                                           data-field="size" data-panel="${panel.id}">
                                    <span class="size-display text-sm font-mono">${Math.round(panel.size * 100)}%</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize panel card interactions
    initializePanelCard(panel) {
        const cardElement = document.getElementById(panel.id);
        if (!cardElement) return;

        // Auto-suggest title based on directory
        const directoryInput = cardElement.querySelector('[data-field="directory"]');
        if (directoryInput) {
            directoryInput.addEventListener('input', () => {
                this.updateTitleSuggestion(panel.id);
                this.showDirectorySuggestions(directoryInput);
            });

            directoryInput.addEventListener('focus', () => {
                this.showDirectorySuggestions(directoryInput);
            });
        }

        // Command suggestions
        const commandsInput = cardElement.querySelector('[data-field="commands"]');
        if (commandsInput) {
            commandsInput.addEventListener('input', () => {
                this.showCommandSuggestions(commandsInput);
            });

            commandsInput.addEventListener('focus', () => {
                this.showCommandSuggestions(commandsInput);
            });
        }

        // Size slider display update
        const sizeSlider = cardElement.querySelector('[data-field="size"]');
        const sizeDisplay = cardElement.querySelector('.size-display');
        if (sizeSlider && sizeDisplay) {
            sizeSlider.addEventListener('input', () => {
                sizeDisplay.textContent = `${Math.round(sizeSlider.value * 100)}%`;
            });
        }

        // Initialize sortable if not already done
        if (!this.sortable) {
            this.initializeSortable();
        }

        // NOT: Collapse event listener'ı burada değil, global event listener'da çalışıyor
        // Bu yüzden burada local collapse event listener'ı kaldırdık
    }

    // Initialize sortable functionality
    initializeSortable() {
        const container = document.getElementById('panels-container');
        if (!container || !window.Sortable) return;

        this.sortable = new Sortable(container, {
            handle: '.drag-handle',
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            onEnd: (evt) => {
                // Update panels array order
                const movedPanel = this.panels.splice(evt.oldIndex, 1)[0];
                this.panels.splice(evt.newIndex, 0, movedPanel);

                // Fix split properties (first panel should not have split)
                this.panels.forEach((panel, index) => {
                    if (index === 0) {
                        panel.split = null;
                        panel.size = 1.0;
                    } else if (!panel.split) {
                        panel.split = 'vertical';
                        panel.size = 0.5;
                    }
                });

                // Re-render all panels to update titles and properties
                this.renderAllPanels();
                this.updatePreview();
                this.autoSave();

                this.showToast('Panels reordered', 'success');
            }
        });
    }

    // Handle panel input changes
    handlePanelInputChange(input) {
        const panelId = input.dataset.panel;
        const field = input.dataset.field;
        const panel = this.panels.find(p => p.id === panelId);

        if (!panel) return;

        // Get value based on input type
        let value = input.value;
        if (input.type === 'range') {
            value = parseFloat(value);
        } else if (input.type === 'radio' && input.checked) {
            value = input.value;
        } else if (input.type === 'radio' && !input.checked) {
            return; // Skip unchecked radio buttons
        }

        // Update panel data
        panel[field] = value;

        // If title field changed, update panel header display immediately
        if (field === 'title') {
            this.updatePanelHeaderTitle(panelId);
        }

        // Update preview with debounce
        clearTimeout(this.previewUpdateTimeout);
        this.previewUpdateTimeout = setTimeout(() => {
            this.updatePreview();
            // Dispatch panelsChanged event to trigger output update
            document.dispatchEvent(new CustomEvent('panelsChanged'));
        }, 300);

        this.autoSave();
    }

    // Handle color selection
    handleColorSelection(colorButton) {
        const panelId = colorButton.dataset.panel;
        const color = colorButton.dataset.color;
        const panel = this.panels.find(p => p.id === panelId);

        if (!panel) return;

        // Update panel color
        panel.color = color;

        // Update UI
        const cardElement = document.getElementById(panelId);
        cardElement.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        colorButton.classList.add('selected');

        // Update color indicator
        const colorIndicator = cardElement.querySelector('.w-4.h-4.rounded-full');
        if (colorIndicator) {
            colorIndicator.style.backgroundColor = color;
        }

        this.updatePreview();
        this.autoSave();

        // Dispatch panelsChanged event to trigger output update
        document.dispatchEvent(new CustomEvent('panelsChanged'));
    }

    // Handle custom color selection
    handleCustomColorSelection(input) {
        const panelId = input.dataset.panel;
        const color = input.value;
        const panel = this.panels.find(p => p.id === panelId);

        if (!panel) return;

        // Update panel color
        panel.color = color;

        // Update UI
        const cardElement = document.getElementById(panelId);
        cardElement.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Update color indicator
        const colorIndicator = cardElement.querySelector('.w-4.h-4.rounded-full');
        if (colorIndicator) {
            colorIndicator.style.backgroundColor = color;
        }

        this.updatePreview();
        this.autoSave();

        // Dispatch panelsChanged event to trigger output update
        document.dispatchEvent(new CustomEvent('panelsChanged'));
    }

    // Update title suggestion based on directory
    updateTitleSuggestion(panelId) {
        const panel = this.panels.find(p => p.id === panelId);
        const cardElement = document.getElementById(panelId);
        const titleInput = cardElement.querySelector('[data-field="title"]');

        if (!panel || !titleInput) return;

        // Only auto-suggest if title is empty or matches previous auto-suggestion
        const currentTitle = titleInput.value.trim();
        if (!currentTitle || currentTitle.startsWith('Panel ')) {
            const suggestion = window.templateManager?.generateTitleSuggestion(
                panel.directory,
                panel.commands
            );

            if (suggestion && suggestion !== currentTitle) {
                titleInput.value = suggestion;
                panel.title = suggestion;
            }
        }
    }

    // Show directory suggestions
    showDirectorySuggestions(input) {
        const value = input.value;
        const suggestions = window.templateManager?.filterDirectories(value) || [];

        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        const suggestionsContainer = input.parentElement.querySelector('.directory-suggestions');
        if (!suggestionsContainer) return;

        suggestionsContainer.innerHTML = suggestions
            .map(dir => `<div class="directory-suggestion" data-value="${dir}">${dir}</div>`)
            .join('');

        suggestionsContainer.classList.remove('hidden');
    }

    // Show command suggestions
    showCommandSuggestions(textarea) {
        const value = textarea.value;
        const cursorPos = textarea.selectionStart;
        const textBeforeCursor = value.substring(0, cursorPos);
        const currentLine = textBeforeCursor.split('\n').pop();

        const suggestions = window.templateManager?.filterCommands(currentLine) || [];

        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        const suggestionsContainer = textarea.parentElement.querySelector('.command-suggestion-list');
        if (!suggestionsContainer) return;

        suggestionsContainer.innerHTML = suggestions
            .map(cmd => `<div class="command-suggestion-item" data-value="${cmd}">${cmd}</div>`)
            .join('');

        suggestionsContainer.classList.remove('hidden');
    }

    // Handle directory suggestion selection
    handleDirectorySuggestion(suggestion) {
        const value = suggestion.dataset.value;
        const input = suggestion.closest('.form-group').querySelector('input');

        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input'));
            this.hideSuggestions();
        }
    }

    // Handle command suggestion selection
    handleCommandSuggestion(suggestion) {
        const value = suggestion.dataset.value;
        const textarea = suggestion.closest('.command-suggestions').querySelector('textarea');

        if (textarea) {
            const cursorPos = textarea.selectionStart;
            const textBefore = textarea.value.substring(0, cursorPos);
            const textAfter = textarea.value.substring(cursorPos);
            const lines = textBefore.split('\n');
            const currentLineStart = textBefore.lastIndexOf('\n') + 1;

            // Replace current line with suggestion
            const newValue = textarea.value.substring(0, currentLineStart) + value + textAfter;
            textarea.value = newValue;
            textarea.dispatchEvent(new Event('input'));
            this.hideSuggestions();

            // Set cursor to end of inserted text
            const newCursorPos = currentLineStart + value.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }
    }

    // Hide all suggestions
    hideSuggestions() {
        document.querySelectorAll('.directory-suggestions, .command-suggestion-list').forEach(container => {
            container.classList.add('hidden');
        });
    }

    // Update preview display
    updatePreview() {
        const previewContainer = document.getElementById('terminal-preview');
        if (!previewContainer) return;

        if (this.panels.length === 0) {
            previewContainer.innerHTML = `
                <div class="flex items-center justify-center text-gray-500">
                    <i class="fas fa-terminal text-4xl mb-2"></i>
                    <p class="ml-4">Configure panels to see preview</p>
                </div>
            `;
            return;
        }

        // Generate grid layout
        const gridLayout = this.calculateGridLayout();
        previewContainer.className = `bg-gray-800 rounded-b-lg p-4 min-h-48 terminal-preview-grid`;
        previewContainer.style.gridTemplateAreas = gridLayout.areas;
        previewContainer.style.gridTemplateRows = gridLayout.rows;
        previewContainer.style.gridTemplateColumns = gridLayout.columns;

        // Generate panel HTML
        previewContainer.innerHTML = this.panels
            .map((panel, index) => this.generatePreviewPanelHTML(panel, index))
            .join('');
    }

    // Calculate grid layout for preview
    calculateGridLayout() {
        if (this.panels.length === 1) {
            return {
                areas: `"panel0"`,
                rows: '1fr',
                columns: '1fr'
            };
        }

        if (this.panels.length === 2) {
            const split = this.panels[1].split;
            let areas, rows = '1fr', columns = '1fr';

            if (split === 'horizontal') {
                areas = '"panel0" "panel1"';
                rows = `${1 - this.panels[1].size}fr ${this.panels[1].size}fr`;
            } else {
                areas = '"panel0 panel1"';
                columns = `${1 - this.panels[1].size}fr ${this.panels[1].size}fr`;
            }
            return { areas, rows, columns };
        }

        if (this.panels.length === 3) {
            const panel1Split = this.panels[1].split;
            const panel2Split = this.panels[2].split;

            // Case 1: All vertical splits (Panel0 | Panel1 | Panel2)
            if (panel1Split === 'vertical' && panel2Split === 'vertical') {
                const areas = '"panel0 panel1 panel2"';
                // Panel0 always gets 50% (0.5), Panel1 and Panel2 split the remaining 50%
                const panel0Size = 0.5; // Always 50%
                const remainingSpace = 1 - panel0Size; // 50% remaining for panel1 and panel2

                // Use both panel1 and panel2 sizes to calculate their proportions
                const panel1RelativeSize = this.panels[1].size || 0.5; // Panel1's relative size
                const panel2RelativeSize = this.panels[2].size || 0.5; // Panel2's relative size

                // Normalize the sizes so they add up to 1 within the remaining space
                const totalRelativeSize = panel1RelativeSize + panel2RelativeSize;
                const panel1Size = remainingSpace * (panel1RelativeSize / totalRelativeSize);
                const panel2Size = remainingSpace * (panel2RelativeSize / totalRelativeSize);

                const columns = `${panel0Size}fr ${panel1Size}fr ${panel2Size}fr`;
                return { areas, rows: '1fr', columns };
            }

            // Case 2: First vertical, second horizontal (Panel0 | Panel1)
            //                                           (       | Panel2)
            if (panel1Split === 'vertical' && panel2Split === 'horizontal') {
                const areas = '"panel0 panel1" "panel0 panel2"';
                const columns = `${1 - this.panels[1].size}fr ${this.panels[1].size}fr`;
                const rows = `${1 - this.panels[2].size}fr ${this.panels[2].size}fr`;
                return { areas, rows, columns };
            }

            // Case 3: First horizontal, second horizontal (Panel0)
            //                                             (Panel1)
            //                                             (Panel2)
            if (panel1Split === 'horizontal' && panel2Split === 'horizontal') {
                const areas = '"panel0" "panel1" "panel2"';
                const panel1Size = this.panels[1].size || 0.33;
                const panel2Size = this.panels[2].size || 0.33;
                const panel0Size = 1 - panel1Size - panel2Size;
                const rows = `${panel0Size}fr ${panel1Size}fr ${panel2Size}fr`;
                return { areas, rows, columns: '1fr' };
            }

            // Case 4: First horizontal, second vertical (Panel0)
            //                                           (Panel1 | Panel2)
            if (panel1Split === 'horizontal' && panel2Split === 'vertical') {
                const areas = '"panel0 panel0" "panel1 panel2"';
                const rows = `${1 - this.panels[1].size}fr ${this.panels[1].size}fr`;
                const columns = `${1 - this.panels[2].size}fr ${this.panels[2].size}fr`;
                return { areas, rows, columns };
            }
        }

        // For 4+ panels or other complex layouts, use a grid approach
        if (this.panels.length >= 4) {
            const cols = Math.ceil(Math.sqrt(this.panels.length));
            const rows = Math.ceil(this.panels.length / cols);

            // Create a grid with equal areas
            const gridAreas = [];
            for (let r = 0; r < rows; r++) {
                const rowAreas = [];
                for (let c = 0; c < cols; c++) {
                    const index = r * cols + c;
                    if (index < this.panels.length) {
                        rowAreas.push(`panel${index}`);
                    } else {
                        rowAreas.push(`.`); // Empty cell
                    }
                }
                gridAreas.push(`"${rowAreas.join(' ')}"`);
            }

            return {
                areas: gridAreas.join(' '),
                rows: `repeat(${rows}, 1fr)`,
                columns: `repeat(${cols}, 1fr)`
            };
        }

        // Fallback for any other cases
        return {
            areas: '"' + this.panels.map((_, i) => `panel${i}`).join(' ') + '"',
            rows: '1fr',
            columns: `repeat(${this.panels.length}, 1fr)`
        };
    }

    // Generate preview panel HTML
    generatePreviewPanelHTML(panel, index) {
        const shortPath = this.shortenPath(panel.directory);
        const shortCommand = this.shortenCommand(panel.commands);

        return `
            <div class="terminal-panel" style="--panel-color: ${panel.color}; grid-area: panel${index}">
                <div class="terminal-panel-title">${this.escapeHTML(panel.title)}</div>
                <div class="terminal-panel-path">${this.escapeHTML(shortPath)}</div>
                ${shortCommand ? `<div class="terminal-panel-command">${this.escapeHTML(shortCommand)}</div>` : ''}
            </div>
        `;
    }

    // Utility functions
    shortenPath(path) {
        if (!path || path.length <= 30) return path;
        return '...' + path.slice(-27);
    }

    shortenCommand(command) {
        if (!command) return '';
        const firstLine = command.split('\n')[0];
        return firstLine.length > 40 ? firstLine.slice(0, 37) + '...' : firstLine;
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    findPanelId(element) {
        const card = element.closest('.panel-card');
        return card ? card.id : null;
    }

    // Render all panels
    renderAllPanels() {
        const container = document.getElementById('panels-container');
        if (!container) return;

        container.innerHTML = '';
        this.panels.forEach(panel => this.renderPanelCard(panel));
    }

    // Update add button state
    updateAddButtonState() {
        const addButton = document.getElementById('add-panel');
        if (addButton) {
            addButton.disabled = this.panels.length >= this.maxPanels;
            if (this.panels.length >= this.maxPanels) {
                addButton.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                addButton.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    // Auto-save functionality
    autoSave() {
        if (window.storageManager?.getSettings().autoSave) {
            window.storageManager.saveConfiguration(this.panels);
        }
    }

    // Load panels from configuration
    loadPanels(panels) {
        this.panels = [];
        this.panelCounter = 0;

        const container = document.getElementById('panels-container');
        if (container) {
            container.innerHTML = '';
        }

        panels.forEach(panelData => {
            const panelId = `panel-${++this.panelCounter}`;
            const panel = { ...panelData, id: panelId };
            this.panels.push(panel);
            this.renderPanelCard(panel);
        });

        this.updatePreview();
        this.updateAddButtonState();

        // Update the "Collapse All" button icon when panels are loaded
        this.updateCollapseAllButtonIcon();
    }

    // Get panels data (for external access)
    getPanels() {
        return this.panels;
    }

    // Clear all panels
    clearAllPanels() {
        // Remove all panel elements from DOM
        this.panels.forEach(panel => {
            const panelElement = document.getElementById(panel.id);
            if (panelElement) {
                panelElement.remove();
            }
        });

        // Clear panels array
        this.panels = [];
        this.panelCounter = 0;

        // Update UI
        this.updatePreview();
        this.updateAddButtonState();
        this.updateCollapseAllButtonIcon();

        // Dispatch panelsChanged event to trigger output update
        document.dispatchEvent(new CustomEvent('panelsChanged'));
    }

    // Toggle panel collapse state
    togglePanelCollapse(panelId) {
        const cardElement = document.getElementById(panelId);
        if (!cardElement) return;

        const panelContent = cardElement.querySelector('.panel-content');
        const collapseIcon = cardElement.querySelector('.collapse-icon');

        if (!panelContent || !collapseIcon) return;

        const isCollapsed = panelContent.classList.contains('hidden');

        if (isCollapsed) {
            // Expand panel - CSS ile animasyon çalışacak
            panelContent.classList.remove('hidden');
            collapseIcon.classList.remove('fa-chevron-down');
            collapseIcon.classList.add('fa-chevron-up');
            cardElement.classList.remove('panel-collapsed');
        } else {
            // Collapse panel - CSS ile animasyon çalışacak
            panelContent.classList.add('hidden');
            collapseIcon.classList.remove('fa-chevron-up');
            collapseIcon.classList.add('fa-chevron-down');
            cardElement.classList.add('panel-collapsed');
        }

        // Store collapsed state in panel data
        const panel = this.panels.find(p => p.id === panelId);
        if (panel) {
            panel.collapsed = !isCollapsed;
            this.autoSave();
        }

        // Update the "Collapse All" button icon when individual panels are toggled
        this.updateCollapseAllButtonIcon();
    }

    // Toggle all panels collapse state
    toggleAllPanelsCollapse() {
        if (this.panels.length === 0) return;

        // Check if any panels are expanded
        const hasExpandedPanels = this.panels.some(panel => !panel.collapsed);

        // If any panels are expanded, collapse all. Otherwise, expand all.
        const shouldCollapse = hasExpandedPanels;

        this.panels.forEach(panel => {
            const cardElement = document.getElementById(panel.id);
            if (!cardElement) return;

            const panelContent = cardElement.querySelector('.panel-content');
            const collapseIcon = cardElement.querySelector('.collapse-icon');

            if (!panelContent || !collapseIcon) return;

            if (shouldCollapse) {
                // Collapse panel
                panelContent.classList.add('hidden');
                collapseIcon.classList.remove('fa-chevron-up');
                collapseIcon.classList.add('fa-chevron-down');
                cardElement.classList.add('panel-collapsed');
                panel.collapsed = true;
            } else {
                // Expand panel
                panelContent.classList.remove('hidden');
                collapseIcon.classList.remove('fa-chevron-down');
                collapseIcon.classList.add('fa-chevron-up');
                cardElement.classList.remove('panel-collapsed');
                panel.collapsed = false;
            }
        });

        // Update the "Collapse All" button icon
        this.updateCollapseAllButtonIcon();

        this.autoSave();
        this.showToast(shouldCollapse ? 'All panels collapsed' : 'All panels expanded', 'success');
    }

    // Update the collapse all button icon based on panels state
    updateCollapseAllButtonIcon() {
        const collapseAllIcon = document.getElementById('collapse-all-icon');
        if (!collapseAllIcon) return;

        // Check if any panels are expanded
        const hasExpandedPanels = this.panels.some(panel => !panel.collapsed);

        // CSS animasyonu ile çalışacak şekilde class değişimi
        if (hasExpandedPanels) {
            // Some panels are expanded, show "collapse all" icon (up arrow)
            collapseAllIcon.classList.remove('fa-chevron-down');
            collapseAllIcon.classList.add('fa-chevron-up');
        } else {
            // All panels are collapsed, show "expand all" icon (down arrow)
            collapseAllIcon.classList.remove('fa-chevron-up');
            collapseAllIcon.classList.add('fa-chevron-down');
        }
    }

    // Update panel header title when title input changes
    updatePanelHeaderTitle(panelId) {
        const panel = this.panels.find(p => p.id === panelId);
        const cardElement = document.getElementById(panelId);

        if (!panel || !cardElement) return;

        const headerTitle = cardElement.querySelector('.panel-header h3');
        if (headerTitle) {
            const panelIndex = this.panels.findIndex(p => p.id === panelId) + 1;
            const displayTitle = panel.title && panel.title.trim() !== '' && !panel.title.startsWith('Panel ')
                ? panel.title
                : `Panel ${panelIndex}`;

            headerTitle.textContent = displayTitle;
        }
    }

    // Show toast notification
    showToast(message, type = 'info') {
        // Create toast element if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-48 transform transition-all duration-300 translate-x-full opacity-0`;

        const icon = type === 'success' ? 'fa-check-circle text-green-500' :
                    type === 'warning' ? 'fa-exclamation-triangle text-yellow-500' :
                    type === 'error' ? 'fa-times-circle text-red-500' :
                    'fa-info-circle text-blue-500';

        toast.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas ${icon}"></i>
                <span class="text-sm font-medium">${message}</span>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize panel manager
document.addEventListener('DOMContentLoaded', () => {
    window.panelManager = new PanelManager();

    // Load initial panels from storage
    const config = window.storageManager?.loadConfiguration();
    if (config && config.panels && config.panels.length > 0) {
        window.panelManager.loadPanels(config.panels);
    } else {
        // Add default panel if no configuration found
        window.panelManager.addPanel();
    }
});
