
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] 
### Added
- [upstream] Added a downloadSVG and copyToClipboard function
- [upstream] Added a dns configuration to allow production to work
- Tagging actions now work on mobile
- Don't allow viewport zooming
### Changed
- Lights are now completely calculated with CSS variables
- Simplified themes
- Simplified the spin page to remove the multiple wheel showcase
- [upstream] Migrated to tailwind v4
- [upstream] Moved most tailwind variables into a shared config
- [upstream] DynamoDB can now handle default values
- Mobile links now route to their apps or the app store by default
### Removed
- The wheel preview page
- [upstream] Stopped using SCSS, it's features are now unnecessary
- Lights don't display on mobile to save memory
### Fixed
- [upstream] QR Codes are now responsive
- The wheel display is mobile friendly now
- Made the instructions scrollable in the live mobile view
- [upstream] Database model creation is idempotent to handle race conditions
- Hydration issues for draggable items
- Writing to server on leading and trailing edges of debounced calls
- Added a minimum font size to stop iOS zooming
- Made sure the button mode is preserved between spins


## [v1.0.0] 14 Feb 2025
### Added
- Made the wheel
- Added the campaign setup page
- Made the customer view page visuals
- Campaigns can be pushed and reordered
- History can be viewed for each item
- [upstream] A data table component
- [upstream] Listing models and databases in descending order
### Changed
- [upstream] The application is now a PWA
### Fixed
- Added type safety to the data models "data" field by inferring the data type
- [upstream] tests for @repo/database and @repo/models now work
- [upstream] model.exists now tests all GSI's to avoid model duplicates

