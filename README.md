# Sync

`Sync` is a desktop combat meter for **Blue Protocol: Star Resonance** with a cleaner shell, a dedicated product identity, and room for the gameplay fixes still ahead.

## Current direction

- Reworked app shell and landing experience
- Dedicated Sync branding across desktop, updater, and release surfaces
- Ongoing work on upload, updater, and telemetry infrastructure
- Future gameplay work: ID updates, damage corrections, and data validation

## Project status

Some backend-facing pieces are still being replaced, especially around upload and update infrastructure. Treat those areas as in-progress integration work rather than final Sync behavior.

## Windows installer

To build a Windows installer that other people can download and run:

```bash
npm ci
npm run build:installer
```

The local installer script writes the bundle to `src-tauri/target-installer/release/bundle/nsis/`. It uses an isolated Cargo target directory to avoid Windows file-lock issues if a previously run build still has the bundled WinDivert driver loaded from the default `target/release` path.

For GitHub releases, push a tag that matches the app version in `src-tauri/tauri.conf.json` such as `v0.19.5-beta`. The release workflow will build the NSIS installer and attach the bundle artifacts automatically.

## Attribution

Sync is derived from:

- [resonance-logs/resonance-logs](https://github.com/resonance-logs/resonance-logs)
- [winjwinj/bpsr-logs](https://github.com/winjwinj/bpsr-logs)

Original licensing and copyright notices should be preserved where required.

## Data resources

- [PotRooms/StarResonanceData](https://github.com/PotRooms/StarResonanceData)
- [snoww/loa-logs](https://github.com/snoww/loa-logs)
- [uwuowo.mathi.moe](http://uwuowo.mathi.moe/)

## License

See [LICENSE](LICENSE).
