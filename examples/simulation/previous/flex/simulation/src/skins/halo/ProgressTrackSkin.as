package skins.halo
{
    import flash.display.*;
    import mx.skins.*;
    import mx.styles.*;
    import mx.utils.*;

    public class ProgressTrackSkin extends Border
    {
        static const VERSION:String = "3.6.0.12937";

        public function ProgressTrackSkin()
        {
            return;
        }// end function

        override public function get measuredWidth() : Number
        {
            return 200;
        }// end function

        override public function get measuredHeight() : Number
        {
            return 6;
        }// end function

        override protected function updateDisplayList(param1:Number, param2:Number) : void
        {
            super.updateDisplayList(param1, param2);
            var _loc_3:* = getStyle("bevel");
            var _loc_4:* = getStyle("borderColor");
            var _loc_5:* = getStyle("trackColors");
            StyleManager.getColorNames(_loc_5);
            var _loc_6:* = ColorUtil.adjustBrightness2(_loc_4, -60);
            var _loc_7:* = graphics;
            _loc_7.clear();
            if (_loc_3)
            {
                drawRoundRect(0, 0, param1, param2, 0, _loc_6, 1);
                drawRoundRect(1, 1, (param1 - 1), (param2 - 1), 0, _loc_4, 1);
            }
            else
            {
                drawRoundRect(0, 0, param1, param2, 0, _loc_4, 1);
            }
            drawRoundRect(1, 1, param1 - 2, param2 - 2, 0, _loc_5, 1, verticalGradientMatrix(0, 0, param1 - 2, param2 - 2));
            return;
        }// end function

    }
}
