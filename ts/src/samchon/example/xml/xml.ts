namespace samchon.example.xml
{
	export function main()
	{
		let textArea: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("textArea");
		let str: string = textArea.textContent;
		let xml: library.XML = new library.XML(str);

		trace(xml.toString());
		trace(new library.XML(xml.toString()).toString());
	}
}