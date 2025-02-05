# Contributing to ChromaDB Client

Thanks for considering contributing to ChromaDB Client! This document provides guidelines and steps for contributing.

## Development Setup

1. Fork and clone the repository

```bash
git clone https://github.com/your-username/chromadb-client.git
cd chromadb-client
```

2. Install dependencies

```bash
pnpm install
```

3. Create environment files

```bash
cp apps/backend/example.env apps/backend/.env
cp apps/frontend/example.env apps/frontend/.env
```

## Development Workflow

1. Create a new branch

```bash
git checkout -b feature/your-feature-name
```

2. Run the development servers

```bash
# Terminal 1
pnpm frontend:dev

# Terminal 2
pnpm backend:dev
```

3. Make your changes following these guidelines:

-   Follow the existing code style
-   Add comments for complex logic
-   Ensure dark mode support with Tailwind CSS

4. Test your changes
   Test your changes both in manual mode and in Docker.

## Commit Guidelines

Use conventional commits with these types:

-   `feat:` New features
-   `fix:` Bug fixes
-   `docs:` Documentation changes
-   `style:` Code style changes
-   `refactor:` Code refactoring
-   `test:` Adding or updating tests
-   `chore:` Maintenance tasks

Example:

```bash
git commit -m "feat: add dark mode support to document list"
```

## Pull Request Process

1. Update the README.md if needed
2. Update documentation if necessary
3. Submit PR with clear description of changes
4. Wait for review and address any feedback

## Code Style

-   Use JavaScript when possible
-   Follow Vue.js v3 Composition API patterns
-   Use Tailwind CSS for styling
-   Include dark mode variants for UI components
-   Keep components small and focused

## Need Help?

-   Open an issue for bugs
-   Start a discussion for features
-   Tag maintainers for urgent issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
