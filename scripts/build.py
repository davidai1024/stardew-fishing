#!/usr/bin/env python3
"""Rebuild the existing runtime in source order, then package game/ for upload."""
import argparse
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VERSION = "0.23"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check without writing files")
    args = parser.parse_args()
    order = json.loads((ROOT / "src/order.json").read_text(encoding="utf-8"))
    runtime = b"".join(
        item["header"].encode("utf-8") + (ROOT / "src" / item["file"]).read_bytes()
        for item in order
    )
    target = ROOT / "game/runtime.js"
    if args.check:
        if runtime != target.read_bytes():
            raise SystemExit("runtime.js differs from src; run python3 scripts/build.py")
        print(f"OK: {len(order)} source modules reproduce runtime.js exactly")
        return
    target.write_bytes(runtime)
    out = ROOT / "dist"
    out.mkdir(exist_ok=True)
    archive = out / f"stardew-fishing-v{VERSION}-xiaohongshu.zip"
    game = ROOT / "game"
    files = sorted(p for p in game.rglob("*") if p.is_file() and not any(
        part.startswith(".") or part == "__pycache__" for part in p.relative_to(game).parts
    ))
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for path in files:
            info = zipfile.ZipInfo(path.relative_to(game).as_posix(), (2026, 11, 8, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            z.writestr(info, path.read_bytes(), compresslevel=9)
    print(f"Built {archive.name}: {len(files)} files, {archive.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
