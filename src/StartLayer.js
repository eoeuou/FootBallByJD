/**
 * Created by JiaDing on 14-4-19.
 */
var StartLayer = cc.Layer.extend({

    init:function()
    {
        if(this._super())
        {



            return true;
        }
        return false;
    },

    onEnter:function()
    {
        this._super();
        var uiLayer = ccs.UILayer.create();
        this.addChild(uiLayer);

        var widget = ccs.GUIReader.getInstance().widgetFromJsonFile(s_exportJson_StartPanel);
        widget.setPositionX(widget.getPositionX() + 100);
        uiLayer.addWidget(widget);

        var titleAction = ccs.ActionManager.getInstance().getActionByName("StartPanel.ExportJson","Animation0");
        if(titleAction)
        {
            titleAction.play();
        }

        var startBtn = uiLayer.getWidgetByName("Button_25");
        startBtn.addTouchEventListener(function(object,touchType){

            if(touchType == cc.TOUCH_ENDED)
            {
                cc.AudioEngine.getInstance().playEffect(s_sound_btn,false);
                cc.NotificationCenter.getInstance().postNotification("changeToGameLayer");
            }

        }.bind(this) ,this);
    },


    onExit:function()
    {


        this._super();
    }





});

StartLayer.create = function()
{
    var obj = new StartLayer();
    if(obj && obj.init())
    {
        return obj;
    }
    return null;
}