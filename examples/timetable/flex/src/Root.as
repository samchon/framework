package  
{
	import mx.collections.ArrayCollection;
	
	import org.samchon.hansung.Timetable;
	import org.samchon.hansung.base.MajorList;
	import org.samchon.hansung.base.SecondMajor;
	import org.samchon.hansung.base.Student;

	/**
	 * ...
	 * @author Jeongho Nam
	 */
	public class Root 
	{
		//APP-INFO
		public static const application:int = 2;
		public static const category:int = 1;
		
		public static var window:* = null;
		public static var isReady:Boolean = false;
		
		[Bindable]public static var majorList:MajorList = new MajorList();
		[Bindable]public static var secondMajorTypeList:ArrayCollection = 
			new ArrayCollection
			(
				[
					{ type:SecondMajor.PLURAL, label:"복수 전공" },
					{ type:SecondMajor.MINOR, label:"부 전공" }
				]
			);
		
		public static var timetable:Timetable;
		public static function get student():Student
		{
			return timetable.student;
		}
	}

}