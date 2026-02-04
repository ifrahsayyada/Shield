# Contributing to SHIELD_R

Thank you for your interest in contributing to SHIELD_R! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Help others learn and grow
- Report issues constructively

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/YOUR-USERNAME/Shield.git
   cd Shield
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Run both servers
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

## Commit Guidelines

- Use clear, descriptive commit messages
- Format: `type: brief description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```bash
git commit -m "feat: add two-factor authentication"
git commit -m "fix: resolve zone filtering bug"
git commit -m "docs: update API endpoints documentation"
```

## Pull Request Process

1. **Ensure your code works locally**
   - Run both frontend and backend
   - Test all related features
   - Check for console errors

2. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request on GitHub**
   - Title: Clear description of changes
   - Description: Why this change, what it fixes/adds
   - Reference any related issues: `Closes #123`

4. **Code Review**
   - Address feedback promptly
   - Be open to suggestions
   - Update based on review comments

## Code Style

### JavaScript
- Use consistent indentation (2 spaces)
- Use `const` by default, `let` if needed, avoid `var`
- Use template literals for strings
- Use arrow functions where appropriate
- Keep functions small and focused

### React
- Use functional components with hooks
- Prop names should be camelCase
- Component names should be PascalCase
- Extract reusable components
- Use meaningful component and variable names

### CSS
- Use mobile-first approach
- Use consistent naming (kebab-case for classes)
- Group related styles
- Add comments for complex sections

## Testing

While SHIELD_R doesn't have formal tests yet, please:
- Test your changes manually
- Verify both frontend and backend work
- Check for console errors
- Test on mobile viewport

## Documentation

- Update README.md if adding new features
- Document new API endpoints
- Add comments for complex logic
- Update .github/copilot-instructions.md if architecture changes

## Reporting Issues

When reporting bugs, include:
- Browser/Node version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/error logs if applicable
- Environment (Windows/Mac/Linux)

## Feature Requests

When suggesting features:
- Explain the use case
- Describe the expected behavior
- Provide mockups/examples if helpful
- Consider mobile-first design

## Areas for Contribution

### High Priority
- [ ] Add database integration (PostgreSQL/SQLite)
- [ ] Implement user authentication
- [ ] Add real-time notifications
- [ ] Improve error handling

### Medium Priority
- [ ] Add unit/integration tests
- [ ] Implement dark mode
- [ ] Add i18n support
- [ ] Performance optimizations

### Low Priority
- [ ] Documentation improvements
- [ ] UI/UX refinements
- [ ] Code cleanup
- [ ] README updates

## Questions?

- Open an issue on GitHub
- Email: ifrahsayyada2025@gmail.com
- Check existing issues/discussions first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy Contributing! 🎉**
