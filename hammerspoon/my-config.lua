local application = require 'hs.application'
local hyperCmd = {'cmd'}
local hyperControl = {'ctrl'}
local key2AppRun = {
  
}
local key2AppWindow_Cmd = {
    i = 'iTerm',
    o = 'Code',
    l = '访达',
    u = '词典'
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

-- 订制 style
local timerStyle = {
  textSize = 75
}
-- 定时提醒
local timerForHaveARest = hs.timer.new(60*50, function()
  hs.alert.show('嗨 🌸 休息、休息一下 🎉', timerStyle, hs.screen.mainScreen(), 10)
  timerForHaveARest:stop()
end)

-- 开始计时
hs.hotkey.bind(hyperControl, 't', function()
  hs.alert('开始专注了 🌸 今天也要加油鸭')
  timerForHaveARest:start()
end)

-- 测试按键
-- hs.hotkey.bind(hyperControl, 'e', function()
--   local dictApp = hs.application.find('词典')
--   if dictApp then
--       dictApp:kill()
--   else
--       hs.application.launchOrFocus('dictionary')
--   end
-- end)

-- 一键(开启/关闭)(微信/钉钉/Chrome/Safari/iTerm/词典/VSCode)
hs.hotkey.bind({"shift", "ctrl"}, '`', function()

  local dingApp = hs.application.find('钉钉')
  local wechatApp = hs.application.find('微信')
  local dictApp = hs.application.find('词典')
  local safariApp = hs.application.find('Safari')
  local chromeApp = hs.application.find('Google Chrome')
  local itermApp = hs.application.find('iTerm')
  local codeApp = hs.application.find('Code')

  -- 通过 safari 判断是启动还是关闭应用，因为 safari 是一定会打开的应用
  if safariApp then
      hs.alert('Shutting down Apps...下班噜～')
      kill_all_applications({ codeApp, dingApp, wechatApp, dictApp, safariApp, chromeApp, itermApp })
      timerForHaveARest:stop()
  else
      hs.alert('Launching Apps...今天也要加油鸭～')
      launch_all_applications({ 'dingtalk', 'wechat', 'dictionary', 'Safari', 'Google Chrome', 'iTerm' })
      timerForHaveARest:start()
  end

end)

-- 列表循环
for key,value in pairs(key2AppRun) do
    hs.hotkey.bind(hyperCmd, key, function()
       toggle_application_run(value)
    end)
end

for key,value in pairs(key2AppWindow_Cmd) do
    hs.hotkey.bind(hyperCmd, key, function()
        toggle_application_window(value)
    end)
end

for key,value in pairs(key2AppWindow_Control) do
  hs.hotkey.bind(hyperControl, key, function()
      toggle_application_window(value)
  end)
end

-- 关闭多个应用
function kill_all_applications(appTable)
    for key,value in pairs(appTable) do
        if value then
            value:kill()
        end
    end
end

-- 启动多个应用
function launch_all_applications(appTableString)
  for key,value in pairs(appTableString) do
      hs.application.launchOrFocus(value)
  end
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
