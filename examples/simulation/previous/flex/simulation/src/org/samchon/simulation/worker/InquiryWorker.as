package org.samchon.simulation.worker
{
	import flash.display.BitmapData;
	import flash.net.FileReference;
	import flash.utils.ByteArray;
	
	import mx.graphics.codec.PNGEncoder;
	
	import org.samchon.simulation.movie.InquiryMovie;
	import org.samchon.simulation.simulation.retrieve.Corporate;
	import org.samchon.utils.HTML;

	public class InquiryWorker
	{
		//MOVIE POINTER
		protected var movie:InquiryMovie;
		
		//PROTECTED MEMBER VARIABLES
		protected var code:String = null;
		
		//CONSTRUCTOR
		public function InquiryWorker(movie:InquiryMovie) {
			this.movie	=	movie;
		}
		public function getMovie():InquiryMovie
		{
			return movie;
		}
		
		/* -----------------------------------------------------------
			PUBLIC METHOD CALLED BY WINDOW
		----------------------------------------------------------- */
		public function goCorporate(code:String = null, map:Object = null):void {}
		public function goCorporateDoubleClicked(code:String = null, map:Object = null):void {}
		
		/* -----------------------------------------------------------
			SAVE HANDLER
		----------------------------------------------------------- */
		public function goSave(extension:String):void {
			var fileName:String = getFileName();
			if(fileName == null)
				return;
			
			var file:FileReference = new FileReference();
			file.save(toHTML(), getFileName() + "." + extension);
		}
		public function getFileName():String {
			if(code == null)
				return null;
			else
				return "simulation_" + code;
		}
		protected function toHTML():String
		{
			return HTML.HEAD + "\n";
		}
	}
}