namespace samchon.example.xml
{
	export function main()
	{
		let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("textArea");
		var str: string = textArea.textContent;
		var xml: library.XML = new library.XML(str);

		trace(xml.toString());
		trace(new library.XML(xml.toString()).toString());
	}
}