/// <reference path="../API.ts" />

/**
 * @hidden
 */
namespace samchon.test
{
	export function test_collection(): void
	{
		console.log(new protocol.Invoke("ABCD", true, false, 3.0, "ABCD").toXML().toString());

		let container = new collections.DequeCollection<number>();
		container.addEventListener("insert", handle_event);
		container.addEventListener("erase", handle_event);

		container.push(1, 2, 3, 4, 5, 6, 7);
		container.pop_back();
		
		std.remove(container.begin(), container.end(), 5);
	}

	function handle_event(event: collections.CollectionEvent<number>): void
	{
		console.log("Handle Event:", event.type);

		for (let it = event.first; !it.equal_to(event.last); it = it.next())
			console.log("\t" + it.value);
		console.log();
	}
}