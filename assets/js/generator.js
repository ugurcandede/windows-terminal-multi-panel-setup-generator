// Command Generation and Output Management
class CommandGenerator {
    constructor() {
        this.supportedFormats = ['powershell', 'json', 'batch'];
        this.currentFormat = 'powershell';
    }

    // Generate PowerShell command
    generatePowerShellCommand(panels) {
        if (!panels || panels.length === 0) {
            return '# No panels configured';
        }

        let command = 'wt';

        panels.forEach((panel, index) => {
            if (index === 0) {
                // First panel - new tab
                command += this.buildNewTabCommand(panel);
            } else {
                // Additional panels - split panes
                command += this.buildSplitPaneCommand(panel);
            }
        });

        return command;
    }

    // Build new-tab command for first panel
    buildNewTabCommand(panel) {
        let cmd = ' new-tab';

        if (panel.title) {
            cmd += ` --title "${this.escapePowerShellString(panel.title)}" --suppressApplicationTitle`;
        }

        if (panel.directory) {
            cmd += ` --startingDirectory "${this.escapePowerShellPath(panel.directory)}"`;
        }

        if (panel.color && panel.color !== '#64748b') {
            cmd += ` --tabColor "${panel.color}"`;
        }

        // Add profile
        const profileCmd = this.getProfileCommand(panel.profile);
        if (profileCmd) {
            cmd += ` ${profileCmd}`;
        }

        // Add commands to execute
        if (panel.commands && panel.commands.trim()) {
            const escapedCommand = this.escapePowerShellString(panel.commands);
            cmd += ` -Command "${escapedCommand}"`;
        }

        return cmd;
    }

    // Build split-pane command for additional panels
    buildSplitPaneCommand(panel) {
        let cmd = ' `; split-pane';

        // Split direction
        if (panel.split === 'horizontal') {
            cmd += ' -H';
        } else {
            cmd += ' -V'; // Default to vertical
        }

        if (panel.title) {
            cmd += ` --title "${this.escapePowerShellString(panel.title)}" --suppressApplicationTitle`;
        }

        if (panel.directory) {
            cmd += ` --startingDirectory "${this.escapePowerShellPath(panel.directory)}"`;
        }

        // Panel size
        if (panel.size && panel.size !== 0.5) {
            cmd += ` --size ${panel.size}`;
        }

        if (panel.color && panel.color !== '#64748b') {
            cmd += ` --tabColor "${panel.color}"`;
        }

        // Add profile
        const profileCmd = this.getProfileCommand(panel.profile);
        if (profileCmd) {
            cmd += ` ${profileCmd}`;
        }

        // Add commands to execute
        if (panel.commands && panel.commands.trim()) {
            const escapedCommand = this.escapePowerShellString(panel.commands);
            cmd += ` -Command "${escapedCommand}"`;
        }

        return cmd;
    }

    // Get profile command string
    getProfileCommand(profile) {
        switch (profile) {
            case 'PowerShell':
                return 'pwsh';
            case 'Command Prompt':
                return 'cmd';
            case 'Git Bash':
                return 'bash';
            case 'Ubuntu':
                return 'wsl -d Ubuntu';
            default:
                return 'pwsh'; // Default to PowerShell
        }
    }

