local application = require 'hs.application'
local hyperCmd = {'cmd'}
local hyperControl = {'ctrl'}
local key2AppRun = {
  
}
local key2AppWindow_Cmd = {
    i = 'iTerm',
    o = 'Code',
    -- t = 'To Do'
}
local key2AppWindow_Control = {
  x = 'XMind',
  q = '大象'
}

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
  textSize = 35
}
-- 定时提醒
-- local timerForHaveARest = hs.timer.new(60*55, function()
--   hs.alert.show('🌸 Take a break 🌸', timerStyle, hs.screen.mainScreen(), 5)
--   -- timerForHaveARest:stop()
-- end)

-- 开始计时
-- hs.hotkey.bind(hyperControl, 't', function()
--   hs.alert('🌸 今天也要加油鸭 🌸')
--   timerForHaveARest:start()
-- end)

-- 测试按键
-- hs.hotkey.bind(hyperControl, 'e', function()
    
-- end)

-- 调整应用窗口位置：ctrl + r
hs.hotkey.bind({"shift", "ctrl"}, 'r', function()
    -- 大象 微信的布局修改
    local dxApp = hs.application.find('大象')
    if dxApp then
        dxApp:mainWindow():move({524, 0, 1000, 800})
    end
    local wechatApp = hs.application.find('微信')
    if wechatApp then
        wechatApp:mainWindow():move({524, 0, 1000, 800})
    end
end)

-- local SafariWatcher = hs.application.watcher.new(function(appName, eventType, appObject)
--   if appName == 'Safari浏览器' then
--       if eventType == hs.application.watcher.launched then
--           -- safari 全屏
--           switch_applications_to_full_screen({ 'Safari' })
--       end
--   end
--   -- 谷歌浏览器的全屏操作存在问题，暂时取消这一步
--   if appName == 'Google Chrome' then
--       if eventType == hs.application.watcher.launched then
--           -- Google Chrome 全屏
--           switch_applications_to_full_screen({ 'Google Chrome' })
--       end
--   end
-- end)

-- finder show
hs.hotkey.bind({"shift", "ctrl"}, 'l', function()
    local finderApp = hs.application.find('访达')
    if finderApp then
        local allWins = finderApp:allWindows()
        if allWins[1] then
            finderApp:activate(true)
            finderApp:unhide()
            allWins[1]:focus()
        end
    end
end)

-- To Do show
hs.hotkey.bind({"shift", "ctrl"}, 't', function()
    local todoApp = hs.application.find('To Do')
    if todoApp then
        local allWins = todoApp:allWindows()
        if allWins[1] then
            todoApp:activate(true)
            todoApp:unhide()
            allWins[1]:focus()
        end
    end
end)

-- 一键(开启/关闭)(微信/钉钉/Chrome/Safari/iTerm/VSCode)
hs.hotkey.bind({"shift", "ctrl"}, '`', function()

  local dxApp = hs.application.find('大象')
  local wechatApp = hs.application.find('微信')
  -- local dictApp = hs.application.find('词典')
  -- local safariApp = hs.application.find('Safari')
  local chromeApp = hs.application.find('Google Chrome')
  local itermApp = hs.application.find('iTerm')
  local codeApp = hs.application.find('Code')

  -- 通过 chrome 判断是启动还是关闭应用，因为 chrome 是一定会打开的应用
  if chromeApp then
      hs.alert('Shutting down Apps...')
      kill_all_applications({ codeApp, wechatApp, chromeApp, itermApp, dxApp })
      -- timerForHaveARest:stop()
      -- SafariWatcher:stop()
  else
      -- SafariWatcher:start()
      launch_all_applications({ 'wechat', 'Google Chrome', 'iTerm', '大象Nightly' })
      -- timerForHaveARest:start()
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

-- 应用全屏
function switch_applications_to_full_screen(appTableString)
  for key,value in pairs(appTableString) do
      local app = hs.application.find(value)
      if app then
          app:mainWindow():setFullScreen(true)
      end
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
                app:hide()
        		else
                app:activate(true)
            		app:unhide()
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
