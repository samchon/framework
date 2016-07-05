/// <reference path="../protocol/Entity.ts" />

namespace samchon.example
{
	class TestEntity extends protocol.Entity
	{
		public flag: boolean = true;

		public TAG(): string
		{
			return "test";
		}
	}

	export function test_entity(): void
	{
		let te: TestEntity = new TestEntity();

		console.log(te.toXML().toString());
	}
}