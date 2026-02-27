#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys

# Read file with wrong encoding and write with correct one
with open("Boton-Api.yaml", "rb") as f:
    content = f.read()

# Try to decode as latin1 and encode as utf8
try:
    text = content.decode("latin1")
    with open("Boton-Api.yaml", "w", encoding="utf-8") as f:
        f.write(text)
    print("✓ Archivo corregido exitosamente")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
