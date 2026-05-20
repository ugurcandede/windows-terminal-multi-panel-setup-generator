import type { Panel } from '@/types/panel';

export interface DefaultTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
  panels: Omit<Panel, 'id'>[];
}

export const DEFAULT_TEMPLATES: readonly DefaultTemplate[] = [
  {
    id: 'fullstack',
    name: 'Full-Stack',
    description: 'Frontend + Backend + Database',
    icon: 'code',
    accent: '#4ecdc4',
    panels: [
      { title: 'Frontend',   directory: 'D:\\MyProjects\\my-app\\frontend', commands: 'npm run dev',                color: '#4ecdc4', profile: 'PowerShell', split: null,       size: 1.0 },
      { title: 'Backend API', directory: 'D:\\MyProjects\\my-app\\backend',  commands: 'npm run start:dev',          color: '#ff6b6b', profile: 'PowerShell', split: 'vertical', size: 0.5 },
      { title: 'Database',    directory: 'D:\\MyProjects\\my-app',           commands: 'docker-compose up postgres', color: '#45b7d1', profile: 'PowerShell', split: 'horizontal', size: 0.3 },
    ],
  },
  {
    id: 'devops',
    name: 'DevOps',
    description: 'Logs + Docker + SSH',
    icon: 'server',
    accent: '#10b981',
    panels: [
      { title: 'System Logs',  directory: 'C:\\Logs',     commands: 'Get-Content app.log -Wait', color: '#10b981', profile: 'PowerShell', split: null,         size: 1.0 },
      { title: 'Docker',       directory: 'C:\\Projects', commands: 'docker-compose logs -f',     color: '#0ea5e9', profile: 'PowerShell', split: 'vertical',   size: 0.5 },
      { title: 'SSH',          directory: 'C:\\Projects', commands: 'ssh user@host',              color: '#f59e0b', profile: 'PowerShell', split: 'horizontal', size: 0.5 },
    ],
  },
  {
    id: 'testing',
    name: 'Testing',
    description: 'Unit + E2E test runners',
    icon: 'vial',
    accent: '#a855f7',
    panels: [
      { title: 'Unit Tests', directory: 'C:\\Projects\\app', commands: 'npm run test -- --watch', color: '#a855f7', profile: 'PowerShell', split: null,       size: 1.0 },
      { title: 'E2E Tests',  directory: 'C:\\Projects\\app', commands: 'npm run test:e2e',         color: '#ec4899', profile: 'PowerShell', split: 'vertical', size: 0.5 },
    ],
  },
  {
    id: 'gamedev',
    name: 'Game Dev',
    description: 'Unity + Assets + Build',
    icon: 'gamepad',
    accent: '#f59e0b',
    panels: [
      { title: 'Asset Pipeline', directory: 'C:\\Unity\\MyGame\\Assets',  commands: 'python build_assets.py --watch', color: '#f59e0b', profile: 'PowerShell', split: null,         size: 1.0 },
      { title: 'Build Server',   directory: 'C:\\Unity\\MyGame',          commands: 'Unity -batchmode -projectPath . -buildTarget Win64', color: '#ff6b6b', profile: 'PowerShell', split: 'vertical', size: 0.4 },
      { title: 'Logs',           directory: 'C:\\Unity\\MyGame\\Logs',    commands: 'Get-Content build.log -Wait',     color: '#45b7d1', profile: 'PowerShell', split: 'horizontal', size: 0.4 },
    ],
  },
  {
    id: 'dataops',
    name: 'Data Ops',
    description: 'DB + ETL + Analytics',
    icon: 'database',
    accent: '#4f46e5',
    panels: [
      { title: 'PostgreSQL', directory: 'C:\\Database', commands: 'psql -U postgres -h localhost -p 5432 mydb', color: '#4f46e5', profile: 'PowerShell', split: null,         size: 1.0 },
      { title: 'ETL',        directory: 'C:\\Data\\etl', commands: 'python pipeline.py',                          color: '#10b981', profile: 'PowerShell', split: 'vertical',   size: 0.5 },
      { title: 'Jupyter',    directory: 'C:\\Data',      commands: 'jupyter notebook',                           color: '#f59e0b', profile: 'PowerShell', split: 'horizontal', size: 0.5 },
    ],
  },
  {
    id: 'mobile',
    name: 'Mobile',
    description: 'React Native + iOS + Android',
    icon: 'mobile-alt',
    accent: '#ec4899',
    panels: [
      { title: 'Metro',   directory: 'C:\\Projects\\mobile-app', commands: 'npx react-native start',          color: '#ec4899', profile: 'PowerShell', split: null,         size: 1.0 },
      { title: 'iOS',     directory: 'C:\\Projects\\mobile-app', commands: 'npx react-native run-ios',         color: '#0ea5e9', profile: 'PowerShell', split: 'vertical',   size: 0.5 },
      { title: 'Android', directory: 'C:\\Projects\\mobile-app', commands: 'npx react-native run-android',     color: '#10b981', profile: 'PowerShell', split: 'horizontal', size: 0.5 },
    ],
  },
];