    // Generate JSON Action format
    generateJSONAction(panels) {
        if (!panels || panels.length === 0) {
            return JSON.stringify({
                "command": {
                    "action": "newTab",
                    "tabTitle": "Empty Configuration"
                },
                "name": "Empty Setup",
                "icon": "⚠️"
            }, null, 2);
        }

        const actions = [];

        // First panel - always newTab
        const firstPanel = panels[0];
        const firstAction = {
            "action": "newTab"
        };

        // Add commandline with proper PowerShell structure
        const firstCommands = this.buildPowerShellCommands(firstPanel.directory, firstPanel.commands);
        firstAction.commandline = `pwsh -Command "${this.escapeJSONString(firstCommands)}"`;

        if (firstPanel.directory) {
            firstAction.startingDirectory = this.normalizeWindowsPath(firstPanel.directory);
        }

        if (firstPanel.title) {
            firstAction.tabTitle = firstPanel.title;
        }

        if (firstPanel.color && firstPanel.color !== '#64748b') {
            firstAction.tabColor = firstPanel.color;
        }

        firstAction.suppressApplicationTitle = true;
        actions.push(firstAction);

        // Add split panes for additional panels
        panels.slice(1).forEach(panel => {
            const splitAction = {
                "action": "splitPane",
                "split": panel.split || "vertical"
            };

            if (panel.size && panel.size !== 0.5) {
                splitAction.size = panel.size;
            }

            // Add commandline with proper PowerShell structure
            const commands = this.buildPowerShellCommands(panel.directory, panel.commands);
            splitAction.commandline = `pwsh -Command "${this.escapeJSONString(commands)}"`;

            if (panel.directory) {
                splitAction.startingDirectory = this.normalizeWindowsPath(panel.directory);
            }

            if (panel.title) {
                splitAction.tabTitle = panel.title;
            }

            if (panel.color && panel.color !== '#64748b') {
                splitAction.tabColor = panel.color;
            }

            splitAction.suppressApplicationTitle = true;
            actions.push(splitAction);
        });

        // Add moveFocus to first panel
        actions.push({
            "action": "moveFocus",
            "direction": "first"
        });

        // Create the complete Windows Terminal action structure
        const terminalAction = {
            "command": {
                "action": "multipleActions",
                "actions": actions
            },
            "name": this.generateActionName(panels),
            "icon": "🚀"
        };

        return JSON.stringify(terminalAction, null, 2);
    }

