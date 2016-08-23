#XML
Tree-structured XML parser and generator. It's the most concise and eledic XML library.

## References
#### API Documents
  - [XML](http://samchon.github.io/framework/api/ts/classes/samchon.library.xml.html)
  - [XMLList](http://samchon.github.io/framework/api/ts/classes/samchon.library.xmllist.html)

#### Conception, Header of XML objects
``` typescript
class XML extends std.HashMap<string, XMLList>
{
	protected tag: string;
	protected value: string;
	protected properties: std.HashMap<string, string>;
}

class XMLList extends std.Deque<XML>;
```

#### Class Diagram
![Library - Utils](http://samchon.github.io/framework/images/design/ts_class_diagram/library_utils.png)

XML and XMLList are on right side.

## Conception
#### Element
XML object, it has three elements; tag, property and value.

```xml
<!-- TAG AND VALUE -->
<tag>value</tag>

<!-- TAG AND PROPERTY -->
<tag property_name="property_value" />

<!-- TAG, PROPERTY AND VALUE -->
<tag property_name="property_value">value</tag>
```

###### Tag

###### Property

###### Value

## XML and XMLList
```xml
<!-- THIS IS AN XML OBJECT -->

<!-- THEY ARE BELONGED TO AN XML_LIST

<!-- THE TOP XML OBJECT -->
<!-- XML_LIST NAMED GUILD
<!-- XML_LIST NAMED MEMBER
```

## Usage
#### Parsing XML
Parsing XML string is very simple. Just create XML object with the string to parse.

``` typescript
/// <reference path="typings/samchon-framework/samchon-framework.d.ts" />

import library = require("samchon-framework").library;

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

#### Accessing XML Elements
Remeber that, **XML** extended ```std.HashMap<string, XMLList>``` and **XMLList** extended ```std.Deque<XML>```.

You can use those methods in XML
  - [getTag() -> string](http://samchon.github.io/framework/api/ts/classes/samchon.library.xml.html#gettag)
  - [getValue() -> string](http://samchon.github.io/framework/api/ts/classes/samchon.library.xml.html#getvalue)
  - [hasProperty(string) -> boolean](http://samchon.github.io/framework/api/ts/classes/samchon.library.xml.html#hasproperty)
  - [getProperty(string) -> string](http://samchon.github.io/framework/api/ts/classes/samchon.library.xml.html#getproperty)

``` typescript
/// <reference path="typings/samchon-framework/samchon-framework.d.ts" />

import library = require("samchon-framework").library;

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

#### Generating XML structure.
You can use such member setter in XML.
  - [setTag(string)](http://samchon.github.io/framework/api/ts/classes/samchon.library.xml.html#settag)
  - [setValue(string)](http://samchon.github.io/framework/api/ts/classes/samchon.library.xml.html#setvalue)
  - [setProperty(string, string)](http://samchon.github.io/framework/api/ts/classes/samchon.library.xml.html#setproperty)

Now, we will generate a XML structure like below: 

###### document.xml
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
/// <reference path="typings/samchon-framework/samchon-framework.d.ts" />

import library = require("samchon-framework").library;

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
As you can see, generating XML structure by yourself is very tough and annoying work. You can generate and parse XML much easier with the Entity Module.

  - [Entity Module](TypeScript-Protocol-Standard_Message#entity)