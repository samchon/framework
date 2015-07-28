package skins.wireframe
{
    import mx.binding.*;
    import mx.core.*;
    import mx.events.*;
    import mx.graphics.*;
    import mx.states.*;
    import spark.components.*;
    import spark.primitives.*;
    import spark.skins.*;

    public class ButtonSkin extends SparkButtonSkin implements IStateClient2
    {
        public var _ButtonSkin_Rect1:Rect;
        public var _ButtonSkin_Rect2:Rect;
        public var _ButtonSkin_Rect3:Rect;
        private var _747523688_ButtonSkin_SolidColor1:SolidColor;
        private var _2136706608_ButtonSkin_SolidColorStroke1:SolidColorStroke;
        private var __moduleFactoryInitialized:Boolean = false;

        public function ButtonSkin()
        {
            mx_internal::_document = this;
            this.minWidth = 22;
            this.minHeight = 22;
            this.mxmlContent = [this._ButtonSkin_Rect1_i(), this._ButtonSkin_Label1_i()];
            this.currentState = "up";
            var _loc_1:* = new DeferredInstanceFromFunction(this._ButtonSkin_Rect2_i);
            var _loc_2:* = new DeferredInstanceFromFunction(this._ButtonSkin_Rect3_i);
            states = [new State({name:"up", overrides:[new SetProperty().initializeFromObject({target:"_ButtonSkin_SolidColor1", name:"color", value:15658734})]}), new State({name:"over", overrides:[new SetProperty().initializeFromObject({target:"_ButtonSkin_SolidColorStroke1", name:"color", value:10263708}), new SetProperty().initializeFromObject({target:"_ButtonSkin_SolidColor1", name:"color", value:14540253})]}), new State({name:"down", overrides:[new AddItems().initializeFromObject({itemsFactory:_loc_2, destination:null, propertyName:"mxmlContent", position:"after", relativeTo:["_ButtonSkin_Rect1"]}), new AddItems().initializeFromObject({itemsFactory:_loc_1, destination:null, propertyName:"mxmlContent", position:"after", relativeTo:["_ButtonSkin_Rect1"]}), new SetProperty().initializeFromObject({target:"_ButtonSkin_SolidColorStroke1", name:"color", value:10263708}), new SetProperty().initializeFromObject({target:"_ButtonSkin_SolidColor1", name:"color", value:14540253}), new SetProperty().initializeFromObject({target:"labelDisplay", name:"verticalCenter", value:2})]}), new State({name:"disabled", overrides:[new SetProperty().initializeFromObject({name:"alpha", value:0.5})]})];
            return;
        }// end function

        override public function set moduleFactory(param1:IFlexModuleFactory) : void
        {
            super.moduleFactory = param1;
            if (this.__moduleFactoryInitialized)
            {
                return;
            }
            this.__moduleFactoryInitialized = true;
            return;
        }// end function

        override public function initialize() : void
        {
            super.initialize();
            return;
        }// end function

        private function _ButtonSkin_Rect1_i() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 0;
            _loc_1.right = 0;
            _loc_1.top = 0;
            _loc_1.bottom = 0;
            _loc_1.width = 69;
            _loc_1.height = 20;
            _loc_1.radiusX = 2;
            _loc_1.radiusY = 2;
            _loc_1.stroke = this._ButtonSkin_SolidColorStroke1_i();
            _loc_1.fill = this._ButtonSkin_SolidColor1_i();
            _loc_1.initialized(this, "_ButtonSkin_Rect1");
            this._ButtonSkin_Rect1 = _loc_1;
            BindingManager.executeBindings(this, "_ButtonSkin_Rect1", this._ButtonSkin_Rect1);
            return _loc_1;
        }// end function

        private function _ButtonSkin_SolidColorStroke1_i() : SolidColorStroke
        {
            var _loc_1:* = new SolidColorStroke();
            _loc_1.color = 11119017;
            this._ButtonSkin_SolidColorStroke1 = _loc_1;
            BindingManager.executeBindings(this, "_ButtonSkin_SolidColorStroke1", this._ButtonSkin_SolidColorStroke1);
            return _loc_1;
        }// end function

        private function _ButtonSkin_SolidColor1_i() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 12237498;
            this._ButtonSkin_SolidColor1 = _loc_1;
            BindingManager.executeBindings(this, "_ButtonSkin_SolidColor1", this._ButtonSkin_SolidColor1);
            return _loc_1;
        }// end function

        private function _ButtonSkin_Rect2_i() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 0;
            _loc_1.right = 0;
            _loc_1.y = 0;
            _loc_1.height = 4;
            _loc_1.radiusX = 2;
            _loc_1.fill = this._ButtonSkin_LinearGradient1_c();
            _loc_1.initialized(this, "_ButtonSkin_Rect2");
            this._ButtonSkin_Rect2 = _loc_1;
            BindingManager.executeBindings(this, "_ButtonSkin_Rect2", this._ButtonSkin_Rect2);
            return _loc_1;
        }// end function

        private function _ButtonSkin_LinearGradient1_c() : LinearGradient
        {
            var _loc_1:* = new LinearGradient();
            _loc_1.rotation = 90;
            _loc_1.entries = [this._ButtonSkin_GradientEntry1_c(), this._ButtonSkin_GradientEntry2_c(), this._ButtonSkin_GradientEntry3_c(), this._ButtonSkin_GradientEntry4_c()];
            return _loc_1;
        }// end function

        private function _ButtonSkin_GradientEntry1_c() : GradientEntry
        {
            var _loc_1:* = new GradientEntry();
            _loc_1.alpha = 0.23;
            _loc_1.color = 0;
            _loc_1.ratio = 0;
            return _loc_1;
        }// end function

        private function _ButtonSkin_GradientEntry2_c() : GradientEntry
        {
            var _loc_1:* = new GradientEntry();
            _loc_1.alpha = 0.2;
            _loc_1.color = 0;
            _loc_1.ratio = 0.4;
            return _loc_1;
        }// end function

        private function _ButtonSkin_GradientEntry3_c() : GradientEntry
        {
            var _loc_1:* = new GradientEntry();
            _loc_1.alpha = 0.055;
            _loc_1.color = 0;
            _loc_1.ratio = 0.55;
            return _loc_1;
        }// end function

        private function _ButtonSkin_GradientEntry4_c() : GradientEntry
        {
            var _loc_1:* = new GradientEntry();
            _loc_1.alpha = 0;
            _loc_1.color = 0;
            _loc_1.ratio = 0.8;
            return _loc_1;
        }// end function

        private function _ButtonSkin_Rect3_i() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.x = 0;
            _loc_1.width = 4;
            _loc_1.top = 0;
            _loc_1.bottom = 0;
            _loc_1.radiusX = 2;
            _loc_1.fill = this._ButtonSkin_LinearGradient2_c();
            _loc_1.initialized(this, "_ButtonSkin_Rect3");
            this._ButtonSkin_Rect3 = _loc_1;
            BindingManager.executeBindings(this, "_ButtonSkin_Rect3", this._ButtonSkin_Rect3);
            return _loc_1;
        }// end function

        private function _ButtonSkin_LinearGradient2_c() : LinearGradient
        {
            var _loc_1:* = new LinearGradient();
            _loc_1.rotation = 0;
            _loc_1.entries = [this._ButtonSkin_GradientEntry5_c(), this._ButtonSkin_GradientEntry6_c(), this._ButtonSkin_GradientEntry7_c()];
            return _loc_1;
        }// end function

        private function _ButtonSkin_GradientEntry5_c() : GradientEntry
        {
            var _loc_1:* = new GradientEntry();
            _loc_1.alpha = 0.13;
            _loc_1.color = 0;
            _loc_1.ratio = 0;
            return _loc_1;
        }// end function

        private function _ButtonSkin_GradientEntry6_c() : GradientEntry
        {
            var _loc_1:* = new GradientEntry();
            _loc_1.alpha = 0.12;
            _loc_1.color = 0;
            _loc_1.ratio = 0.2;
            return _loc_1;
        }// end function

        private function _ButtonSkin_GradientEntry7_c() : GradientEntry
        {
            var _loc_1:* = new GradientEntry();
            _loc_1.alpha = 0;
            _loc_1.color = 0;
            _loc_1.ratio = 0.55;
            return _loc_1;
        }// end function

        private function _ButtonSkin_Label1_i() : Label
        {
            var _loc_1:* = new Label();
            _loc_1.horizontalCenter = 0;
            _loc_1.verticalCenter = 1;
            _loc_1.left = 10;
            _loc_1.right = 10;
            _loc_1.top = 2;
            _loc_1.bottom = 2;
            _loc_1.maxDisplayedLines = 1;
            _loc_1.setStyle("textAlign", "center");
            _loc_1.setStyle("verticalAlign", "middle");
            _loc_1.id = "labelDisplay";
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            labelDisplay = _loc_1;
            BindingManager.executeBindings(this, "labelDisplay", labelDisplay);
            return _loc_1;
        }// end function

        public function get _ButtonSkin_SolidColor1() : SolidColor
        {
            return this._747523688_ButtonSkin_SolidColor1;
        }// end function

        public function set _ButtonSkin_SolidColor1(param1:SolidColor) : void
        {
            var _loc_2:* = this._747523688_ButtonSkin_SolidColor1;
            if (_loc_2 !== param1)
            {
                this._747523688_ButtonSkin_SolidColor1 = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "_ButtonSkin_SolidColor1", _loc_2, param1));
                }
            }
            return;
        }// end function

        public function get _ButtonSkin_SolidColorStroke1() : SolidColorStroke
        {
            return this._2136706608_ButtonSkin_SolidColorStroke1;
        }// end function

        public function set _ButtonSkin_SolidColorStroke1(param1:SolidColorStroke) : void
        {
            var _loc_2:* = this._2136706608_ButtonSkin_SolidColorStroke1;
            if (_loc_2 !== param1)
            {
                this._2136706608_ButtonSkin_SolidColorStroke1 = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "_ButtonSkin_SolidColorStroke1", _loc_2, param1));
                }
            }
            return;
        }// end function

    }
}
