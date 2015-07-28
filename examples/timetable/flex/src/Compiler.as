package
{
	public class Compiler
	{
		//INTERACTION WITH COMPILER
		protected static var compileCompletedHandler:Function = null;
		public static const LOCAL_FLAG:Boolean = true;
		
		protected static var compiled:Object;
		
		public static function addCompilerListener(listener:Function):void
		{
			compileCompletedHandler = listener;
		}
		public static function handleCompileCompleted(compiled:Object):void
		{
			Compiler.compiled = compiled;
			compileCompletedHandler.apply(null, [compiled]);
		}
		public static function getCompiled():Object
		{
			return Compiler.compiled;
		}
	}
}