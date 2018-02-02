/// <reference path="../../API.ts" />

namespace samchon.library
{
	/**
	 * The {@link FileReference} class provides a means to load and save files in browser level.
	 * 
	 * The {@link FileReference} class provides a means to {@link load} and {@link save} files in browser level. A
	 * browser-system dialog box prompts the user to select a file to {@link load} or a location for {@link svae}. Each 
	 * {@link FileReference} object refers to a single file on the user's disk and has properties that contain 
	 * information about the file's size, type, name, creation date, modification date, and creator type (Macintosh only). 
	 * 
	 * {@link FileReference} instances are created in the following ways:
	 * <ul>
	 *	<li> 
	 *		When you use the new operator with the {@link FileReference} constructor: 
	 *		<code>let myFileReference: FileReference = new FileReference();</code>
	 *	</li>
	 *	<li> 
	 *		When you call the {@link FileReferenceList.browse} method, which creates an array of {@link FileReference} 
	 *		objects. 
	 *	</li>
	 * </ul>
	 * 
	 * During a load operation, all the properties of a {@link FileReference} object are populated by calls to the 
	 * {@link FileReference.browse} or {@link FileReferenceList.browse} methods. During a save operation, the name 
	 * property is populated when the select event is dispatched; all other properties are populated when the complete 
	 * event is dispatched.
	 * 
	 * The {@link browse browse()} method opens an browser-system dialog box that prompts the user to select a file 
	 * for {@link load}. The {@link FileReference.browse} method lets the user select a single file; the 
	 * {@link FileReferenceList.browse} method lets the user select multiple files. After a successful call to the 
	 * {@link browse browse()} method, call the {@link FileReference.load} method to load one file at a time. The 
	 * {@link FileReference.save} method prompts the user for a location to save the file and initiates downloading from 
	 * a binary or string data.
	 * 
	 * The {@link FileReference} and {@link FileReferenceList} classes do not let you set the default file location 
	 * for the dialog box that the {@link browse} or {@link save} methods generate. The default location shown in the 
	 * dialog box is the most recently browsed folder, if that location can be determined, or the desktop. The classes do 
	 * not allow you to read from or write to the transferred file. They do not allow the browser that initiated the 
	 * {@link load} or {@link save} to access the loaded or saved file or the file's location on the user's disk.
	 * 
	 * @references http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/FileReference.html
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class FileReference 
		extends EventDispatcher
	{
		/**
		 * @hidden
		 */
		private file_: File;

		/**
		 * @hidden
		 */
		private data_: any;

		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.file_ = null;
			this.data_ = null;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * The data from the loaded file after a successful call to the {@link load load()} method.
		 * 
		 * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
		 * an {@link LogicError exception} will be thrown when you try to get the value of this property.
		 *
		 * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
		 *
		 */
		public get data(): any
		{
			return this.data_;
		}

		/**
		 * The name of the file on the local disk.
		 * 
		 * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}), 
		 * an {@link LogicError exception} will be thrown when you try to get the value of this property.
		 * 
		 * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
		 *
		 */
		public get name(): string
		{
			let index: number = this.file_.name.lastIndexOf(".");

			if (index == -1)
				return this.file_.name;
			else
				return this.file_.name.substr(0, index);
		}

		/**
		 * The filename extension.
		 * 
		 * A file's extension is the part of the name following (and not including) the final dot (&quot;.&quot;). If 
		 * there is no dot in the filename, the extension is <code>null</code>.
		 *
		 * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
		 * an {@link LogicError exception} will be thrown when you try to get the value of this property.
		 *
		 * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
		 *
		 */
		public get extension(): string
		{
			let index: number = this.file_.name.lastIndexOf(".");

			if (index == -1)
				return null;
			else
				return this.file_.name.substr(index + 1);
		}

		/**
		 * The file type, metadata of the {@link extension}.
		 * 
		 * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
		 * an {@link LogicError exception} will be thrown when you try to get the value of this property.
		 *
		 * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
		 *
		 */
		public get type(): string
		{
			return this.file_.type;
		}

		/**
		 * The size of the file on the local disk in bytes.
		 * 
		 * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
		 * an {@link LogicError exception} will be thrown when you try to get the value of this property.
		 *
		 * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
		 *
		 */
		public get size(): number
		{
			return this.file_.size;
		}

		/**
		 * The date that the file on the local disk was last modified.
		 * 
		 * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
		 * an {@link LogicError exception} will be thrown when you try to get the value of this property.
		 *
		 * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
		 *
		 */
		public get modificationDate(): Date
		{
			return this.file_.lastModifiedDate;
		}

