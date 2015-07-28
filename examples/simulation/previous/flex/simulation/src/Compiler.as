package
{
	import com.hurlant.eval.ByteLoader;
	import com.hurlant.eval.Evaluator;
	
	import flash.utils.ByteArray;
	
	import mx.controls.Alert;

	public class Compiler
	{
		//INTERACTION WITH COMPILER
		protected static var compileCompletedHandler:Function = null;
		public static const LOCAL_FLAG:Boolean = false;	//false : web, true : air
		
		protected static var compiled:Object;
		
		public static function addCompilerListener(listener:Function):void
		{
			compileCompletedHandler = listener;
		}
		public static function goCompile(script:String):Boolean
		{
			script = 
				"const NULL:int = Global.NULL;\n" +
				"\n" +
				"//DISPATCH EVENT\n" +
				"Compiler.handleCompileCompleted(this);\n" +
				"\n" + 
				script;
			
			var evaluator:Evaluator = new Evaluator();
			var bytes:ByteArray;
			
			//COMPILE
			try
			{
				bytes = evaluator.eval( script );
			}
			catch(error:Error)
			{
				Alert.show(error.message, error.errorID + ": " + error.name);
				return false;
			}
			
			//EXECUTE
			try
			{
				ByteLoader.loadBytes(bytes, LOCAL_FLAG);
			}
			catch(error:Error)
			{
				Alert.show(error.message, error.errorID + ": " + error.name);
				return false;
			}
			return true;
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