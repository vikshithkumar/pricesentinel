# Suggested Commands Memory

Durable, cross-system commands for compiling, building, formatting, linting, and running the project.

## Development Tasks
- **Start Local Server**: `npm run dev` (hosts the Vite live HMR server)
- **Production Build**: `npm run build` (runs typechecking `tsc -b` and bundler compilation `vite build`)
- **Lint Codebase**: `npm run lint` (runs `oxlint` rule checks)
- **Local Preview**: `npm run preview` (hosts local production dist bundle)

## Windows Utility Commands (PowerShell)
- **Grep Search**: Use PowerShell `Select-String` to look for pattern occurrences inside source files:
  `Select-String -Path "src\**\*" -Pattern "pattern_here"`
- **List All Files**: `Get-ChildItem -Recurse`