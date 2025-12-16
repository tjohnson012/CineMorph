import json
from pathlib import Path
from typing import Optional
from app.models import CinematographyDNA, PresetInfo


PRESETS_DIR = Path(__file__).parent.parent / "presets"


def load_preset(name: str) -> Optional[dict]:
    preset_path = PRESETS_DIR / f"{name}.json"
    if not preset_path.exists():
        return None
    with open(preset_path) as f:
        return json.load(f)


def list_presets() -> list[PresetInfo]:
    presets = []
    for path in PRESETS_DIR.glob("*.json"):
        with open(path) as f:
            data = json.load(f)
            presets.append(PresetInfo(
                name=path.stem,
                description=data.get("description", ""),
                signature_traits=data.get("signature_traits", [])
            ))
    return presets


def apply_preset(dna: CinematographyDNA, preset: dict) -> CinematographyDNA:
    dna_dict = dna.model_dump()
    overrides = preset.get("overrides", {})

    for category, params in overrides.items():
        if category in dna_dict:
            dna_dict[category].update(params)

    return CinematographyDNA(**dna_dict)
