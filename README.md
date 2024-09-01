# Facets Parser

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/license/mit)

## Usage

1. Edit `NPC_HEROES_CUSTOM_PATH` at 6th line of [main.js](/main.js) to path to `npc_heroes_custom.txt` of your custom game

2. Run script

```sh
node main.js
```

## Output format

Script's output file is `facets.kv` with following format:
```kv
"Facets"
{
	"HeroID1"
	{
		"1"	"facet_name_1"
		"2"	"facet_name_2"
	}
	"HeroID2"
	{
		"1"	"facet_name_1"
		"2"	"facet_name_2"
	}
}
```

Where `HeroID1`, `HeroID2` are value of `HeroID` in hero's KV