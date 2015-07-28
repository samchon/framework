package skins.wireframe
{
    import mx.binding.*;
    import mx.core.*;
    import mx.events.*;
    import mx.graphics.*;
    import mx.states.*;
    import spark.components.*;
    import spark.components.supportClasses.*;
    import spark.primitives.*;

    public class TextAreaSkin extends Skin implements IStateClient2
    {
        private var _263438014promptDisplay:Label;
        private var _402164678scroller:Scroller;
        private var _831827669textDisplay:RichEditableText;
        private var __moduleFactoryInitialized:Boolean = false;
        private var _213507019hostComponent:TextArea;

        public function TextAreaSkin()
        {
            mx_internal::_document = this;
            this.mxmlContent = [this._TextAreaSkin_Rect1_c(), this._TextAreaSkin_Rect2_c(), this._TextAreaSkin_Scroller1_i()];
            this.currentState = "normal";
            var _loc_1:* = new DeferredInstanceFromFunction(this._TextAreaSkin_Label1_i);
            states = [new State({name:"normal", overrides:[]}), new State({name:"disabled", stateGroups:["disabledStates"], overrides:[new SetProperty().initializeFromObject({name:"alpha", value:0.5})]}), new State({name:"normalWithPrompt", overrides:[new AddItems().initializeFromObject({itemsFactory:_loc_1, destination:null, propertyName:"mxmlContent", position:"after", relativeTo:["scroller"]})]}), new State({name:"disabledWithPrompt", stateGroups:["disabledStates"], overrides:[new AddItems().initializeFromObject({itemsFactory:_loc_1, destination:null, propertyName:"mxmlContent", position:"after", relativeTo:["scroller"]}), new SetProperty().initializeFromObject({name:"alpha", value:0.5})]})];
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

        override protected function updateDisplayList(param1:Number, param2:Number) : void
        {
            if (this.promptDisplay)
            {
                this.promptDisplay.setLayoutBoundsSize((param1 - 1), (param2 - 1));
                this.promptDisplay.setLayoutBoundsPosition(1, 1);
            }
            super.updateDisplayList(param1, param2);
            return;
        }// end function

        private function _TextAreaSkin_Rect1_c() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 0;
            _loc_1.right = 0;
            _loc_1.top = 0;
            _loc_1.bottom = 0;
            _loc_1.stroke = this._TextAreaSkin_SolidColorStroke1_c();
            _loc_1.fill = this._TextAreaSkin_SolidColor1_c();
            _loc_1.initialized(this, null);
            return _loc_1;
        }// end function

        private function _TextAreaSkin_SolidColorStroke1_c() : SolidColorStroke
        {
            var _loc_1:* = new SolidColorStroke();
            _loc_1.color = 6052956;
            _loc_1.weight = 1;
            return _loc_1;
        }// end function

        private function _TextAreaSkin_SolidColor1_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 16777215;
            return _loc_1;
        }// end function

        private function _TextAreaSkin_Rect2_c() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 1;
            _loc_1.top = 1;
            _loc_1.right = 1;
            _loc_1.height = 1;
            _loc_1.fill = this._TextAreaSkin_SolidColor2_c();
            _loc_1.initialized(this, null);
            return _loc_1;
        }// end function

        private function _TextAreaSkin_SolidColor2_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 0;
            _loc_1.alpha = 0.12;
            return _loc_1;
        }// end function

        private function _TextAreaSkin_Scroller1_i() : Scroller
        {
            var _loc_1:* = new Scroller();
            _loc_1.left = 0;
            _loc_1.top = 0;
            _loc_1.right = 0;
            _loc_1.bottom = 0;
            _loc_1.minViewportInset = 1;
            _loc_1.measuredSizeIncludesScrollBars = false;
            _loc_1.viewport = this._TextAreaSkin_RichEditableText1_i();
            _loc_1.id = "scroller";
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            this.scroller = _loc_1;
            BindingManager.executeBindings(this, "scroller", this.scroller);
            return _loc_1;
        }// end function

        private function _TextAreaSkin_RichEditableText1_i() : RichEditableText
        {
            var _loc_1:* = new RichEditableText();
            _loc_1.heightInLines = 10;
            _loc_1.widthInChars = 15;
            _loc_1.setStyle("paddingLeft", 3);
            _loc_1.setStyle("paddingTop", 5);
            _loc_1.setStyle("paddingRight", 3);
            _loc_1.setStyle("paddingBottom", 3);
            _loc_1.id = "textDisplay";
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            this.textDisplay = _loc_1;
            BindingManager.executeBindings(this, "textDisplay", this.textDisplay);
            return _loc_1;
        }// end function

        private function _TextAreaSkin_Label1_i() : Label
        {
            var _loc_1:* = new Label();
            _loc_1.mouseEnabled = false;
            _loc_1.mouseChildren = false;
            _loc_1.includeInLayout = false;
            _loc_1.setStyle("paddingLeft", 3);
            _loc_1.setStyle("paddingTop", 5);
            _loc_1.setStyle("paddingRight", 3);
            _loc_1.setStyle("paddingBottom", 3);
            _loc_1.id = "promptDisplay";
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            this.promptDisplay = _loc_1;
            BindingManager.executeBindings(this, "promptDisplay", this.promptDisplay);
            return _loc_1;
        }// end function

        public function get promptDisplay() : Label
        {
            return this._263438014promptDisplay;
        }// end function

        public function set promptDisplay(param1:Label) : void
        {
            var _loc_2:* = this._263438014promptDisplay;
            if (_loc_2 !== param1)
            {
                this._263438014promptDisplay = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "promptDisplay", _loc_2, param1));
                }
            }
            return;
        }// end function

        public function get scroller() : Scroller
        {
            return this._402164678scroller;
        }// end function

        public function set scroller(param1:Scroller) : void
        {
            var _loc_2:* = this._402164678scroller;
            if (_loc_2 !== param1)
            {
                this._402164678scroller = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "scroller", _loc_2, param1));
                }
            }
            return;
        }// end function

        public function get textDisplay() : RichEditableText
        {
            return this._831827669textDisplay;
        }// end function

        public function set textDisplay(param1:RichEditableText) : void
        {
            var _loc_2:* = this._831827669textDisplay;
            if (_loc_2 !== param1)
            {
                this._831827669textDisplay = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "textDisplay", _loc_2, param1));
                }
            }
            return;
        }// end function

        public function get hostComponent() : TextArea
        {
            return this._213507019hostComponent;
        }// end function

        public function set hostComponent(param1:TextArea) : void
        {
            var _loc_2:* = this._213507019hostComponent;
            if (_loc_2 !== param1)
            {
                this._213507019hostComponent = param1;
                if (this.hasEventListener("propertyChange"))
                {
                    this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(this, "hostComponent", _loc_2, param1));
                }
            }
            return;
        }// end function

    }
}
