/// <reference types="typescript-stl" />
/// <reference types="samchon-framework" />

namespace interaction.viewer
{
	export import library = samchon.library;
	export import collections = samchon.collections;
	export import protocol = samchon.protocol;
	
	export const INTERVAL: number = 1;
	export const WIDTH: number = 1500;
	export const HEIGHT: number = 1000;
}

declare var ReactDataGrid: typeof AdazzleReactDataGrid.ReactDataGrid;