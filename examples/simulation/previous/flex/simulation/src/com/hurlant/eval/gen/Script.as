package com.hurlant.eval.gen
{
	import com.hurlant.eval.abc.ABCScriptInfo;
	
	public class Script
	{
		public var e, init, traits=[];
		
		function Script(e:ABCEmitter) {
			this.e = e;
			this.init = new Method(e,[], 0, "" as Object, true as Object);
		}
		
		public function newClass(name, basename) {
			return new com.hurlant.eval.gen.Class(this, name, basename);
		}
		
		/* All functions are in some sense global because the
		methodinfo and methodbody are both global. */
		public function newFunction(formals,initScopeDepth) {
			return new Method(e, formals, initScopeDepth, null, true);
		}
		
		public function addException(e) {
			return init.addException(e);
		}
		// Here we probably want: newVar, newConst, ... instead?
		public function addTrait(t) {
			return traits.push(t);
		}
		
		public function finalize() {
			var id = init.finalize();
			var si = new ABCScriptInfo(id);
			for ( var i=0 ; i < traits.length ; i++ )
				si.addTrait(traits[i]);
			e.file.addScript(si);
		}
	}
}