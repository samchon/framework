/// <reference path="../API.ts" />

/// <reference path="../library/XML.ts" />
/// <reference path="../collection/ArrayCollection.ts" />
/// <reference path="../protocol/Entity.ts" />

if (samchon.is_node() == true)
	for (let key in samchon)
		exports[key] = samchon[key];