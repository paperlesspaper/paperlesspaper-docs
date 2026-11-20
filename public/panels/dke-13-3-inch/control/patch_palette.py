"""Inspect or compose pixel recipes and photo tone tables for the frame-2 bench firmware.

A byte encodes two pixel RAM nibbles. The pulse is shared by all five
patch types and is measured from the active BUSY edge of the last refresh.
"""
import argparse
import csv
from pathlib import Path
import re
import sys


def pulse_ms(value):
    ms = int(value)
    if not 60 <= ms <= 8000:
        raise ValueError("pulse duration must be between 60 and 8000 ms")
    return ms


def pixel_pair(value):
    if not re.fullmatch(r"[0-9a-fA-F]:[0-9a-fA-F]", value):
        raise argparse.ArgumentTypeError("use PREP:DRIVE, e.g. 9:D")
    return value.replace(":", "").upper()


def photo_rows(recipes, thresholds):
    if len(recipes) != 16 or len(thresholds) != 16:
        raise ValueError("photo tables require exactly 16 rows")
    previous = 0
    for recipe, upper in zip(recipes, thresholds):
        if not re.fullmatch(r"(?:[0-9a-fA-F]{2}|g[0-4])", recipe):
            raise ValueError(f"invalid pixel recipe {recipe!r}")
        if not previous <= upper <= 255:
            raise ValueError("upper luma bounds must be nondecreasing integers from 0 to 255")
        previous = upper
    if previous != 255:
        raise ValueError("the last row must reach luma 255")


def encode_photo(file, mode):
    with file.open(newline="", encoding="utf-8-sig") as source:
        reader = csv.DictReader(source)
        if reader.fieldnames != ["upper_luma", "recipe"]:
            raise ValueError("use the columns upper_luma,recipe")
        rows = list(reader)
    thresholds = [int(r["upper_luma"]) for r in rows]
    recipes = [r["recipe"].strip() for r in rows]
    photo_rows(recipes, thresholds)
    print(mode, "".join(recipes), "".join(f"{upper:02x}" for upper in thresholds))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action", required=True)
    encode = sub.add_parser("encode", help="print one serial command")
    encode.add_argument("ms", type=pulse_ms)
    encode.add_argument("pair", type=pixel_pair, nargs=5, metavar="PREP:DRIVE")
    decode = sub.add_parser("decode", help="inspect PATCHGRID or export a FINEPHOTO/TONEPHOTO line as CSV")
    decode.add_argument("command", help="one quoted bench command")
    photo = sub.add_parser("photo", help="compose a photo LUT from an editable CSV")
    photo.add_argument("csv_file", type=Path)
    photo.add_argument("--mode", choices=["FINEPHOTO", "TONEPHOTO"], default="FINEPHOTO")
    args = parser.parse_args()

    if args.action == "photo":
        try:
            encode_photo(args.csv_file, args.mode)
        except (ValueError, OSError) as error:
            parser.error(str(error))
        return

    if args.action == "encode":
        print(f"PATCHGRID {args.ms} {''.join(args.pair)}")
        return
    if args.command.strip().startswith(("FINEPHOTO", "TONEPHOTO")):
        parts = args.command.split()
        if len(parts) != 3 or parts[0] not in ("FINEPHOTO", "TONEPHOTO") or not re.fullmatch(r"[0-9a-fA-F]{32}", parts[2]):
            parser.error("expected photo command, 16 recipe pairs, and 16 hex thresholds")
        recipes = [parts[1][i:i+2] for i in range(0, len(parts[1]), 2)]
        thresholds = list(bytes.fromhex(parts[2]))
        try:
            photo_rows(recipes, thresholds)
        except ValueError as error:
            parser.error(str(error))
        writer = csv.writer(sys.stdout, lineterminator="\n")
        writer.writerow(["upper_luma", "recipe"])
        writer.writerows(zip(thresholds, recipes))
        return
    match = re.fullmatch(r"PATCHGRID\s+(\d+)\s+([a-fA-F0-9]{10})", args.command.strip())
    if not match:
        parser.error("expected PATCHGRID <milliseconds> <five concatenated hex bytes>")
    try:
        ms = pulse_ms(match[1])
    except ValueError as error:
        parser.error(str(error))
    print(f"Common BUSY pulse: {ms} ms")
    print("Slot  Recipe  Preparation  Partial drive")
    for slot, pair in enumerate(bytes.fromhex(match[2]), start=1):
        print(f"{slot:4}    0x{pair:02X}          0x{pair >> 4:X}            0x{pair & 15:X}")


if __name__ == "__main__":
    main()
