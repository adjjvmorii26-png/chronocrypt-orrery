#!/usr/bin/env bash
# Chronocrypt Orrery boot sequence

set -e
cd "$(dirname "$0")"

echo "══════════════════════════════════════════"
echo "  CHRONOCRYPT ORRERY — spheres aligning"
echo "══════════════════════════════════════════"

node meridian/meridian_flow.js
