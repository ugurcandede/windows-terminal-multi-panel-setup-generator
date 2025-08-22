// Template definitions and management
class TemplateManager {
    constructor() {
        this.templates = {
            fullstack: {
                name: "Full-Stack Development",
                description: "Frontend + Backend + Database setup",
                icon: "fas fa-code",
                color: "blue",
                panels: [
                    {
                        title: "Frontend",
                        directory: "D:\\MyProjects\\my-app\\frontend", // Kendi dizininizi yazın
                        commands: "npm run dev",
                        color: "#4ecdc4",
                        profile: "PowerShell",
                        split: null,
                        size: 1.0
                    },
                    {
                        title: "Backend API",
                        directory: "D:\\MyProjects\\my-app\\backend", // Kendi dizininizi yazın
                        commands: "npm run start:dev", // Kendi komutunuzu yazın
                        color: "#ff6b6b",
                        profile: "PowerShell",
                        split: "vertical",
                        size: 0.5
                    },
                    {
                        title: "Database",
                        directory: "D:\\MyProjects\\my-app", // Kendi dizininizi yazın
                        commands: "docker-compose up postgres", // Kendi komutunuzu yazın
                        color: "#45b7d1",
                        profile: "PowerShell",
                        split: "vertical",
                        size: 0.3
                    }
                ]
            },
            devops: {
                name: "DevOps Monitoring",
                description: "Database + ETL + Analytics",
                icon: "fas fa-server",
                color: "green",
                panels: [
                    {
                        title: "PostgreSQL",
                        directory: "C:\\Database",
                        commands: "psql -U postgres -h localhost -p 5432 mydb",
                        color: "#4f46e5",
                        profile: "PowerShell",
                        split: null,
                        size: 1.0
                    },
                    {
                        title: "ETL Pipeline",
                        directory: "C:\\DataPipeline",
                        commands: "python etl_pipeline.py --env=dev",
                        color: "#f59e0b",
                        profile: "PowerShell",
                        split: "vertical",
                        size: 0.5
                    },
                    {
                        title: "Jupyter Lab",
                        directory: "C:\\Analytics",
                        commands: "jupyter lab --port=8888",
                        color: "#10b981",
                        profile: "PowerShell",
                        split: "horizontal",
                        size: 0.5
                    }
                ]
            },
            testing: {
                name: "Testing Environment",
                description: "Unit Tests + E2E Tests",
                icon: "fas fa-vial",
                color: "purple",
                panels: [
                    {
                        title: "Unit Tests",
                        directory: "C:\\Projects\\tests",
                        commands: "npm run test:watch -- --coverage",
                        color: "#ff6b6b",
                        profile: "PowerShell",
                        split: null,
                        size: 1.0
                    },
                    {
                        title: "E2E Tests",
                        directory: "C:\\Projects\\e2e",
                        commands: "npx playwright test --headed",
                        color: "#4ecdc4",
                        profile: "PowerShell",
                        split: "vertical",
                        size: 0.3
                    }
                ]
            },
            dataops: {
                name: "Data Operations",
                description: "Database + ETL + Analytics",
                icon: "fas fa-database",
                color: "indigo",
                panels: [
                    {
                        title: "PostgreSQL",
                        directory: "C:\\Database",
                        commands: "psql -U postgres -h localhost -p 5432 mydb",
                        color: "#4f46e5",
                        profile: "PowerShell",
                        split: null,
                        size: 1.0
                    },
                    {
                        title: "ETL Pipeline",
                        directory: "C:\\DataPipeline",
                        commands: "python etl_pipeline.py --env=dev",
                        color: "#f59e0b",
                        profile: "PowerShell",
                        split: "vertical",
                        size: 0.5
                    },
                    {
                        title: "Jupyter Lab",
                        directory: "C:\\Analytics",
                        commands: "jupyter lab --port=8888",
                        color: "#10b981",
                        profile: "PowerShell",
                        split: "horizontal",
                        size: 0.4
                    }
                ]
            },
            mobile: {
                name: "Mobile Development",
                description: "React Native + iOS + Android",
                icon: "fas fa-mobile-alt",
                color: "pink",
                panels: [
                    {
                        title: "Metro Bundler",
                        directory: "C:\\MobileApps\\MyApp",
                        commands: "npx react-native start",
                        color: "#f06292",
                        profile: "PowerShell",
                        split: null,
                        size: 1.0
                    },
                    {
                        title: "iOS Simulator",
                        directory: "C:\\MobileApps\\MyApp",
                        commands: "npx react-native run-ios",
                        color: "#4ecdc4",
                        profile: "PowerShell",
                        split: "vertical",
                        size: 0.5
                    },
                    {
                        title: "Android Emulator",
                        directory: "C:\\MobileApps\\MyApp",
                        commands: "npx react-native run-android",
                        color: "#96ceb4",
                        profile: "PowerShell",
                        split: "vertical",
                        size: 0.5
                    }
                ]
            },
            custom: {
                name: "Custom Setup",
                description: "Start with a single panel",
                icon: "fas fa-plus",
                color: "gray",
                panels: [
                    {
                        title: "Terminal",
                        directory: "C:\\",
                        commands: "",
                        color: "#64748b",
                        profile: "PowerShell",
                        split: null,
                        size: 1.0
                    }
                ]
            }
        };

        this.commonDirectories = [
            "C:\\",
            "C:\\Users\\%USERNAME%",
            "C:\\Projects",
            "C:\\Projects\\frontend",
            "C:\\Projects\\backend",
            "C:\\Projects\\api",
            "C:\\Projects\\web",
            "C:\\Projects\\mobile",
            "C:\\Users\\%USERNAME%\\Desktop",
            "C:\\Users\\%USERNAME%\\Documents",
            "C:\\Users\\%USERNAME%\\Documents\\GitHub",
            "C:\\dev",
            "C:\\workspace",
            "D:\\Projects",
            "E:\\Projects"
        ];

        this.commonCommands = [
            "npm start",
            "npm run dev",
            "npm run build",
            "npm test",
            "npm run test:watch",
            "yarn start",
            "yarn dev",
            "yarn build",
            "yarn test",
            "dotnet run",
            "dotnet watch run",
            "dotnet build",
            "dotnet test",
            "python app.py",
            "python -m flask run",
            "python manage.py runserver",
            "pip install -r requirements.txt",
            "docker-compose up",
            "docker-compose up -d",
            "docker-compose down",
            "docker ps",
            "docker logs -f",
            "git status",
            "git log --oneline",
            "git pull",
            "git push",
            "code .",
            "explorer .",
            "Get-Content app.log -Wait -Tail 50",
            "Get-Process",
            "Get-Service",
            "netstat -an",
            "ipconfig",
            "ping google.com",
            "ssh user@server",
            "scp file.txt user@server:/path",
            "curl -X GET http://localhost:3000/api",
            "wget https://example.com/file.zip",
            "npx create-react-app my-app",
            "npx next create my-app",
            "ng serve",
            "ng build",
            "vue serve",
            "vue build",
            "rails server",
            "rails console",
            "php artisan serve",
            "composer install",
            "mvn spring-boot:run",
            "gradle bootRun",
            "go run main.go",
            "cargo run",
            "cargo build"
        ];

        this.profiles = [
            { value: "PowerShell", label: "PowerShell", icon: "fab fa-microsoft" },
            { value: "Command Prompt", label: "Command Prompt", icon: "fas fa-terminal" },
            { value: "Git Bash", label: "Git Bash", icon: "fab fa-git-alt" },
            { value: "Ubuntu", label: "Ubuntu (WSL)", icon: "fab fa-ubuntu" },
            { value: "Custom", label: "Custom Profile", icon: "fas fa-cog" }
        ];

        this.panelColors = [
            { name: "Red", value: "#ff6b6b", class: "panel-color-red" },
            { name: "Teal", value: "#4ecdc4", class: "panel-color-teal" },
            { name: "Blue", value: "#45b7d1", class: "panel-color-blue" },
            { name: "Green", value: "#96ceb4", class: "panel-color-green" },
            { name: "Purple", value: "#dda0dd", class: "panel-color-purple" },
            { name: "Orange", value: "#ffa726", class: "panel-color-orange" },
            { name: "Pink", value: "#f06292", class: "panel-color-pink" },
            { name: "Midnight Blue", value: "#191970", class: "panel-color-midnight-blue" },
            {name: "Lime Green", value: "#ADFF2F", class: "panel-color-lime-green"},
            {name: "Crimson Red", value: "#DC143C", class: "panel-color-crimson-red"},
            {name: "Golden Yellow", value: "#FFD700", class: "panel-color-golden-yellow"}
        ];
    }

