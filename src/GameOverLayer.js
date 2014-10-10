/**
 * Created by JiaDing on 14-4-20.
 */

var GameOverLayer = cc.Layer.extend({

    isWin:false,

    init:function(isWin)
    {
        if(this._super())
        {
            this.isWin = isWin;

            return true;
        }
        return false;
    },

    onEnter:function()
    {
        this._super();
        var uiLayer = ccs.UILayer.create();
        this.addChild(uiLayer);

        if(this.isWin)
        {
            cc.AudioEngine.getInstance().playEffect(s_sound_win,false);

            var widget = ccs.GUIReader.getInstance().widgetFromJsonFile(s_exportJson_WinPanel);
            widget.setPositionX(widget.getPositionX() + 100);
            uiLayer.addWidget(widget);

            var titleAction = ccs.ActionManager.getInstance().getActionByName("WinPanel.ExportJson","QiuJInLe");
            if(titleAction)
            {
                titleAction.play();
            }

            var startBtn = uiLayer.getWidgetByName("Button_35");
            startBtn.addTouchEventListener(function(object,touchType){

                if(touchType == cc.TOUCH_ENDED)
                {
                    cc.AudioEngine.getInstance().playEffect(s_sound_btn,false);
                    cc.NotificationCenter.getInstance().postNotification("changeToGameLayer");
                }

            }.bind(this) ,this);
        }
        else
        {

            cc.AudioEngine.getInstance().playEffect(s_sound_lose,false);

            var widget = ccs.GUIReader.getInstance().widgetFromJsonFile(s_exportJson_LosePanel);
            widget.setPositionX(widget.getPositionX() + 100);
            uiLayer.addWidget(widget);

            var titleAction = ccs.ActionManager.getInstance().getActionByName("LosePanel.ExportJson","Animation0");
            if(titleAction)
            {
                titleAction.play();
            }

            var startBtn = uiLayer.getWidgetByName("Button_35_Copy0");
            startBtn.addTouchEventListener(function(object,touchType){

                if(touchType == cc.TOUCH_ENDED)
                {
                    cc.AudioEngine.getInstance().playEffect(s_sound_btn,false);
                    cc.NotificationCenter.getInstance().postNotification("changeToGameLayer");
                }

            }.bind(this) ,this);
        }

    },


    onExit:function()
    {


        this._super();
    }





});

GameOverLayer.create = function(isWin)
{
    var obj = new GameOverLayer(isWin);
    if(obj && obj.init(isWin))
    {
        return obj;
    }
    return null;
}