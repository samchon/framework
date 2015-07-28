package org.samchon.hansung.window
{
	import mx.controls.HTML;
	
	import org.samchon.hansung.movie.TimetableMovie;
	
	import spark.components.Window;
	
	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class SyllabusWindow extends Window
	{
		public function SyllabusWindow(link:String)
		{
			super();
			
			var html:HTML = new HTML();
			html.percentWidth = 100;
			html.percentHeight = 100;
			html.location = "http://info.hansung.ac.kr/servlet/s_dae.letturerplanview?code=" + link;
			
			this.addElement(html);
		}
	}
}