    getTemplate(templateId) {
        return this.templates[templateId] || null;
    }

    getAllTemplates() {
        return this.templates;
    }

    getCommonDirectories() {
        return this.commonDirectories;
    }

    getCommonCommands() {
        return this.commonCommands;
    }

    getProfiles() {
        return this.profiles;
    }

    getPanelColors() {
        return this.panelColors;
    }

    // Filter commands based on input
    filterCommands(input) {
        if (!input || input.length < 2) return [];

        const searchTerm = input.toLowerCase();
        return this.commonCommands
            .filter(cmd => cmd.toLowerCase().includes(searchTerm))
            .slice(0, 8); // Limit to 8 suggestions
    }

    // Filter directories based on input
    filterDirectories(input) {
        if (!input || input.length < 2) return [];

        const searchTerm = input.toLowerCase();
        return this.commonDirectories
            .filter(dir => dir.toLowerCase().includes(searchTerm))
            .slice(0, 6); // Limit to 6 suggestions
    }

    // Create a custom template from current configuration
    createCustomTemplate(name, panels) {
        const templateId = name.toLowerCase().replace(/\s+/g, '-');

        this.templates[templateId] = {
            name: name,
            description: "Custom user template",
            icon: "fas fa-user",
            color: "gray",
            panels: panels.map(panel => ({ ...panel })) // Deep copy
        };

        return templateId;
    }

