# XML
Tree-structured XML parser and generator. It's the most concise and eledic XML lilbrary.

----------
## References
  - XML: http://samchon.github.io/framework/api/ts/classes/samchon.library.xml.html
  - XMLList: http://samchon.github.io/framework/api/ts/classes/samchon.library.xmllist.html


## Usage
##### Conception
``` typescript
class XML extends std.HashMap<string, XMLList>;

class XMLList extends std.Vector<XML>;
```

##### Parsing XML.
``` typescript
function test_xml_parsing(): void
{
    let str: string = 
        "<invoke listener='setMemberList'>\n" +
        "    <parameter name='application' type='string'>simulation</parameter>\n" +
        "    <parameter name='sequence' type='number'>3</parameter>\n" +
        "    <parameter type='XML'>\n" +
        "        <memberList>\n" +
        "            <member id='samchon' name='Jeongho Nam' mail='samchon@samchon.org' />\n" +
        "            <member id='github' name='GitHub' mail='github@github.com' />\n" +
        "            <member id='old_man' name='Old Kim' mail='old_man@hanmail.net' />\n" +
        "            <member id='john' name='John Doe' mail='conman@gmail.com' />\n" +
        "            <member id='robot' name='Alphago' />\n" +
        "        </memberList>\n" +
        "    </parameter>\n" +
        "</invoke>";
    
    // CREATE A NEW XML WITH THE STRING
    let xml: library.XML = new library.XML(str);
}
```

##### Accessing XML elements.
``` typescript
function test_xml_accessing(xml: library.XML): void
{
    /////////////////////////////////////////
    // ACCESS TO THE TAG "parameter"
    /////////////////////////////////////////
    // TEST WHETHER THE XML HAS CHILDREN XML TAGS NAMED "parameter"
    console.log( xml.has("parameter") ); // true
    let xmlList: library.XMLList = xml.get("parameter");

    // GET VALUE OF THE FIRST PARAMETER
    console.log( xmlList.at(0).getValue() ); // "simulation"
    
    // GET VALUE OF THE SECOND PARAMETER
    // NOTE, ALL THE VALUE AND PROPERTIES IN XML ARE 'STRING' TYPE
    console.log( parseInt(xmlList.at(1).getValue()) ); // 3
    
    // GET PROPERTY 'name' IN 2ND PARAMETER
    console.log( xmlList.at(1).getProperty("name") ); // "sequence"
    
    // TEST WHETHER 3RD PARAMETER HAS PROPERTY NAME
    console.log( xmlList.at(2).hasProperty("name") ); // false
    
    /////////////////////////////////////////
    // ACCESS TO THE TAG "member" in "memberList"
    /////////////////////////////////////////
    // TEST WHETHER "memberList" AND "member" TAGS ARE
    console.log( xml.has("memberList") ); // true
    console.log( xml.has("memberList").at(0).has("member") ); // true
    
    // IT'S IMPORTANT. ALTHOUGH ONLY A TAG NAMED "memberList" EXISTS,
    // THE TAG ('XML') IS ALSO CAPSULED IN THE 'XMLList'
    let members: library.XMLList = xml.get("memberList").at(0).get("member");
    
    // ACCESSING TO THE [old_man]'s mail
    console.log( members.at(2).getProperty("mail") ); // "old_man@hanmail.net"
    console.log( xml.get("memberList").at(0).get("member").at(2).getProperty("mail") ); // FROM TOP LEVEL'S XML
    
     // NORMAL ITERATION
    for (let i: number = 0; i < members.size(); i++)
        if (xmlList.get(i).getProperty("id") == "old_man")
            console.log( members.at(i).getProperty("mail") );
    
    // ITERATION USING functions in <algorithm> of STL
    let it: std.VectorIterator<XML> = 
        std.find_if
        (
            members.begin(), members.end(),
            function (myXML: library.XML): boolean
            {
                return myXML.hasProperty("id") && myXML.getProperty("id") == "old_man";
            }
        );
    if (it.equal_to(members.end()) == false)
        console.log( it.value.getProperty("mail") ); // "old_man@hanmail.net"
}
```

