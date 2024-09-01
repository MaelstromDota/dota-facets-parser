import {KeyValues} from "easy-keyvalues";
import fetch from "node-fetch";
import path from "path";

// PUT YOUR PATH TO npc_heroes_custom.txt HERE
const NPC_HEROES_CUSTOM_PATH = path.join("F:", "Github", "dota2x4", "game", "scripts", "npc", "npc_heroes_custom.txt");

const NPC_HEROES_URL = "https://raw.githubusercontent.com/spirit-bear-productions/dota_vpk_updates/main/scripts/npc/npc_heroes.txt";

let hero_to_id = {};

/**
 * @param {KeyValues} kv
 * @returns Object<string, Object<string, string>>
 */
async function LoadHeroes(kv) {
	let facets = {};

	for (const hero of kv.GetChildren()) {
		const hero_name = hero.Key;

		const hero_id = hero.FindKey("HeroID");
		if (hero_id != undefined) {
			hero_to_id[hero_name] = parseInt(hero_id.GetValue());
		}

		const hero_facets = hero.FindKey("Facets");
		if (hero_facets != undefined) {
			facets[hero_name] = {};
			for (const facet of hero_facets.GetChildren()) {
				facets[hero_name][(Object.keys(facets[hero_name]).length + 1).toString()] = facet.Key;
			}
		}
	}

	return facets;
}


async function main() {
	const r = await fetch(NPC_HEROES_URL);
	const npc_heroes = await r.text();
	const npc_heroes_kv = await KeyValues.Parse(npc_heroes, "npc_heroes.txt");
	const npc_heroes_custom_kv = await KeyValues.Load(NPC_HEROES_CUSTOM_PATH);

	let facets = await LoadHeroes(npc_heroes_kv.FindKey("DOTAHeroes"))
	for (const kv of npc_heroes_kv.FindAllKeys("#base")) {
		Object.assign(facets, await LoadHeroes(kv.FindKey("DOTAHeroes")));
	}

	let facets_custom = await LoadHeroes(npc_heroes_custom_kv.FindKey("DOTAHeroes"));
	for (const kv of npc_heroes_custom_kv.FindAllKeys("#base")) {
		Object.assign(facets_custom, await LoadHeroes(kv.FindKey("DOTAHeroes")));
	}

	for (const [hero_name, hero_facets] of Object.entries(facets_custom)) {
		if (Object.keys(hero_facets).length <= 0) {
			continue;
		}

		for (const [facet_id, facet_name] of Object.entries(hero_facets)) {
			facets[hero_name][(Object.keys(facets[hero_name]).length + 1).toString()] = facet_name;
		}
	}

	let output = [];
	for (const [hero_name, hero_facets] of Object.entries(facets)) {
		const hero_id = hero_to_id[hero_name];
		if (hero_id == undefined) {
			console.log(`[ERROR] ${hero_name} does not have a HeroID in KV!`);
			return;
		}

		output.push(new KeyValues(hero_id.toString(), Object.entries(hero_facets).map(([id, name]) => new KeyValues(id, name))));
	}

	new KeyValues("Facets", output).Save("facets.kv");
}

main();