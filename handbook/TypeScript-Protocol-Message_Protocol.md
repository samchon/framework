# Message Protocol
## Invoke
#### References
###### API Documents
  - [Invoke](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.invoke.html)
  - [InvokeParameter](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.invokeparameter.html)

###### Class Diagram
![Protocol - Invoke](http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_invoke.png)

#### Forms
``` xml
<?xml encoding="utf-8" ?>
<invoke listener={FUNCTION_TO_CALL}>
	<parameter type={TYPE_OF_THE_VALUE}>{VALUE}</parameter>
	<parameter type={TYPE := string | number | ByteArray | XML}>{VALUE}</parameter>
</invoke>
```

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

``` xml
<?xml encoding="utf-8" ?>
<invoke listener="whisper">
	<parameter type="string">john</parameter>
	<parameter type="string">kevin</parameter>
	<parameter type="string">Hello Kevin, I'm John. Nice to meet you. </parameter>
</invoke>
```

#### Usage
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
#### References
###### API Documents
  - [Entity](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entity.html)
  - [IEntityGroup](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.ientitygroup.html)
    - [EntityArray](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entityarray.html)
    - [EntityList](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entitylist.html)
    - [EntityDeque](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entitydeque.html)
  - [IEntityCollection](http://samchon.github.io/framework/api/ts/interfaces/samchon.protocol.ientitycollection.html)
    - [EntityArrayCollection](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entityarraycollection.html)
    - [EntityListCollection](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entitylistcollection.html)
    - [EntityDequeCollection](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entitydequecollection.html)

###### Class Diagram
![Protocol - Ehtity](http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_entity.png)

#### Usage
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
