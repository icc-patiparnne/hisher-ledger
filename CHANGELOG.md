# Changelog

All notable changes to this Formance Ledger deployment project.

## [Unreleased]

### Added
- Custom ledger build from main branch with go-libs v3.4.0 authentication fix
- Console authentication proxy service to bridge MICRO_STACK mode with authenticated APIs
- Comprehensive operational scripts in `scripts/` directory
- Makefile with common commands for easy management
- `.env.example` template for environment configuration
- Enhanced `.gitignore` with better coverage

### Changed
- Restructured repository for better organization:
  - `formance/src/ledger/` - Active source code for building
  - `formance/reference/` - Reference code (auth, console)
  - `proxy/console/` - Custom authentication proxy
  - `build/fix/ledger` - Build artifacts
- Renamed Docker project from `ledger-production` to `ledger`
- Renamed `custom.Dockerfile` to `Dockerfile` (standard naming)
- Updated binary path from `/usr/local/bin/ledger` to `/usr/local/bin/formance-ledger`
- Moved all deployment files from `production/` to root directory

### Fixed
- AUTH_ISSUER bug in released Formance Ledger versions
- Console v3 MICRO_STACK mode authentication support via proxy
- Double `/api` prefix issue in proxy requests
- Missing `/versions` endpoint for console compatibility

## [2024-11-18] - Initial Setup

### Added
- Docker Compose stack with all services
- OAuth2 client credentials authentication
- Caddy API gateway with CORS support
- PostgreSQL databases for ledger and auth
- Comprehensive README documentation
- Security checklist and best practices

### Technical Details
- Formance Ledger: Custom build from main branch (commit 44ac0a88)
- Formance Auth: v2.4.1
- Formance Console: f76467637c7c594a35a39690b5e26f69936b2dcf (Nov 7, 2025)
- Go: 1.25.4
- Node.js: 20-alpine (for proxy)
- PostgreSQL: 16-alpine
- Caddy: v2.0.31

### Known Limitations
- Console v3 MICRO_STACK mode doesn't natively support authenticated APIs
- Released ledger versions (v2.3.0, v2.3.3, v2.0.32) have AUTH_ISSUER bug
- Console has no built-in authentication in MICRO_STACK mode

### Workarounds Implemented
- Custom ledger build from source with authentication fix
- Console proxy for automatic OAuth token management
- Mock `/versions` endpoint in proxy for console compatibility
- `/api` prefix stripping in proxy to avoid double prefix
