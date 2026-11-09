# Backstage Confluence Module Resource Leak Reproduction

This repository demonstrates the file descriptor leak and unhandled promise settlement vulnerability present in the `@backstage/plugin-scaffolder-backend-module-confluence-to-markdown` helper module.

## How to Run
1. Clone this repository locally.
2. Execute the script:
   ```bash
   node index.js
   ```
## Expected vs. Actual Result
* **Expected:** The application handles the incoming stream failure, destroys the write stream, explicitly closes the file descriptor handle, and safely terminates.
* **Actual:** The stream error is swallowed/not forwarded, leaving the open file descriptor leaking on the operating system process.
