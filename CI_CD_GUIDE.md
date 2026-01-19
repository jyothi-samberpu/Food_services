# CI/CD Pipeline Documentation

## Overview

This repository includes a comprehensive CI/CD (Continuous Integration/Continuous Deployment) pipeline configured using GitHub Actions. The pipeline automatically builds, tests, and validates code changes whenever commits are pushed to the main branch or pull requests are created.

## Pipeline Features

### 1. **Multi-Version Node.js Testing**
The pipeline tests the application against multiple Node.js versions (18.x and 20.x) to ensure compatibility across different environments.

### 2. **Automated Dependency Installation**
- Automatically installs dependencies for the root project, backend, and frontend
- Uses `npm ci` when possible for faster, more reliable builds
- Falls back to `npm install` when needed

### 3. **Code Quality Checks**
- **Backend Linting**: Performs syntax validation on the backend Node.js code
- **Frontend Linting**: Runs ESLint on the React/Vite frontend code
- Ensures code quality before deployment

### 4. **Build Process**
- **Frontend Build**: Compiles the React application using Vite
- Generates optimized production-ready assets
- Verifies that the application can be built successfully

### 5. **Build Artifact Storage**
- Uploads the compiled frontend build as an artifact
- Artifacts are retained for 7 days for download and review
- Only stores artifacts from Node.js 20.x builds to reduce storage usage

### 6. **Environment Validation**
- Checks for the presence of `.env.example` files
- Validates that environment configuration templates are available

## Workflow Triggers

The CI/CD pipeline runs automatically on:

### Push Events
```yaml
push:
  branches: ["main"]
```
Triggered when code is pushed directly to the main branch.

### Pull Request Events
```yaml
pull_request:
  branches: ["main"]
```
Triggered when a pull request targeting the main branch is opened, updated, or synchronized.

## Pipeline Jobs

### Build and Test Job

The main job (`build-and-test`) runs on the latest Ubuntu environment and includes the following steps:

1. **Checkout Code** - Retrieves the repository code
2. **Setup Node.js** - Configures the Node.js environment with caching
3. **Install Dependencies** - Installs packages for root, backend, and frontend
4. **Lint Backend** - Validates backend code syntax
5. **Lint Frontend** - Runs ESLint on frontend code (non-blocking)
6. **Build Frontend** - Compiles the React application
7. **Check Environment** - Validates environment configuration
8. **Upload Artifacts** - Stores build outputs for later use

## Project Structure

The pipeline supports a monorepo structure:

```
Food_services/
├── Backend/              # Node.js Express backend
├── dashboard/            # React/Vite frontend
├── .github/
│   └── workflows/
│       ├── ci-cd.yml           # Main CI/CD pipeline
│       ├── deploy-railway.yml  # Railway deployment
│       └── deploy-render.yml   # Render deployment
└── package.json          # Root configuration
```

## Using the Pipeline

### For Developers

1. **Before Pushing Code**:
   - Ensure your code passes local linting
   - Test your changes locally
   - Commit meaningful changes with clear messages

2. **Creating Pull Requests**:
   - The pipeline will automatically run on your PR
   - Wait for all checks to pass before requesting review
   - Fix any issues identified by the pipeline

3. **Merging to Main**:
   - Ensure all CI checks pass
   - The pipeline will validate the merged code
   - Deployment workflows may trigger automatically

### For Maintainers

1. **Monitoring Pipeline Status**:
   - Check the Actions tab in GitHub for pipeline runs
   - Review failed builds and identify issues
   - Download build artifacts for testing

2. **Pipeline Maintenance**:
   - Update Node.js versions as needed
   - Add new checks as the project evolves
   - Optimize caching for faster builds

## Customization

### Adding New Checks

To add new validation steps, edit `.github/workflows/ci-cd.yml`:

```yaml
- name: Your New Check
  working-directory: ./path/to/directory
  run: |
    echo "Running new check..."
    npm run your-command
```

### Changing Node.js Versions

Modify the matrix strategy:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]  # Add new versions
```

### Adding Test Suites

When tests are added to the project, include them in the pipeline:

```yaml
- name: Run Backend Tests
  working-directory: ./Backend
  run: npm test

- name: Run Frontend Tests
  working-directory: ./dashboard
  run: npm test
```

## Deployment Integration

The CI/CD pipeline integrates with existing deployment workflows:

- **Railway Deployment** (`deploy-railway.yml`) - Automatically deploys to Railway on main branch pushes
- **Render Deployment** (`deploy-render.yml`) - Automatically deploys to Render on main branch pushes

These deployment workflows run after the main CI/CD pipeline succeeds.

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check the Actions log for specific errors
   - Verify that all dependencies are correctly listed
   - Ensure environment variables are properly configured

2. **Lint Errors**:
   - Run `npm run lint` locally to see detailed errors
   - Fix code style issues before pushing
   - Consider adding pre-commit hooks

3. **Dependency Issues**:
   - Delete `node_modules` and `package-lock.json`, then reinstall
   - Ensure all package versions are compatible
   - Check for security vulnerabilities with `npm audit`

### Getting Help

- Review the GitHub Actions documentation: https://docs.github.com/en/actions
- Check pipeline logs in the Actions tab
- Contact the repository maintainers for assistance

## Security Considerations

- **Secrets Management**: Never commit sensitive data like API keys or passwords
- **Environment Variables**: Use GitHub Secrets for sensitive configuration
- **Dependencies**: Regularly update dependencies to patch security vulnerabilities
- **Access Control**: Limit who can modify workflow files

## Best Practices

1. **Keep Workflows Fast**: Optimize build times with caching and parallel jobs
2. **Fail Fast**: Configure jobs to fail immediately on critical errors
3. **Clear Naming**: Use descriptive names for jobs and steps
4. **Documentation**: Keep this file updated as the pipeline evolves
5. **Testing**: Test workflow changes in feature branches before merging

## Future Enhancements

Planned improvements for the CI/CD pipeline:

- [ ] Add automated test suites (unit, integration, e2e)
- [ ] Implement code coverage reporting
- [ ] Add security scanning (CodeQL, Dependabot)
- [ ] Create preview deployments for pull requests
- [ ] Add performance benchmarking
- [ ] Implement automatic changelog generation
- [ ] Add notification integration (Slack, email)

## Contributing

When contributing to the CI/CD pipeline:

1. Test changes in a feature branch first
2. Document any new features or changes
3. Ensure backward compatibility
4. Get approval from maintainers before merging

## License

This CI/CD configuration is part of the Food Services project and follows the same license (ISC).

## Support

For issues related to the CI/CD pipeline:
- Open an issue on GitHub
- Tag issues with the `ci/cd` label
- Provide relevant logs and error messages