    // Build PowerShell commands string
    buildPowerShellCommands(directory, commands) {
        let cmdString = "";

        if (directory) {
            cmdString += `cd '${directory.replace(/'/g, "''")}'`;
        }

        if (commands && commands.trim()) {
            if (cmdString) cmdString += "; ";
            cmdString += commands.replace(/'/g, "''");
        }

        return cmdString;
    }

    // Generate action name based on panels
    generateActionName(panels) {
        if (panels.length === 1) {
            return panels[0].title || "Single Panel Setup";
        }

        const titles = panels
            .map(p => p.title)
            .filter(t => t && !t.startsWith('Panel '))
            .slice(0, 3);

        if (titles.length > 0) {
            return titles.join(" + ") + (panels.length > 3 ? " + more" : "");
        }

        return `${panels.length} Panel Setup`;
    }

    // Generate Batch file
    generateBatchFile(panels) {
        if (!panels || panels.length === 0) {
            return '@echo off\necho No panels configured\npause';
        }

        let batch = '@echo off\n';
        batch += ':: Windows Terminal Multi-Panel Setup\n';
        batch += `:: Generated on ${new Date().toLocaleString()}\n\n`;

        // Add error handling
        batch += 'echo Starting Windows Terminal with multi-panel setup...\n\n';

        // Check if Windows Terminal is installed
        batch += 'where wt >nul 2>nul\n';
        batch += 'if %errorlevel% neq 0 (\n';
        batch += '    echo Error: Windows Terminal (wt) not found in PATH\n';
        batch += '    echo Please install Windows Terminal from Microsoft Store\n';
        batch += '    pause\n';
        batch += '    exit /b 1\n';
        batch += ')\n\n';

        // Generate the wt command
        const wtCommand = this.generatePowerShellCommand(panels)
            .replace(/`\n\s+/g, ' ')  // Remove line breaks for batch
            .replace(/"/g, '""');     // Escape quotes for batch

        batch += `start "" wt ${wtCommand}\n\n`;
        batch += 'echo Windows Terminal launched successfully!\n';
        batch += 'timeout /t 2 >nul\n';

        return batch;
    }

    // Generate all formats
    generateAll(panels) {
        return {
            powershell: this.generatePowerShellCommand(panels),
            json: this.generateJSONAction(panels),
            batch: this.generateBatchFile(panels)
        };
    }

    // Escape PowerShell strings
    escapePowerShellString(str) {
        return str.replace(/"/g, '""').replace(/`/g, '``');
    }

    // Escape PowerShell paths
    escapePowerShellPath(path) {
        return path.replace(/\\/g, '\\\\').replace(/"/g, '""');
    }

    // Escape JSON strings
    escapeJSONString(str) {
        return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    }

    // Normalize Windows paths for JSON
    normalizeWindowsPath(path) {
        return path.replace(/\\/g, '\\\\');
    }

    // Validate panels configuration
    validatePanels(panels) {
        const errors = [];

        if (!panels || !Array.isArray(panels)) {
            errors.push('Panels must be an array');
            return errors;
        }

        if (panels.length === 0) {
            errors.push('At least one panel is required');
            return errors;
        }

        if (panels.length > 6) {
            errors.push('Maximum 6 panels are supported');
        }

        panels.forEach((panel, index) => {
            const panelNum = index + 1;

            if (!panel.title || !panel.title.trim()) {
                errors.push(`Panel ${panelNum}: Title is required`);
            }

            if (!panel.directory || !panel.directory.trim()) {
                errors.push(`Panel ${panelNum}: Directory is required`);
            } else if (!this.isValidWindowsPath(panel.directory)) {
                errors.push(`Panel ${panelNum}: Invalid Windows path format`);
            }

            if (!panel.color || !this.isValidHexColor(panel.color)) {
                errors.push(`Panel ${panelNum}: Valid color is required`);
            }

            if (index > 0) {
                if (!panel.split || !['vertical', 'horizontal'].includes(panel.split)) {
                    errors.push(`Panel ${panelNum}: Valid split direction is required`);
                }

                if (panel.size && (panel.size < 0.1 || panel.size > 0.9)) {
                    errors.push(`Panel ${panelNum}: Size must be between 0.1 and 0.9`);
                }
            }
        });

        return errors;
    }

    // Validate Windows path format
    isValidWindowsPath(path) {
        // Basic Windows path validation
        const windowsPathRegex = /^[a-zA-Z]:\\.*$/;
        const uncPathRegex = /^\\\\.*$/;
        return windowsPathRegex.test(path) || uncPathRegex.test(path) || path.startsWith('./') || path.startsWith('../');
    }

    // Validate hex color format
    isValidHexColor(color) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }

    // Get language identifier for syntax highlighting
    getLanguageForFormat(format) {
        switch (format) {
            case 'powershell':
                return 'powershell';
            case 'json':
                return 'json';
            case 'batch':
                return 'batch';
            default:
                return 'text';
        }
    }

    // Get human-readable title for format
    getTitleForFormat(format) {
        switch (format) {
            case 'powershell':
                return 'PowerShell Command';
            case 'json':
                return 'Windows Terminal Action';
            case 'batch':
                return 'Batch File';
            default:
                return 'Generated Output';
        }
    }

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const result = document.execCommand('copy');
                textArea.remove();
                return result;
            }
        } catch (error) {
            console.error('Failed to copy text to clipboard:', error);
            return false;
        }
    }

    // Utility method to get current timestamp
    getCurrentTimestamp() {
        return new Date().toLocaleString();
    }

    // Debug method
    debug(panels) {
        console.log('CommandGenerator Debug Info:');
        console.log('Supported formats:', this.supportedFormats);
        console.log('Current format:', this.currentFormat);
        console.log('Panels:', panels);
        console.log('Generated outputs:', this.generateAll(panels));
    }

    // Generate PowerShell command for display (formatted)
    generatePowerShellCommandForDisplay(panels) {
        const rawCommand = this.generatePowerShellCommand(panels);
        if (!panels || panels.length === 0) {
            return rawCommand;
        }

        // Format the command for better readability
        return rawCommand
            .replace(/`; split-pane/g, ' `;\n  split-pane')
            .replace(/^wt/, 'wt `\n ')
            .replace(/--title/g, '\n    --title')
            .replace(/--startingDirectory/g, '\n    --startingDirectory')
            .replace(/--suppressApplicationTitle/g, '\n    --suppressApplicationTitle')
            .replace(/--tabColor/g, '\n    --tabColor')
            .replace(/--size/g, '\n    --size')
            .replace(/-Command/g, '\n    -Command')
            .replace(/pwsh/g, '\n    pwsh')
            .replace(/cmd/g, '\n    cmd')
            .replace(/bash/g, '\n    bash')
            .replace(/wsl/g, '\n    wsl');
    }

    // Generate PowerShell command for clipboard (single line)
    generatePowerShellCommandForClipboard(panels) {
        return this.generatePowerShellCommand(panels);
    }
}

// Initialize command generator
document.addEventListener('DOMContentLoaded', () => {
    window.commandGenerator = new CommandGenerator();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommandGenerator;
}
