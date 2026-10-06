# CLOCKWYRD 1.0.0

## Fixed

- Broken nested dashboard button/JSX structure.
- Dashboard and content routes that could be reached without a real authenticated session.
- OAuth access token persistence in browser `localStorage`.
- Hard-coded keep-alive target.
- Overly broad default bot invite permissions.
- Missing fallback route for unknown URLs.
- Missing application-level recovery UI for runtime React errors.
- Stale placeholder states in the utilities and content workflow.

## Added

- Discord authorization-code login with HTTP-only session cookie.
- Session check/logout endpoints.
- Dashboard health and Discord connection telemetry.
- Content search, filters, editing, deleting, previewing, publishing, slugs, word count, read-time estimate, and local draft recovery.
- Public article pages.
- Discord timestamp generator.
- Discord snowflake decoder.
- JSON formatter.
- Local event creation/deletion and calendar markers.
- Configurable bot invite permissions.
- Deployment-safe environment examples.
- Safer API error handling and configuration checks.
