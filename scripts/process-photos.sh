#!/usr/bin/env bash
# Prepare the product photographs for the site.
#
# The raw shots come off a phone at up to 10 MB and disagree about their
# backgrounds: a blue cutting mat, a wooden bench, a pale tile floor. Rather
# than cutting the devices out, which would read as an e-commerce listing and
# fight the field register the whole page is built in, each image is cropped to
# the aspect ratio the layout reserves and given the same warm grade, so the
# set reads as one shoot.
#
# Run from the repository root: bash scripts/process-photos.sh
set -euo pipefail

RAW="source-photos"
OUT="public/images/products"
mkdir -p "$OUT"

# Pull the saturation most of the way out, tint toward the raised surface, lift
# contrast. This is stronger than it first looks necessary, and it has to be:
# the v2 shot sits on a bright blue cutting mat that otherwise dominates the
# page. At this strength the mat reads as neutral olive while the enclosures,
# being white, stay white.
GRADE=(-modulate 100,28,106 -fill '#2a2f1c' -colorize 24% -brightness-contrast -4x12)

# name | source | width | height | crop gravity | vertical offset
#
# The offset exists because two of these are 1080x2400 phone portraits where
# the device is nowhere near the centre. A centre crop of v4-closeup lands on
# a parts box and misses the device entirely.
SLOTS=(
  "node-hero total-3-versions.jpg 1600 900 center 0"
  "node-v2   v2-cropped.jpg       1200 900 center 0"
  "node-v4   v4-closeup.jpg       1200 900 north  1250"
)

for slot in "${SLOTS[@]}"; do
  read -r name src w h grav off <<<"$slot"
  if [[ ! -f "$RAW/$src" ]]; then
    echo "skip $name: $RAW/$src not found"
    continue
  fi
  # Crop first at native resolution so the offset means what it says, then
  # scale. Cropping after a resize would move the subject out of frame.
  magick "$RAW/$src" \
    -auto-orient \
    -gravity "$grav" \
    -crop "$(magick "$RAW/$src" -auto-orient -format '%w' info:)x$(
      awk -v w="$(magick "$RAW/$src" -auto-orient -format '%w' info:)" \
          -v tw="$w" -v th="$h" 'BEGIN{printf "%d", w*th/tw}'
    )+0+${off}" +repage \
    -resize "${w}x${h}^" \
    -gravity center \
    -crop "${w}x${h}+0+0" +repage \
    "${GRADE[@]}" \
    -strip \
    -quality 82 \
    "$OUT/$name.webp"
  printf '%-12s %s -> %s  %s\n' "$name" "$src" "$OUT/$name.webp" \
    "$(du -h "$OUT/$name.webp" | cut -f1)"
done

# The logo is white line art on transparency: three peaks with signal waves,
# above a TREKLINK wordmark. No grade, because it is a mark and not a
# photograph.
#
# The two halves are used in different places, so they are cut apart here. The
# trimmed lockup is 2315x1328 with a fully transparent band at rows 891 to
# 1026 separating them, measured rather than eyeballed.
if [[ -f "$RAW/LOGO1112@2x.png" ]]; then
  mkdir -p public/images/brand

  # Full lockup, for the footer.
  magick "$RAW/LOGO1112@2x.png" -trim +repage -resize x220 -strip \
    public/images/brand/treklink-logo.webp

  # Peaks only, for the header, where the wordmark is already set in Oswald
  # beside it and repeating it would be saying the name twice.
  magick "$RAW/LOGO1112@2x.png" -trim +repage \
    -crop "2315x891+0+0" +repage -trim +repage -resize x120 -strip \
    public/images/brand/treklink-mark.webp

  # Favicon: the mark on the page ground, since a white-on-transparent mark
  # disappears into a light browser tab strip.
  magick "$RAW/LOGO1112@2x.png" -trim +repage \
    -crop "2315x891+0+0" +repage -trim +repage \
    -resize 344x344 -background '#12170f' -gravity center -extent 512x512 \
    -strip public/favicon.png

  for f in public/images/brand/treklink-logo.webp \
           public/images/brand/treklink-mark.webp public/favicon.png; do
    printf '%-12s %-46s %s\n' "brand" "$f" "$(du -h "$f" | cut -f1)"
  done
fi

echo "done"
