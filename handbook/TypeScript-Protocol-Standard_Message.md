# Message Protocol
## References
#### API Documents
###### Invoke
  - [Invoke](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.invoke.html)
  - [InvokeParameter](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.invokeparameter.html)

###### Entity
  - [IEntityGroup](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.ientitygroup.html)
    - [EntityArray](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entityarray.html)
    - [EntityDeque](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entitydeque.html)
    - [EntityList](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entitylist.html)
  - [IEntityCollection](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.ientitycollection.html)
    - [EntityArrayCollection](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entityarraycollection.html)
    - [EntityDequeCollection](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entitydequecollection.html)
    - [EntityListCollection](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entitylistcollection.html)

#### Class Diagram
![Protocol - Invoke](http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_message_protocol.png)

## Invoke
Invoke is designed to standardize message structure used in network communication. By the standardization of message protocol, user does not need to consider about the network handling. Only concentrate on system's own domain functions are required.

The Invoke message, xml string forms such below:
``` xml
<?xml encoding="utf-8" ?>
<invoke listener="whisper">
	<parameter type="string">john</parameter>
	<parameter type="string">kevin</parameter>
	<parameter type="string">Hello Kevin, I'm John. Nice to meet you. </parameter>
</invoke>
```

You can create the XML message via Invoke class.
``` typescript
/// <reference path="typings/samchon-framework/samchon-framework.d.ts" />

import samchon = require("samchon-framework");
import protocol = samchon.protocol;

let invoke = new protocol.Invoke
	(
		"whisper", // listener
		"john", // 1st parameter
		"kevin",  // 2nd parameter
		"Hello Kevin, I'm John. Nice to meet you" // 3rd parameter
	);
```

The Invoke object can be delivered to a member function with Invoke.apply() method.
``` typescript
/// <reference path="typings/samchon-framework/samchon-framework.d.ts" />
import protocol = require("samchon-framework").protocol;

let my_class = new MyClass();
let invoke = new protocol.Invoke
	(
		"whisper", // listener
		"john", // 1st parameter
		"kevin",  // 2nd parameter
		"Hello Kevin, I'm John. Nice to meet you" // 3rd parameter
	);
invoke.apply(my_class);

class MyClass
{
	private whisper(from: string, to: string, message: string): void
	{
		console.log(from + " -> " + to + ": " + message);
	}
}
```

## Entity
Entity module is for **automatic** cross-conversion between *Data Class* and *XML*.

