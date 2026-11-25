# Spectra35 — EXPERIMENTAL TESTS

Offline research assets for the 1600 × 1200 OpenPaper L test unit.
Changing controller drive can permanently damage a panel. This is not an
ordinary Spectra6 image format and not a manufacturer-approved 35-color mode.
No firmware flasher or hardware sender is included.

## Compile an exact token image

Create a 1600 × 1200 PNG using the palette's `deviceColor` values
#010000..#010022 (opaque RGB). These values encode recipe indices 0..34,
not the native pixel code or the preview color. Rotate/fit the source before
processing. Do not transform or interpolate the token PNG afterwards.

    python3 -m venv .venv
    . .venv/bin/activate
    python -m pip install -r requirements.txt
    python compile_plan.py tokens.png new-plan

This writes indices.png and passes/plan.json with five losslessly compressed
image streams and four 2048-byte LUT files. It sends nothing to hardware.
Existing output directories are rejected. The entire source raster is retained:
no witness strip is inserted. Even a single-state image retains all four LUT
passes, because the palette was measured with that complete sequence.

## Hardware adapter contract

Use only with a matching experimental driver. Standard firmware/API upload
cannot execute this plan. Each logical raster is 1600 × 1200; the bench adapter
rotates it into two 600 × 1600 controller rasters, packs two four-bit selections
per byte, and zlib-compresses 100 blocks of 4800 decoded bytes per controller.
Each compressed block has a little-endian 16-bit length. These are bench
transport files, not a universal panel wire protocol.

Follow steps in order: native history preparation, then the four measured LUTs.
Each step contains both controller FNV32 raster hashes and a SHA-256 transport
hash. Each LUT contains 2048 bytes and has SHA-256/FNV32 checks. Verify successful
staging before refresh; require natural PON/DRF0/POF completion. Do not refresh a
failed upload or blindly resume/replay after an error. Reinspect the saved state
and prepare a fresh complete run if the previous pigment history is uncertain.

Source0 is only an experimental hold candidate, not electrically confirmed HiZ.
Keeping another region's mask at bank0 does not prove that region is unaffected.
Do not infer absolute voltages from the source codes. Do not change unknown
power/VCOM registers based on guessed voltages. Driver integration and lifetime
qualification remain open; contact the project before hardware experiments.

## Provenance and limitations

The palette is copied exactly from natural35/library/palette.json, SHA-256:
c829d104627fcf7e7666ef24b4733809fdeb0947a95900e6df537b3850bf26c0.
The compact profile retains the same recipe fields and measured LUT order.
The four LUT binaries are unchanged. The planner derives from the bench planner;
it retains the measured pass set even when some recipes are unused.

Camera-derived solid-field RGB values are approximate. Measurements used two
fresh builds, both controller halves and an in-frame reference card. Fine
mixtures, history and illumination change appearance. The recipes are all
provisional, not 35 guaranteed stable colors or 16 neutral grays. No calibrated
absolute Source/VCOM measurements or lifetime qualification are available.
The later scene-tuned v3 input correction is not included in this palette kit.

See https://docs.paperlesspaper.de/panels/spectra35 for the full guide.