##### Generating XML structure.
We will generate a XML structure like below: 

document.xml
``` xml
<document>
    <id>F204-3312-3A2D</id>
    <name>schedule</name>
    <shapeList>
        <shape type="circle" radius="5">
            <point x="4" y="5" />
        </shape>
        <shape type="polyline">
            <point x="10" y="12" />
            <point x="14" y="27" />
            <point x="19" y="24" />
        </shape>
        <shape type="polygon">
            <outer type="polyline">
                <point x="2" y="-14" />
                <point x="4" y="5" />
                <point x="-3" y="0" />
                <point x="9" y="6" />
                <point x="7" y="4" />
            </outer>
            <inner>
                <shape type="polyline">
                    <point x="1.2" y="1.5" />
                    <point x="1.5" y="1.7" />
                    <point x="1.1" y="0.9" />
                </shape>
                <shape type="polyline">
                    <point x="1.1" y="1.1" />
                    <point x="1.2" y="0.9" />
                    <point x="1.3" y="1.2" />
                </shape>
            </inner>
        </shape>
    </shapeList>
</document>
```

We can generate the XML structure by manually following step by step.
``` typescript
function test_xml_generation(): void
{
    ////////////
    // CONSTRUCT TOP LEVEL XML ELEMENT
    ////////////
    let xml: library.XML = new library.XML();
    xml.setTag("document");
    xml.insertValue("id", "F204-3312-3A2D");
    xml.insertValue("name", "schedule");
    
    // CREATE SHAPE_LIST TEMPORAILY
    let shapeList: library.XML = new library.XML();
    shapeList.setTag("shapeList");
    
    // INSERT SHAPE_LIST TO THE TOP LEVEL'S
    xml.push(shapeList);

    ////////////
    // CONSTRUCT SHAPE ELEMENTS
    ////////////
    // CONSTRUCT CIRCLE
    let circle: library.XML = new library.XML();
    circle.setTag("shape");
    circle.setProperty("type", "circle");
    circle.setProperty("raidus", 5);
    
    let circle_point: library.XML = new library.XML();
    circle_point.setTag("point");
    circle_point.setProperty("x", 4);
    circle_point.setProperty("y", 5);
    
    circle.push(circle_point); // INSERT TO CIRCLE
    shapeList.push(circle); // INSERT TO SHAPE_LIST

    // CONSTRUCT POLYLINE
    let polyline: library.XML = new library.XML();
    polyline.setTag("shape");
    polyline.setProperty("type", "polyline");
    
    let polyline_p1: library.XML; // ...
    let polyline_p2: library.XML; // ...
    let polyline_p3: library.XML; // ...
    
    polyline.push(polyline_p1, polyline_p2, polyline_p3); // INSERT POINTS INTO POLY_LINE
    shapeList.push(polyline); // INSERT POLYLINE INTO THE SHAPE_LIST

    /* REPEAT THOSE SCRIPTS TO POLYGON ...
    --------------------------------------------------------------------------
        AS YOU CAN SEE, TYPING ALL FEATURES IS VERY TIRESOME.
        YOU CAN OMIT MOST OF THOSE PROCESSES BY USING ENTITY MODULE.
        LOOK BELOW, I INTRODUCE THE ENTITY MODULE IN SAMCHON-FRAMEWORK.
    --------------------------------------------------------------------------
    */

    console.log(xml.toString()); // UPPER document.xml WILL BE PRINTED OUT
}
```

## Using Entity Module

You can utilize entity module in *protocol*, then it will be much easier.
  - Entity: http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entity.html
  - EntityArray: http://samchon.github.io/framework/api/ts/classes/samchon.protocol.entityarray.html

Just read and types following the codes, then you can understand how to utilize the *entity module*.

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