The Entity module is designed for standardize expression method of data structure. However, using the XML string for representing data class via Entity module is not essential. Entity module is not a basic rule has to be kept like the [Invoke message](#invoke). It's just only being recommended method for data expression.

You can use JSON or Binary instead of this Entity module for data expression.

#### Usage - Entity
Entity is a class that can be represented by an XML object and properties in that XML object.

There're three methods to override in Entity.
  - [construct](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.ientity.html#construct)
    - Construct parse XML object and construct data in the data class.
    - Atomic values are parsed automatically.
    - Override only when supplementary data exist (e.g. objects and properties).
  - [toXML](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.ientity.html#toxml)
    - Convert data in this class to XML object.
    - Atomic values are converted automatically.
    - Overrides only when supplementary data exist (e.g. objects and properties).
  - [TAG](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.ientity.html#tag)
    - Returns tag name of XML object.
    - This method must be overriden and specified.

``` typescript
class Member
{
	////////
	// THOSE MEMBERS ARE ATOMICS
	////////
	private id: string;
	private name: string;
	private age: number;
	
	public TAG(): string
	{
		return "member";
	}
}
```

##### Automic conversion, atomic values only
Ehtity module's automatic conversion is restricted in level of atomic value. Unlike JSON conversion method in JavaScript supports not only atomic values but also belonged objects and arrays, Entity module doesn't convert them automatically. 

Only atomic values are automatic. Below are types of atomic values.
  - boolean
  - number
  - string

``` typescript
class Wrap extends protocol.Entity
{
	////////
	// OBJECTS, THEY'RE NOT AUTOMATIC
	// IN CONVERSION METHOD, YOU'VE TO SPECIFY THEM MANUALLY
	////////
	private wrapper: Wrapper;
	private instance: Instance;

	////////
	// ATOMIC VALUES, THEY'RE AUTOMATIC
	////////
	private x: number;
	private y: number;
	private z: number;
	private orientation: number;
	
	public TAG(): string
	{
		return "wrapper";
	}
}
```

When converting the ```class Wrap``` to an XML string via ```Entity.toXML()```, then the XML string will form such below. The XML string doesn't express ```Wrap.wrapper``` and ```Wrap.instance```.
``` xml
<wrap x="3" y="14" z="108" orientation="6" />
```

The reason why do not convert objects and arrays automatically is the **cross reference** (another name, **circular dependency**). If two entities are referencing each other, and the automatic conversion includes the object level, then the conversion must occure stack overflow by endless referencing and converting.

```typescript
class Wrapper 
	extends protocol.EntityDeque<Wrap> // Wrapper contains Wrap objects
	implements Instance // Wrapper implements Instance, thus can be referenced from Wrap.instance
{
}
```

```class Wrapper``` contains ```Wrap``` objects. ```class Wrap``` references the ```Wrapper``` instance via two members, ```Wrap.wrapper``` and ```Wrap.instance``` (Wrapper implemented Instance, so the ```Wrap.instance``` can reference the Wrapper object). Imagine that what will be happened when automatic conversion of Entity module includes objects.

#### Usage - IEntityGroup
When a data-set has *"Hierarchical Relationship"*, then use one of them derived from the IEntityGroup.

Compose the data class (entity) having children by inheriting IEntityGroup or IEntityCollection. When terminate node (leaf node) has come, implement the terminal node by inheriting Entity. Overrides createChild() and CHILD_TAG() method.
  - createChild(xml: library.XML)
    - Factory method creating child object.
    - The parameter xml is used for specifying children type.
      - Don't construct child data by provided parameter xml. It's only for specifying detailed type.
  - CHILD_TAG()
    - Children entities' tag name.

Below code represents folder and file instances, tree-structured, a case of the *"Hierarchical Relationship"*. Folder can contains children elements and the Folder also can be contained by anotehr Folder. So make the Folder to extends IEntityGroup. The File, it extends Entity class because it's a terminal node.

``` typescript
interface Instance extends protocol.IEntity
{
	TYPE(): string;
}

class File extends protocol.Entity implements Instance
{
	private parent: Folder;
	private name: string;
	private extension: string;
	
	public constructor(parent: Folder)
	{
		super();
		this.parent = parent;
	}
	
	public TYPE(): string { return "file"; }
	public TAG(): string { return "instance"; }
	
	public toXML(): library.XML
	{
		let xml: library.XML = super.toXML();
		xml.setProperty("type", this.TYPE());
		
		return xml;
	}
}

class Folder extends protocol.EntityArray<Instance>
{
	private parent: Folder;
	private name: string;

	public constructor(parent: Folder)
	{
		super();
		this.parent = parent;
	}

	public createChild(xml: library.XML): Instance
	{
		if (xml.getProperty("type") == "folder")
			return new Folder(this);
		else
			return new File(this);
	}
	
	public TYPE(): string { return "file"; }
	public TAG(): string { return "instance"; }
	
	public toXML(): library.XML
	{
		let xml: library.XML = super.toXML();
		xml.setProperty("type", this.TYPE());
		
		return xml;
	}
}
```

#### Example - Shape
``` typescript
interface IShape extends protocol.IEntity 
{
    TYPE(): string;
}

class ShapeList extends protocol.EntityArray<IShape>
{
    public createChild(xml: library.XML): IShape
    {
        let type: string = xml.getProperty("type");
        
        if (type == "circle")
            return new Circle();
        else if (type == "polyline")
            return new Polyline();
        else if (type == "polygon")
            return new Polygon();
        else
            return null;
    }
    
    public TAG(): string
    {
        return "shapeList";
    }
    public CHILD_TAG(): string
    {
        return "shape";
    }
}

class Point extends protocol.Entity
{
    private x: number;
    private y: number;
    
    public constructor();
    public constructor(x: number, y: number);
    
    public constructor(x: number = 0, y: number = 0)
    {
        super();
    
        // MEMBER VARIABLES MUST BE INITIALIZED
        this.x = x;
        this.y = y;
    }
    
    public TAG(): string
    {
        // IT'S ALL. 
        // YOU DON'T NEED TO SPECIFY PARSING OR GENERATING COMMAND FOR ATOMIC-VARIABLES.
        return "point";
    }
}

class Circle extends protocol.Entity implements IShape
{
    private radius: number;
    private center: Point;
    
    public constructor();
    public constructor(radius: number, center: Point);
    
    public constructor(radius: number = 0, center: Point = new Point(0, 0))
    {
        super();
        
        this.radius = radius;
        this.center = center;
    }
    
    public construct(xml: library.XML): void
    {
        // ATOMIC VARIABLE raidus IS CONSTRUCTED AUTOMATICALLY
        super.construct(xml);
        
        // BUT CHILD ENTITY OBJECT IS NOT. IT MUST BE SPECIFIED
        this.center.construct( xml.get(this.center.TAG()).at(0) );
    }
    
    public toXML(): library.XML
    {
        // ATOMIC VARIABLE raidus IS CONVERTED AUTOMATICCALLY
        let xml: library.XML = super.toXML();
        
        // SPECIFY THE TYPE "CIRCLE"
        xml.setProperty("type", this.TYPE());
        
        // BUT CHILD ENTITY OBJECT IS NOT. IT MUST BE SPECIFIED
        xml.push(this.center.toXML());
        
        return xml;
    }
}

class Polyline extends protocol.EntityArray<Point> implements IShape
{
    public createChild(xml: library.XML): Point
    {
        return new Point();
    }

    public TAG(): string
    {
        return "shape";
    }
    public CHILD_TAG(): string
    {
        return "point";
    }
    
    public TYPE(): string
    {
        return "polyline";
    }
    
    public toXML(): library.XML
    {
        let xml: library.XML = super.toXML();
        xml.setProperty("type", this.TYPE());
        
        return xml;
    }
}

class InnerPolylines extends protocol.EntityArray<Polyline>
{
    public createChild(xml: library.XML): Polyline
    {
        return new PolyLine();
    }
    
    public TAG(): string
    {
        return "inner";
    }
    public CHILD_TAG(): string
    {
        return "shape";
    }
}

class Polygon extends protocol.Entity implements IShape
{
    private outer: PolyLine;
    private inner: InnerPolyLines;

    public constructor();
    public constructor(outer: Polyline, inner: InnerPolylines);
    
    public constructor(outer: Polyline = new Polyline(), inner: InnerPolylines = new InnerPolylines())
    {
        super();
    
        // MUST BE INITAILIZED
        this.outer = outer;
        this.inner = inner;
    }

    public construct(xml: library.XML): void
    {
        this.outer.construct(xml.get("outer").at(0));
        
        // IF TAG "inner" DOESN'T EXIST, CLEAR ORDINARY
        if (xml.has("inner"))
            this.inner.construct(xml.get("inner").at(0));
        else
            this.inner.clear();
    }

    public TAG(): string
    {
        return "shape";
    }
    public TYPE(): string
    {
        return "polyline";
    }
    
    public toXML(): library.XML
    {
        let xml: library.XML = super.toXML();
        xml.setProperty("type", this.TYPE());
        
        // CHANGE OUTER'S TAG; "shape" -> "outer"
        let outer_xml: library.XML = this.outer.toXML();
        outer_xml.setTag("outer");
        
        xml.push(outer_xml);
        
        // PUSH INNER IF NOT EMPTY
        if (this.inner.empty() == false)
            xml.push(this.inner.toXML());
        
        return xml;
    }
}
```
