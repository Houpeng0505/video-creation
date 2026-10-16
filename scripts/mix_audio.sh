#!/usr/bin/env bash
set -euo pipefail
VIDEO="${1:-out/silent.mp4}"
MUSIC="${2:-out/music.wav}"
OUTPUT="${3:-out/final.mp4}"
VOICE="${4:-public/audio/narration.wav}"
mkdir -p "$(dirname "$OUTPUT")"
if [[ -f "$VOICE" ]]; then
  echo "Mixing speech with sidechain ducking..."
  ffmpeg -hide_banner -loglevel error -y -i "$VIDEO" -stream_loop -1 -i "$MUSIC" -i "$VOICE" \
    -filter_complex "[1:a]aresample=48000,aformat=channel_layouts=stereo,volume=0.40[bg];[2:a]aresample=48000,aformat=channel_layouts=stereo,asplit=2[side][vo];[bg][side]sidechaincompress=threshold=0.018:ratio=8:attack=40:release=400[duck];[duck][vo]amix=inputs=2:duration=longest:dropout_transition=1,loudnorm=I=-16:TP=-1.5:LRA=11[a]" \
    -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 192k -t "$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO")" -movflags +faststart "$OUTPUT"
else
  echo "No narration supplied. Delivering instrumental preview with original placeholder score."
  ffmpeg -hide_banner -loglevel error -y -i "$VIDEO" -stream_loop -1 -i "$MUSIC" \
    -filter_complex "[1:a]aresample=48000,volume=0.54,loudnorm=I=-17:TP=-1.5:LRA=11[a]" \
    -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUTPUT"
fi