		/* =========================================================
			PROCEDURES
				- OPEN FILE
				- SAVE FILE
		============================================================
			OPEN FILE
		--------------------------------------------------------- */
		/**
		 * Displays a file-browsing dialog box that lets the user select a file to upload. The dialog box is native 
		 * to the user's browser system. The user can select a file on the local computer or from other systems, for 
		 * example, through a UNC path on Windows.
		 * 
		 * When you call this method and the user successfully selects a file, the properties of this 
		 * {@link FileReference} object are populated with the properties of that file. Each subsequent time that the 
		 * {@link FileReference.browse} method is called, the {@link FileReference} object's properties are reset to 
		 * the file that the user selects in the dialog box. Only one {@link browse browse()} can be performed at a time 
		 * (because only one dialog box can be invoked at a time).
		 * 
		 * Using the *typeFilter parameter*, you can determine which files the dialog box displays.
		 * 
		 * @param typeFilter An array of filter strings used to filter the files that are displayed in the dialog box.
		 *					 If you omit this parameter, all files are displayed.
		 */
		public browse(...typeFilter: string[]): void
		{
			let this_: FileReference = this;

			// CREATE A FILE SELECTOR
			let input: HTMLInputElement = document.createElement("input");
			input.type = "file";

			if (typeFilter.length > 0)
				input.accept = typeFilter.toString();

			// EVENT HANDLER
			input.onchange = function (): void
			{
				this_.file_ = input.files[0];
				this_.dispatchEvent(new library.BasicEvent("select"));
			};
			
			// APEND TO BODY TEMPORARILY
			input.onclick = function (event: any): void
			{
				document.body.removeChild(event.target as Node);
			};
			input.style.display = "none";
			document.body.appendChild(input);

			// CLICK DIRECTLY
			input.click();
		}

		/**
		 * Starts the load of a local file selected by a user.
		 * 
		 * You must call the {@link FileReference.browse} or {@link FileReferenceList.browse} method before you call 
		 * the {@link load load()} method.
		 * 
		 * Listeners receive events to indicate the progress, success, or failure of the load. Although you can use 
		 * the {@link FileReferenceList} object to let users select multiple files to load, you must {@link load} the 
		 * {@link FileReferenceList files} one by one. To {@link load} the files one by one, iterate through the 
		 * {@link FileReferenceList.fileList} array of {@link FileReference} objects.
		 *
		 * If the file finishes loading successfully, its contents are stored in the {@link data} property.
		 */
		public load(): void
		{
			let this_: FileReference = this;

			let reader: FileReader = new FileReader();
			reader.onload = function (): void
			{
				this_.data_ = reader.result;
				this_.dispatchEvent(new library.BasicEvent("complete"));
			}
			reader.readAsText(this.file_);
		}

		/* ---------------------------------------------------------
			SAVE FILE
		--------------------------------------------------------- */
		/**
		 * Save a file to local filesystem.
		 * 
		 * {@link FileReference.save} implemented the save function by downloading a file from a hidden anchor tag.
		 * However, the plan, future's {@link FileReference} will follow such rule:
		 * 
		 * Opens a dialog box that lets the user save a file to the local filesystem.
		 * 
		 * The {@link save save()} method first opens an browser-system dialog box that asks the user to enter a
		 * filename and select a location on the local computer to save the file. When the user selects a location and 
		 * confirms the save operation (for example, by clicking Save), the save process begins. Listeners receive events 
		 * to indicate the progress, success, or failure of the save operation. To ascertain the status of the dialog box 
		 * and the save operation after calling {@link save save()}, your code must listen for events such as cancel, 
		 * open, progress, and complete.
		 * 
		 * When the file is saved successfully, the properties of the {@link FileReference} object are populated with 
		 * the properties of the local file. The complete event is dispatched if the save is successful.
		 * 
		 * Only one {@link browse browse()} or {@link save()} session can be performed at a time (because only one 
		 * dialog box can be invoked at a time).
		 * 
		 * @param data The data to be saved. The data can be in one of several formats, and will be treated appropriately.
		 * @param fileName File name to be saved.
		 */
		public save(data: string, fileName: string): void
		{
			FileReference.save(data, fileName);
		}

