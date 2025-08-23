# Windows Terminal Multi-Panel Setup Generator

A powerful, modern web application for creating complex multi-panel Windows Terminal layouts with an intuitive GUI. Generate PowerShell commands, JSON actions, and batch files to set up your perfect development environment in seconds.

![Windows Terminal Generator](https://img.shields.io/badge/Windows%20Terminal-Generator-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## 🚀 Live Demo

**Visit the live application:** [Open Windows Terminal Generator](https://ugurcandede.github.io/windows-terminal-multi-panel-setup-generator/)

## ✨ Features

### 🎛️ Advanced Panel Management
- **1-6 Panels**: Create setups from simple single panels to complex 6-panel layouts
- **Drag & Drop Reordering**: Intuitive drag and drop interface with smooth animations
- **Collapsible Panels**: Individual panel collapse/expand with smooth animations
- **Bulk Operations**: Collapse/expand all panels with one click
- **Live Preview**: Real-time terminal layout preview as you configure
- **Smart Validation**: Automatic validation of paths, commands, and configurations

### ⚙️ Comprehensive Panel Configuration
Each panel supports:
- **Custom Titles**: Descriptive names for your tabs with auto-suggestions
- **Starting Directories**: Any Windows path with intelligent auto-complete
- **Commands**: Multi-line PowerShell/CMD commands with syntax suggestions
- **Custom Colors**: 6 preset colors + custom hex color picker for unlimited options
- **Split Configuration**: Vertical/horizontal splits with precise size control (10%-90%)
- **Profile Selection**: PowerShell, CMD, Git Bash, WSL Ubuntu profiles
- **Real-time Updates**: All changes reflect immediately in preview and output

### 📤 Multiple Output Formats
Generate production-ready code in three formats:
- **PowerShell Commands**: Direct `wt` commands for immediate terminal execution
- **JSON Actions**: Windows Terminal settings.json action format for keyboard shortcuts
- **Batch Files**: Complete .bat files with error handling and validation

### 🎨 Quick Start Templates
Professional templates for common development scenarios:
- **Full-Stack Development**: Frontend + Backend + Database monitoring
- **DevOps Operations**: System logs + Docker containers + SSH connections
- **Testing Environment**: Unit tests + E2E test runners + coverage reports
- **Game Development**: Unity editor + asset pipeline + build automation
- **Data Operations**: Database connections + ETL processes + analytics
- **Mobile Development**: React Native + iOS simulator + Android emulator
- **Custom Setup**: Start from scratch with your own configuration

### 💾 Advanced Data Management
- **Auto-Save**: Automatically save configurations to localStorage
- **Import/Export**: Share configurations via JSON files with full validation
- **URL Sharing**: Share complete setups through URL parameters
- **Configuration History**: Access and restore previous configurations
- **Real-time Sync**: All changes synchronize across preview and output instantly

### 🌙 Premium User Experience
- **Dark/Light Theme**: Elegant theme switching with system preference detection
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Smooth Animations**: Polished animations for all interactions
- **Keyboard Shortcuts**: Power user shortcuts for common operations
- **Touch Support**: Full touch interface support for tablets
- **Accessibility**: Screen reader friendly with proper ARIA labels

## 🛠️ Installation & Usage

### Quick Start
1. **Open the application** in any modern web browser
2. **Choose a template** or start with a custom configuration
3. **Configure your panels** using the intuitive interface
4. **Copy the generated code** and run it in your terminal

### Local Development
```bash
# Clone the repository
git clone https://github.com/ugurcandede/windows-terminal-multi-panel-setup-generator.git

# Navigate to project directory
cd windows-terminal-multi-panel-setup-generator

# Open with a local server (recommended)
npx serve .

# Open http://localhost:8000 in your browser
```

## 💡 Usage Examples

### Basic Commands
```powershell
# Single panel with command
wt new-tab --title "Development" --suppressApplicationTitle --startingDirectory "C:\Projects" --tabColor "#4ecdc4" pwsh -Command "npm start"

# Vertical split with size
wt
    new-tab --title "Frontend" --suppressApplicationTitle --startingDirectory "C:\Projects\frontend" pwsh -Command "npm run dev" `;
    split-pane -V --size 0.7 --title "Backend" --suppressApplicationTitle --startingDirectory "C:\Projects\backend" pwsh -Command "npm run server"

# Horizontal split
wt 
    new-tab --title "Main" --suppressApplicationTitle --startingDirectory "C:\Projects" pwsh -Command "npm start" `; 
    split-pane -H --size 0.3 --title "Logs" --suppressApplicationTitle --startingDirectory "C:\Projects\logs" pwsh -Command "Get-Content app.log -Wait"
```

### Advanced Multi-Panel Setup
```powershell
# Complex development environment
wt 
    new-tab --title "Frontend" --suppressApplicationTitle --startingDirectory "C:\Projects\frontend" --tabColor "#4ecdc4" pwsh -Command "npm run dev" `; 
    split-pane -V --size 0.6 --title "Backend" --suppressApplicationTitle --startingDirectory "C:\Projects\backend" --tabColor "#ff6b6b" pwsh -Command "npm run server" `;
    split-pane -H --size 0.4 --title "Database" --suppressApplicationTitle --startingDirectory "C:\Projects" --tabColor "#45b7d1" pwsh -Command "docker-compose up db"
```

### JSON Action Format
```json
{
  "command": {
    "action": "multipleActions",
    "actions": [
      {
        "action": "newTab",
        "commandline": "pwsh -Command \"cd 'C:\\Projects'; npm run dev\"",
        "startingDirectory": "C:\\Projects",
        "tabTitle": "Development Server",
        "suppressApplicationTitle": true,
        "tabColor": "#4ecdc4"
      },
      {
        "action": "splitPane",
        "split": "vertical",
        "size": 0.7,
        "commandline": "pwsh -Command \"cd 'C:\\Projects\\logs'; Get-Content app.log -Wait\"",
        "startingDirectory": "C:\\Projects\\logs",
        "tabTitle": "Application Logs",
        "suppressApplicationTitle": true,
        "tabColor": "#ff6b6b"
      },
      {
        "action": "moveFocus",
        "direction": "first"
      }
    ]
  },
  "name": "Development Server + Application Logs",
  "icon": "🚀"
}
```

## 🔧 Technical Architecture

### Frontend Stack
- **Pure HTML5/CSS3/JavaScript**: No framework overhead, maximum compatibility
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Font Awesome**: Comprehensive icon library for consistent UI
- **Prism.js**: Syntax highlighting for generated code
- **SortableJS**: Drag and drop functionality for panel reordering


## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test on multiple browsers and screen sizes
- Update documentation for new features

## 🐛 Known Issues & Solutions

### Common Issues
1. **Long paths in JSON**: Use double backslashes (`\\`) for Windows paths
2. **Commands not executing**: Ensure PowerShell execution policy allows scripts

### Troubleshooting
- **Clear browser cache** if experiencing odd behavior
- **Check console** for JavaScript errors
- **Verify Windows Terminal version** (1.9+ recommended)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ❤️ by **Ugurcan Dede**

## 🙏 Acknowledgments

- **Microsoft** for Windows Terminal and comprehensive documentation
- **Tailwind CSS** team for the excellent utility framework
- **Font Awesome** for the beautiful icon library
- **Prism.js** for syntax highlighting capabilities
- **SortableJS** for drag and drop functionality
- **Community contributors** for feedback and suggestions

---
<div align="center">

**⭐ Star this project if you find it useful! ⭐**

Made with ❤️ for the developer community

</div>
