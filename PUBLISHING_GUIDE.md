# Publishing Guide for GitHub Package Registry

This guide will help you publish the RabbitMQ consumer module to your GitHub Package Registry.

## Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Node.js**: Version 18 or higher
3. **npm/yarn**: For package management
4. **Git**: For version control

## Setup Steps

### 1. Update Package Configuration

Before publishing, update the following files with your information:

#### `package.json`
```json
{
  "name": "@E-Commerce-SaaS-Platform/auth-module",
  "author": "E-Commerce SaaS Platform <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/E-Commerce-SaaS-Platform/auth-module.git"
  },
  "bugs": {
    "url": "https://github.com/E-Commerce-SaaS-Platform/auth-module/issues"
  },
  "homepage": "https://github.com/E-Commerce-SaaS-Platform/auth-module#readme"
}
```

#### `README.md`
Update the package name in installation instructions:
```bash
yarn add @E-Commerce-SaaS-Platform/auth-module
```

### 2. Create GitHub Repository

1. Create a new repository on GitHub
2. Initialize and push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/E-Commerce-SaaS-Platform/auth-module.git
git push -u origin main
```

### 3. Configure GitHub Package Registry

#### Option A: Using .npmrc (Recommended)
Create a `.npmrc` file in your project root:
```
@E-Commerce-SaaS-Platform:registry=https://npm.pkg.github.com
```

#### Option B: Using npm config
```bash
npm config set @E-Commerce-SaaS-Platform:registry https://npm.pkg.github.com
```

### 4. Authenticate with GitHub

Create a Personal Access Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `write:packages` and `read:packages` permissions
3. Use the token for authentication:

```bash
# Using npm
npm login --registry=https://npm.pkg.github.com

# Using yarn
yarn config set npmRegistryServer https://npm.pkg.github.com
yarn login --registry https://npm.pkg.github.com
```

### 5. Publish the Package

#### Option A: Using the Script (Windows)
```bash
scripts\publish.bat 1.0.0
```

#### Option B: Manual Publishing
```bash
# Update version
npm version 1.0.0

# Build
npm run build

# Test
npm test

# Publish
npm publish
```

#### Option C: Using GitHub Actions
1. Push a tag to trigger the workflow:
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Installing the Published Package

### In Other Projects

#### 1. Configure .npmrc
Create `.npmrc` in your project root:
```
@E-Commerce-SaaS-Platform:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

#### 2. Install the Package
```bash
# Using yarn
yarn add @E-Commerce-SaaS-Platform/auth-module

# Using npm
npm install @E-Commerce-SaaS-Platform/auth-module
```

#### 3. Use in Your NestJS Application
```typescript
import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@E-Commerce-SaaS-Platform/auth-module';

@Module({
  imports: [RabbitMQModule],
})
export class AppModule {}
```

## Version Management

### Semantic Versioning
- `1.0.0` - Major version (breaking changes)
- `1.1.0` - Minor version (new features, backward compatible)
- `1.1.1` - Patch version (bug fixes, backward compatible)

### Publishing New Versions
```bash
# Patch version
npm version patch
npm publish

# Minor version
npm version minor
npm publish

# Major version
npm version major
npm publish
```

## Troubleshooting

### Common Issues

1. **Authentication Error**
   - Ensure your GitHub token has correct permissions
   - Check your `.npmrc` configuration

2. **Package Not Found**
   - Verify the package name matches your GitHub username
   - Check if the package was published successfully

3. **Permission Denied**
   - Ensure you have write access to the repository
   - Check if the package name is available

### Getting Help

- Check GitHub Package Registry documentation
- Review the package logs in GitHub Actions
- Verify your authentication setup

## Best Practices

1. **Always test before publishing**
2. **Use semantic versioning**
3. **Keep dependencies up to date**
4. **Write comprehensive documentation**
5. **Use GitHub Actions for automated publishing**
6. **Tag releases in Git**

## Next Steps

After publishing:
1. Update your documentation
2. Create release notes
3. Share with your team
4. Monitor usage and feedback
5. Plan future updates
