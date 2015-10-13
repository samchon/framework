package org.samchon.framework.entity
{
	import flash.net.URLVariables;
	
	import org.samchon.framework.invoke.Invoke;

	public interface IEntity
	{
		function get key():String;
		function get TAG():String;
		function get LISTENER():String;
		
		function construct(xml:XML):void;
		function load():void;
		function archive():void;
		
		function toXML():XML;
		function toInvoke():Invoke;
		//function toHTML():String;
		//function toURLVariables():URLVariables;
	}
}