		/**
		 * Save a file to local filesystem.
		 * 
		 * {@link FileReference.save} implemented the save function by downloading a file from a hidden anchor tag.
		 * However, the plan, future's {@link FileReference} will follow such rule:
		 * 
		 * Opens a dialog box that lets the user save a file to the local filesystem.
		 * 
		 * The {@link save save()} method first opens an browser-system dialog box that asks the user to enter a
		 * filename and select a location on the local computer to save the file. When the user selects a location and 
		 * confirms the save operation (for example, by clicking Save), the save process begins. Listeners receive events 
		 * to indicate the progress, success, or failure of the save operation. To ascertain the status of the dialog box 
		 * and the save operation after calling {@link save save()}, your code must listen for events such as cancel, 
		 * open, progress, and complete.
		 * 
		 * When the file is saved successfully, the properties of the {@link FileReference} object are populated with 
		 * the properties of the local file. The complete event is dispatched if the save is successful.
		 * 
		 * Only one {@link browse browse()} or {@link save()} session can be performed at a time (because only one 
		 * dialog box can be invoked at a time).
		 * 
		 * @param data The data to be saved. The data can be in one of several formats, and will be treated appropriately.
		 * @param fileName File name to be saved.
		 */
		public static save(data: string, fileName: string): void
		{
			let blob: Blob = new Blob([data], { type: "text/plain" });
			
			if (window.navigator.msSaveBlob != undefined)
			{
				// IE ONLY
				window.navigator.msSaveBlob(blob, fileName);
			}
			else
			{
				// CREATE AN ANCHOR
				let anchor: HTMLAnchorElement = document.createElement("a");
				(anchor as any).download = fileName;
				anchor.innerHTML = "";

				// LINK TO THE BLOB
				anchor.href = window.URL.createObjectURL(blob);

				// APEND TO BODY TEMPORARILY
				anchor.onclick = function (event: MouseEvent): void
				{
					// CLICKS AND REMOVES IT DIRECTLY
					document.body.removeChild(event.target as Node);
				};
				anchor.style.display = "none";
				document.body.appendChild(anchor);

				// CLICK DIRECTLY
				anchor.click();
			}
		}
	}

	/**
	 * The {@link FileReferenceList} class provides a means to let users select one or more files for 
	 * {@link FileReference.load loading}. A {@link FileReferenceList} object represents a group of one or more local 
	 * files on the user's disk as an array of {@link FileReference} objects. For detailed information and important 
	 * considerations about {@link FileReference} objects and the FileReference class, which you use with 
	 * {@link FileReferenceList}, see the {@link FileReference} class.
	 * 
	 * To work with the {@link FileReferenceList} class:
	 * <ul>
	 *	<li> Instantiate the class: <code>var myFileRef = new FileReferenceList();</code> </li>
	 *	<li>
	 *		Call the {@link FileReferenceList.browse} method, which opens a dialog box that lets the user select one or 
	 *		more files for upload: <code>myFileRef.browse();</code>
	 *	</li>
	 *	<li>
	 *		After the {@link browse browse()} method is called successfully, the {@link fileList} property of the 
	 *		{@link FileReferenceList} object is populated with an array of {@link FileReference} objects.
	 *	</li>
	 *	<li> Call {@link FileReference.load} on each element in the {@link fileList} array. </li>
	 * </ul>
	 * 
	 * The {@link FileReferenceList} class includes a {@link browse browse()} method and a {@link fileList} property 
	 * for working with multiple files.
	 * 
	 * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/FileReferenceList.html
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class FileReferenceList extends EventDispatcher
	{
		/**
		 * @hidden
		 */
		public file_list: std.Vector<FileReference>;

		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.file_list = new std.Vector<FileReference>();
		}

		/**
		 * An array of {@link FileReference} objects.
		 *
		 * When the {@link FileReferenceList.browse} method is called and the user has selected one or more files 
		 * from the dialog box that the {@link browse browse()} method opens, this property is populated with an array of
		 * {@link FileReference} objects, each of which represents the files the user selected.
		 *
		 * The {@link fileList} property is populated anew each time {@link browse browse()} is called on that
		 * {@link FileReferenceList} object.
		 */
		public get fileList(): std.Vector<FileReference>
		{
			return this.file_list;
		}

		/**
		 * Displays a file-browsing dialog box that lets the user select one or more local files to upload. The 
		 * dialog box is native to the user's browser system. 
		 *
		 * When you call this method and the user successfully selects files, the {@link fileList} property of this 
		 * {@link FileReferenceList} object is populated with an array of {@link FileReference} objects, one for each 
		 * file that the user selects. Each subsequent time that the {@link FileReferenceList.browse} method is called, 
		 * the {@link FileReferenceList.fileList} property is reset to the file(s) that the user selects in the dialog 
		 * box.
		 *
		 * Using the *typeFilter* parameter, you can determine which files the dialog box displays.
		 * 
		 * Only one {@link FileReference.browse}, {@link FileReference.load}, or {@link FileReferenceList.browse} 
		 * session can be performed at a time on a {@link FileReferenceList} object (because only one dialog box can be 
		 * opened at a time).
		 *
		 * @param typeFilter An array of filter strings used to filter the files that are displayed in the dialog box. 
		 *					 If you omit this parameter, all files are displayed.
		 */
		public browse(...typeFilter: string[]): void
		{
			let this_: FileReferenceList = this;

			// CREATE A FILE SELECTOR
			let input: HTMLInputElement = document.createElement("input");
			input.type = "file";

			if (typeFilter.length > 0)
				input.accept = typeFilter.toString();

			// EVENT HANDLER
			input.onchange = function (): void
			{
				let fileList: FileList = input.files;

				this_.file_list.clear();
				for (let i: number = 0; i < fileList.length; i++)
				{
					let reference: FileReference = new FileReference();
					reference["file_"] = fileList[i];

					this_.file_list.push(reference);
				}

				this_.dispatchEvent(new library.BasicEvent("select"));
			};

			// APEND TO BODY TEMPORARILY
			input.onclick = function (event: any): void
			{
				document.body.removeChild(event.target as Node);
			};
			input.style.display = "none";
			document.body.appendChild(input);

			// CLICK DIRECTLY
			input.click();
		}
	}
}