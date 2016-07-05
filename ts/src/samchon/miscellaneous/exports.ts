/// <reference path="../API.ts" />

/// <reference path="../library/XML.ts" />
/// <reference path="../collection/ArrayCollection.ts" />
/// <reference path="../protocol/Entity.ts" />

if (std.is_node() == true)
{
	(Object as any).assign(exports, samchon);

	samchon.example.test_websocket();
}