if (typeof (exports) != "undefined")
	try
	{
		global["std"] = require("typescript-stl");
	}
	catch (e) 
	{
		// NOT CALLED BY NODE.JS BUT REQUIRE.JS IN WEB ENVIRONMENT. 
	}