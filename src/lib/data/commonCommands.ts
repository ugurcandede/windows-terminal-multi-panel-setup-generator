export const COMMON_COMMANDS: readonly string[] = [
  // npm
  'npm install',
  'npm start',
  'npm run dev',
  'npm run build',
  'npm run test',
  'npm run lint',
  'npm run server',
  'npm run start:dev',
  'npm run watch',
  // yarn
  'yarn',
  'yarn install',
  'yarn start',
  'yarn dev',
  'yarn build',
  'yarn test',
  // pnpm
  'pnpm install',
  'pnpm dev',
  'pnpm build',
  // Node
  'node index.js',
  'node server.js',
  'npx serve .',
  // .NET
  'dotnet run',
  'dotnet watch run',
  'dotnet build',
  'dotnet test',
  'dotnet restore',
  // Python
  'python main.py',
  'python -m venv venv',
  'pip install -r requirements.txt',
  'python -m http.server',
  'uvicorn main:app --reload',
  // Docker
  'docker-compose up',
  'docker-compose up -d',
  'docker-compose down',
  'docker-compose up postgres',
  'docker-compose logs -f',
  'docker ps',
  'docker stats',
  // Git
  'git status',
  'git pull',
  'git fetch',
  'git log --oneline',
  // PowerShell
  'Get-Content app.log -Wait',
  'Get-Process | Sort-Object CPU -Descending',
  'Get-ChildItem -Recurse',
  // Database
  'psql -U postgres -h localhost -p 5432 mydb',
  'mongo',
  'redis-cli',
  'mysql -u root -p',
  // Mobile
  'npx react-native start',
  'npx react-native run-ios',
  'npx react-native run-android',
  'flutter run',
  // Cloud / DevOps
  'kubectl get pods',
  'kubectl logs -f',
  'terraform plan',
  'terraform apply',
  'aws s3 ls',
  // SSH
  'ssh user@host',
  // Misc
  'clear',
  'cls',
  'tail -f',
  'htop',
];
