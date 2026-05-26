#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# scripts/convert-to-webp.sh
# Batch converts PNG/JPG portfolio assets to WebP for optimal delivery.
#
# Prerequisites: cwebp (brew install webp)
# Usage:         bash scripts/convert-to-webp.sh
#                bash scripts/convert-to-webp.sh --quality 90  (optional quality override)
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

QUALITY="${2:-82}"  # Default quality: 82 (great visual fidelity, ~90% size reduction)
DIRS=("public/images/projects" "public/images/experiments")

if ! command -v cwebp &>/dev/null; then
  echo "❌  cwebp not found. Install via: brew install webp"
  exit 1
fi

total_saved=0

for dir in "${DIRS[@]}"; do
  echo "📁  Scanning: $dir"
  for f in "$dir"/*.png "$dir"/*.jpg "$dir"/*.jpeg; do
    # Skip glob literals that didn't match any file
    [[ -e "$f" ]] || continue

    ext="${f##*.}"
    out="${f%.*}.webp"

    # Skip if webp version already exists and is newer
    if [[ -f "$out" && "$out" -nt "$f" ]]; then
      echo "  ✓ Already up-to-date: $out"
      continue
    fi

    original_size=$(du -k "$f" | cut -f1)
    cwebp -q "$QUALITY" "$f" -o "$out" -quiet
    new_size=$(du -k "$out" | cut -f1)
    saved=$((original_size - new_size))
    total_saved=$((total_saved + saved))

    echo "  🔄  $f → $out  (${original_size}K → ${new_size}K, saved ${saved}K)"
  done
done

echo ""
echo "✅  Done. Total space saved: ~${total_saved}KB"
echo "   Remember to update image src paths in src/data/portfolio.ts to use .webp extensions."
