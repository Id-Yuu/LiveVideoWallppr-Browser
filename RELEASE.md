# Release Guidelines

## How to Create a Release

### 1. Prepare the Release
- Ensure all changes are merged to `main`
- Update `package.json` version field to match the release version
- Create a git tag following semantic versioning (e.g., `v1.2.3`)

```bash
git tag v1.2.3
git push origin v1.2.3
```

### 2. Automated Release Process
When you push a tag matching the pattern `v*.*.*`, the GitHub Actions workflow automatically:
- Builds the extension for Chrome, Firefox, and Edge
- Creates release artifacts (ZIP files for each browser)
- Generates release notes based on commit history and PR labels
- Publishes the release with artifacts

### 3. Release Artifacts
The release will include pre-built extensions for:
- **Chrome** (`LiveVideoWallppr-chrome-vX.Y.Z.zip`)
- **Firefox** (`LiveVideoWallppr-firefox-vX.Y.Z.zip`)
- **Edge** (`LiveVideoWallppr-edge-vX.Y.Z.zip`)

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** (X.0.0): Breaking changes or major new features
- **MINOR** (0.X.0): New features (backward compatible)
- **PATCH** (0.0.X): Bug fixes and maintenance

## Commit Labels for Release Notes

Use these labels on PRs to categorize changes in the release notes:

| Label | Category | Usage |
|-------|----------|-------|
| `feature` / `enhancement` | 🚀 New Features | New features and enhancements |
| `bug` / `fix` | 🐛 Bug Fixes | Bug fixes and corrections |
| `documentation` / `docs` | 📚 Documentation | Documentation updates |
| `maintenance` / `dependencies` / `chore` | 🔧 Maintenance & Dependencies | Dependencies and maintenance |
| `performance` | ⚡ Performance | Performance improvements |
| `ui` / `ux` / `styling` | 🎨 UI/UX | UI and styling changes |
| `ignore-for-release` | (Excluded) | Changes to exclude from release notes |

## Notes

- The extension builds are **multi-browser compatible** with native manifest configurations
- Firefox builds use **Manifest V2** (as required by Mozilla)
- Chrome and Edge builds use **Manifest V3**
- No manual intervention is required after pushing a tag
