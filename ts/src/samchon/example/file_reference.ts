namespace samchon.example
{
	export function test_file_reference(): void
	{
		let file: library.FileReference = new library.FileReference();
		
		file.addEventListener("select", handle_select);
		file.addEventListener("complete", handle_complete);

		file.browse("*.js", "*.ts", "*.txt");
	}

	function handle_select(event: library.BasicEvent): void
	{
		let file: library.FileReference = event.target as library.FileReference;

		file.load();
	}

	function handle_complete(event: library.BasicEvent): void
	{
		let file: library.FileReference = event.target as library.FileReference;

		console.log(file.name, file.extension, file.size, file.modificationDate);
	}
}