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

    public class TextInputSkin extends Skin implements IStateClient2
    {
        private var _263438014promptDisplay:Label;
        private var _831827669textDisplay:RichEditableText;
        private var __moduleFactoryInitialized:Boolean = false;
        private var _213507019hostComponent:TextInput;

        public function TextInputSkin()
        {
            mx_internal::_document = this;
            this.mxmlContent = [this._TextInputSkin_Rect1_c(), this._TextInputSkin_Group1_c(), this._TextInputSkin_Group2_c(), this._TextInputSkin_RichEditableText1_i()];
            this.currentState = "normal";
            var _loc_1:* = new DeferredInstanceFromFunction(this._TextInputSkin_Label1_i);
            states = [new State({name:"normal", overrides:[]}), new State({name:"disabled", stateGroups:["disabledStates"], overrides:[new SetProperty().initializeFromObject({name:"alpha", value:0.5})]}), new State({name:"normalWithPrompt", overrides:[new AddItems().initializeFromObject({itemsFactory:_loc_1, destination:null, propertyName:"mxmlContent", position:"after", relativeTo:["textDisplay"]})]}), new State({name:"disabledWithPrompt", stateGroups:["disabledStates"], overrides:[new AddItems().initializeFromObject({itemsFactory:_loc_1, destination:null, propertyName:"mxmlContent", position:"after", relativeTo:["textDisplay"]}), new SetProperty().initializeFromObject({name:"alpha", value:0.5})]})];
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
                this.promptDisplay.setLayoutBoundsSize(param1 - 2, param2 - 2);
                this.promptDisplay.setLayoutBoundsPosition(1, 1);
            }
            super.updateDisplayList(param1, param2);
            return;
        }// end function

        private function _TextInputSkin_Rect1_c() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 0;
            _loc_1.right = 0;
            _loc_1.top = 0;
            _loc_1.bottom = 0;
            _loc_1.stroke = this._TextInputSkin_SolidColorStroke1_c();
            _loc_1.fill = this._TextInputSkin_SolidColor1_c();
            _loc_1.initialized(this, null);
            return _loc_1;
        }// end function

        private function _TextInputSkin_SolidColorStroke1_c() : SolidColorStroke
        {
            var _loc_1:* = new SolidColorStroke();
            _loc_1.color = 6052956;
            return _loc_1;
        }// end function

        private function _TextInputSkin_SolidColor1_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 16777215;
            return _loc_1;
        }// end function

        private function _TextInputSkin_Group1_c() : Group
        {
            var _loc_1:* = new Group();
            _loc_1.left = 1;
            _loc_1.right = 1;
            _loc_1.top = 1;
            _loc_1.mxmlContent = [this._TextInputSkin_Rect2_c(), this._TextInputSkin_Rect3_c()];
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            return _loc_1;
        }// end function

        private function _TextInputSkin_Rect2_c() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 0;
            _loc_1.right = 0;
            _loc_1.top = 0;
            _loc_1.height = 1;
            _loc_1.fill = this._TextInputSkin_SolidColor2_c();
            _loc_1.initialized(this, null);
            return _loc_1;
        }// end function

        private function _TextInputSkin_SolidColor2_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 0;
            _loc_1.alpha = 0.15;
            return _loc_1;
        }// end function

        private function _TextInputSkin_Rect3_c() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 0;
            _loc_1.right = 0;
            _loc_1.top = 1;
            _loc_1.height = 1;
            _loc_1.fill = this._TextInputSkin_SolidColor3_c();
            _loc_1.initialized(this, null);
            return _loc_1;
        }// end function

        private function _TextInputSkin_SolidColor3_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 0;
            _loc_1.alpha = 0.06;
            return _loc_1;
        }// end function

        private function _TextInputSkin_Group2_c() : Group
        {
            var _loc_1:* = new Group();
            _loc_1.left = 1;
            _loc_1.top = 1;
            _loc_1.bottom = 1;
            _loc_1.mxmlContent = [this._TextInputSkin_Rect4_c(), this._TextInputSkin_Rect5_c()];
            if (!_loc_1.document)
            {
                _loc_1.document = this;
            }
            return _loc_1;
        }// end function

        private function _TextInputSkin_Rect4_c() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 0;
            _loc_1.top = 0;
            _loc_1.bottom = 0;
            _loc_1.width = 1;
            _loc_1.fill = this._TextInputSkin_SolidColor4_c();
            _loc_1.initialized(this, null);
            return _loc_1;
        }// end function

        private function _TextInputSkin_SolidColor4_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 0;
            _loc_1.alpha = 0.15;
            return _loc_1;
        }// end function

        private function _TextInputSkin_Rect5_c() : Rect
        {
            var _loc_1:* = new Rect();
            _loc_1.left = 1;
            _loc_1.top = 0;
            _loc_1.bottom = 0;
            _loc_1.width = 1;
            _loc_1.fill = this._TextInputSkin_SolidColor5_c();
            _loc_1.initialized(this, null);
            return _loc_1;
        }// end function

        private function _TextInputSkin_SolidColor5_c() : SolidColor
        {
            var _loc_1:* = new SolidColor();
            _loc_1.color = 0;
            _loc_1.alpha = 0.06;
            return _loc_1;
        }// end function

        private function _TextInputSkin_RichEditableText1_i() : RichEditableText
        {
            var _loc_1:* = new RichEditableText();
            _loc_1.lineBreak = "explicit";
            _loc_1.widthInChars = 10;
            _loc_1.left = 1;
            _loc_1.right = 1;
            _loc_1.top = 1;
            _loc_1.bottom = 1;
            _loc_1.setStyle("verticalAlign", "middle");
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

        private function _TextInputSkin_Label1_i() : Label
        {
            var _loc_1:* = new Label();
            _loc_1.maxDisplayedLines = 1;
            _loc_1.mouseEnabled = false;
            _loc_1.mouseChildren = false;
            _loc_1.includeInLayout = false;
            _loc_1.setStyle("verticalAlign", "middle");
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

        public function get hostComponent() : TextInput
        {
            return this._213507019hostComponent;
        }// end function

        public function set hostComponent(param1:TextInput) : void
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