    // Validate template structure
    validateTemplate(template) {
        const errors = [];

        if (!template.name) {
            errors.push("Template name is required");
        }

        if (!template.panels || !Array.isArray(template.panels)) {
            errors.push("Template must have panels array");
        } else {
            if (template.panels.length === 0) {
                errors.push("Template must have at least one panel");
            }

            if (template.panels.length > 6) {
                errors.push("Template cannot have more than 6 panels");
            }

            template.panels.forEach((panel, index) => {
                if (!panel.title) {
                    errors.push(`Panel ${index + 1}: Title is required`);
                }

                if (!panel.directory) {
                    errors.push(`Panel ${index + 1}: Directory is required`);
                }

                if (!panel.color || !this.isValidColor(panel.color)) {
                    errors.push(`Panel ${index + 1}: Valid color is required`);
                }

                if (index > 0 && !panel.split) {
                    errors.push(`Panel ${index + 1}: Split direction is required for non-first panels`);
                }

                if (panel.size && (panel.size < 0.1 || panel.size > 0.9)) {
                    errors.push(`Panel ${index + 1}: Size must be between 0.1 and 0.9`);
                }
            });
        }

        return errors;
    }

    // Check if color is valid hex color
    isValidColor(color) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }

    // Export template to JSON
    exportTemplate(templateId) {
        const template = this.getTemplate(templateId);
        if (!template) return null;

        return {
            version: "1.0",
            exported: new Date().toISOString(),
            template: template
        };
    }

    // Import template from JSON
    importTemplate(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

            if (!data.template) {
                throw new Error("Invalid template format");
            }

            const errors = this.validateTemplate(data.template);
            if (errors.length > 0) {
                throw new Error("Template validation failed: " + errors.join(", "));
            }

            return data.template;
        } catch (error) {
            throw new Error("Failed to import template: " + error.message);
        }
    }

    // Get directory basename for auto-title suggestion
    getDirectoryBasename(path) {
        if (!path) return "";

        // Handle Windows paths
        const parts = path.replace(/\\/g, '/').split('/');
        const basename = parts[parts.length - 1];

        // Clean up common patterns
        if (basename === '%USERNAME%' && parts.length > 1) {
            return parts[parts.length - 2];
        }

        return basename || "Terminal";
    }

    // Generate smart title suggestions
    generateTitleSuggestion(directory, commands) {
        const basename = this.getDirectoryBasename(directory);

        // If commands contain specific keywords, suggest based on that
        if (commands) {
            const cmd = commands.toLowerCase();
            if (cmd.includes('npm run dev') || cmd.includes('yarn dev')) return `${basename} - Dev`;
            if (cmd.includes('npm start') || cmd.includes('yarn start')) return `${basename} - Server`;
            if (cmd.includes('test')) return `${basename} - Tests`;
            if (cmd.includes('build')) return `${basename} - Build`;
            if (cmd.includes('docker')) return `${basename} - Docker`;
            if (cmd.includes('ssh')) return 'SSH Connection';
            if (cmd.includes('log')) return 'Logs';
            if (cmd.includes('git')) return 'Git';
        }

        return basename;
    }
}

// Global instance
window.templateManager = new TemplateManager();
