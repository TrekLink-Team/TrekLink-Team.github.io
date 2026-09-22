#!/usr/bin/env bash
# Derive the site's brand assets from the supplied logo artwork.
#
# Product photographs are NOT handled here. They arrive already processed from
# the leader and are dropped straight into public/images/products/, then
# registered in src/lib/media.ts. Grading raw camera shots on the way in was
# tried and rejected: a raw workshop photograph does not belong on a landing
# page, whatever is done to it in software.
#
# Run from the repository root: bash scripts/build-brand-assets.sh
set -euo pipefail

SRC="source-photos/LOGO1112@2x.png"
OUT="public/images/brand"

if [[ ! -f "$SRC" ]]; then
  echo "no logo artwork at $SRC, nothing to do"
  echo "the generated assets under $OUT are committed, so this is not an error"
  exit 0
fi

mkdir -p "$OUT"

# White line art on transparency: three peaks with signal waves, above a
# TREKLINK wordmark. No grade, because it is a mark and not a photograph.
#
# The two halves are cut apart here because they are used in different places.
# The trimmed lockup is 2315x1328 with a fully transparent band at rows 891 to
# 1026 separating them, measured by scanning the alpha channel rather than
# eyeballed.

# Full lockup, for the footer.
magick "$SRC" -trim +repage -resize x220 -strip "$OUT/treklink-logo.webp"

# Peaks and waves only, for the header, where the wordmark is already set in
# Oswald beside it and repeating it would be saying the name twice.
magick "$SRC" -trim +repage -crop "2315x891+0+0" +repage -trim +repage \
  -resize x120 -strip "$OUT/treklink-mark.webp"

# Favicon: the mark on the page ground, because white line art on
# transparency disappears into a light browser tab strip.
magick "$SRC" -trim +repage -crop "2315x891+0+0" +repage -trim +repage \
  -resize 344x344 -background '#12170f' -gravity center -extent 512x512 \
  -strip public/favicon.png

for f in "$OUT/treklink-logo.webp" "$OUT/treklink-mark.webp" public/favicon.png; do
  printf '%-44s %s\n' "$f" "$(du -h "$f" | cut -f1)"
done
echo "done"
