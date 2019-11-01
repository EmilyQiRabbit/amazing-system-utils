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

hs.hotkey.bind(hyperCmd, '`', function()
    local screen = hs.mouse.getCurrentScreen()
    local nextScreen = screen:next()
    local rect = nextScreen:fullFrame()
    local center = hs.geometry.rectMidPoint(rect)
 
    hs.mouse.setAbsolutePosition(center)
end)

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
  	hs.alert('YuqiQueenRealm: Launch' .._app)
        return
    end

    -- application running, kill app
    if app then
        app:kill()
        hs.alert('YuqiQueenRealm: Kill'.._app)
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
