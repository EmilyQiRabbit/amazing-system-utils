local application = require 'hs.application'
local hyperCmd = {'cmd'}
local hyperControl = {'ctrl'}
local key2AppRun = {
  
}
local key2AppWindow_Cmd = {
    i = 'iTerm',
    o = 'Code',
    l = '访达',
}
local key2AppWindow_Control = {}

-- 切换屏幕时鼠标瞬移
-- hs.hotkey.bind(hyperCmd, '`', function()
--     local screen = hs.mouse.getCurrentScreen()
--     local nextScreen = screen:next()
--     local rect = nextScreen:fullFrame()
--     local center = hs.geometry.rectMidPoint(rect)
 
--     hs.mouse.setAbsolutePosition(center)
-- end)

-- alert default style
hs.alert.defaultStyle.strokeColor = { white = 1, alpha = 0 }
hs.alert.defaultStyle.fillColor = { white = 0.05, alpha = 0.75 }
hs.alert.defaultStyle.radius = 10
hs.alert.defaultStyle.textColor = { hex = '#FAD94A', alpha = 0.75 }

-- 一键(开启/关闭)(微信/钉钉/Chrome/Safari)
hs.hotkey.bind({"shift", "ctrl"}, '`', function()

  local dingApp = hs.application.find('钉钉')
  local wechatApp = hs.application.find('微信')
  local infoText = 'Launching Apps...今天也要加油鸭～'

  if dingApp then
      dingApp:kill()
      infoText = 'Shutting down Apps...下班噜～'
  else
      hs.application.launchOrFocus('dingtalk')
  end

  hs.alert(infoText)

  if wechatApp then
      wechatApp:kill()
  else
      hs.application.launchOrFocus('wechat')
  end

  toggle_application_run('Safari')
  toggle_application_run('Google Chrome')

end)

-- 列表循环

for key,value in pairs(key2AppRun)  do
    hs.hotkey.bind(hyperCmd, key, function()
       toggle_application_run(value)
    end)
end

for key,value in pairs(key2AppWindow_Cmd)  do
    hs.hotkey.bind(hyperCmd, key, function()
        toggle_application_window(value)
    end)
end

for key,value in pairs(key2AppWindow_Control)  do
  hs.hotkey.bind(hyperControl, key, function()
      toggle_application_window(value)
  end)
end

-- Toggle an application between launch and kill
function toggle_application_run(_app)
    -- finds a running applications
    local app = hs.application.find(_app)

    if not app then
        -- application not running, launch app
        hs.application.launchOrFocus(_app)
  	    -- hs.alert('YuqiQueenRealm: Launch' .._app)
        return
    end

    -- application running, kill app
    if app then
        app:kill()
        -- hs.alert('YuqiQueenRealm: Kill'.._app)
    end
end

-- Toggle an application between show and hide
function toggle_application_window(_app)
    -- finds a running applications
    local app = hs.application.find(_app)

    -- application running, toggle hide/unhide
    if app then
	local mainwin = app:mainWindow()
        if mainwin then
        		if true == app:isFrontmost() then
            		mainwin:application():hide()
        		else
            		mainwin:application():activate(true)
            		mainwin:application():unhide()
            		mainwin:focus()
        		end
    	else
	        -- no windows, maybe hide
       		 if true == app:hide() then
            		-- focus app
            		application.launchOrFocus(_app)
        		else
            		-- nothing to do
        		end
    	end
    end
end

-- style
local timerStyle = {
  textSize = 75
}

local timeToDrinkSomeWater = hs.timer.doEvery(60*50, function()
  hs.alert.show('嗨 🌸 休息、休息一下 🎉', timerStyle, hs.screen.mainScreen(), 10)
end)

