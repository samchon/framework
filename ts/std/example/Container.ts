namespace std.example
{
    export class Container
    {
        public constructor()
        {
            // CONSTRUCT LIST WITH ELEMENTS 0 TO 9
            var list: List<number> = new List<number>();
            for (var i: number = 0; i < list.size(); i++)
                list.pushBack(i);

            // RANDOM ELEMENTS I/O
            list.erase(list.begin().advance(7));
            list.erase(list.begin().advance(3));
            
            // PRINTS
            for (var it = list.begin(); it.equals(list.end()) == false; it = it.next())
                document.write(it.value + "<br>");
        }

        public static main(): void
        {
            new Container();
        }
    }
}