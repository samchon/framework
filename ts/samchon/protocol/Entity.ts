namespace samchon.protocol
{
    /**
     * <p> An entity, a standard data class. </p>
     *
     * <p> Entity is a class for standardization of expression method using on network I/O by XML. If 
     * Invoke is a standard message protocol of Samchon Framework which must be kept, Entity is a 
     * recommended semi-protocol of message for expressing a data class. Following the semi-protocol
     * Entity is not imposed but encouraged. </p>
     *
     * <p> As we could get advantages from standardization of message for network I/O with Invoke, 
     * we can get additional advantage from standardizing expression method of data class with Entity. 
     * We do not need to know a part of network communication. Thus, with the Entity, we can only 
     * concentrate on entity's own logics and relationships between another entities. Entity does not
     * need to how network communications are being done. </p>
     *  
     * <p> I say repeatedly. Expression method of Entity is recommended, but not imposed. It's a semi
     * protocol for network I/O but not a essential protocol must be kept. The expression method of
     * Entity, using on network I/O, is expressed by XML string. </p>
     *
     * <p> If your own network system has a critical performance issue on communication data class, 
     * it would be better to using binary communication (with ByteArray).
     * Don't worry about the problem! Invoke also provides methods for binary data (ByteArray). </p>
     *
     * @author Jeongho Nam
     */
    export class Entity
        implements IEntity 
    {
        /**
         * <p> Default Constructor. </p>
         */
        constructor() 
        {
            //NOTHING
        }
        public construct(xml: library.XML): void 
        {
            // MEMBER VARIABLES; ATOMIC
            var propertyMap = xml.getPropertyMap();

            for (var v_it = propertyMap.begin(); v_it.equals(propertyMap.end()) != true; v_it = v_it.next())
                if (this.hasOwnProperty(v_it.first) == true && (typeof this[v_it.first] == "number" || typeof this[v_it.first] == "string"))
                    this[v_it.first] = v_it.second;

            // MEMBER ENTITIES
            for (var e_it = xml.begin(); e_it.equals(xml.end()) != true; e_it = e_it.next())
            {
                if (this.hasOwnProperty(e_it.first) == true 
                    && e_it.second.size() == 1 
                    && (this[e_it.first] instanceof Entity || this[e_it.first] instanceof EntityArray)
                    && this[e_it.first] != null)
                {
                    var entity: IEntity = this[e_it.first];
                    var e_xml: library.XML = e_it.second.at(0);

                    if (entity == null)
                        continue;
                
                    entity.construct(e_xml);
                }
            }
        }

        public TAG(): string { return ""; }
        public key(): any { return ""; }

        public toXML(): library.XML
        {
            var xml: library.XML = new library.XML();
            xml.setTag(this.TAG());

            // MEMBERS
            for (var key in this) 
                if (typeof key == "string" && // NOT STRING, THEN IT MEANS CHILDREN (INT, INDEX)
                    (typeof this[key] == "string" || typeof this[key] == "number") )
                {
                    xml.setProperty(key, this[key]);
                }

            return xml;
        }
    }
}