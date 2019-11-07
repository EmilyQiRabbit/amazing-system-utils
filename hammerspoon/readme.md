# Hammerspoon

👉[戳此进入官网](http://www.hammerspoon.org)

## Hammerspoon 是什么

> 官网说明：This is a tool for powerful automation of OS X. At its core, Hammerspoon is just a bridge between the operating system and a Lua scripting engine. What gives Hammerspoon its power is a set of extensions that expose specific pieces of system functionality, to the user.

它是一款强大的 OS X 系统自动化工具，用户通过修改文件（init.lua）中的脚本，可以对系统进行一系列的配置。它将一部分系统扩展功能暴露给了用户。

我使用 Hammerspoon 的主要目的是进行一些快捷键的配置。当然，它的功能远不止此。

👉[戳此进入 Hammerspoon API 文档](http://www.hammerspoon.org/docs/index.html)

👉[戳此查看 Hammerspoon 的应用案例](https://www.hammerspoon.org/Spoons/)

## 怎么玩转 Hammerspoon 🤔

### 配置快捷键

不是所有的应用都可以配置快捷键，这时候可以使用 Hammerspoon 提供的方法打开应用，或者是将应用切换到主屏

代码如下👇

切换应用的启动与关闭：

```lua
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
```

切换应用的显示与隐藏：

```lua
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
```

然后配置快捷键就可以...

```lua
local application = require 'hs.application'
local hyperCmd = {'cmd'}
local hyperControl = {'ctrl'}
-- 使用 cmd + 字母 的快捷键配置
local key2AppWindow_Cmd = {
    i = 'iTerm',
    o = 'Code',
    l = '访达',
}
-- 使用 ctrl + 字母 的快捷键配置
local key2AppWindow_Control = {}

-- 循环
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
```

### 一键启动/暂停应用

```lua
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
```

这里很奇怪，因为有些应用的启动和暂停使用的字符串并不一样，比如微信和钉钉。`launchOrFocus` 方法的参数如果选择“微信”，其实是无法正确启动的。

### 定时休息

```lua
-- style
local timerStyle = {
  textSize = 75
}

local timeToDrinkSomeWater = hs.timer.doEvery(60*50, function()
  hs.alert.show('嗨 🌸 休息、休息一下 🎉', timerStyle, hs.screen.mainScreen(), 10)
end)
```

每 50 分钟，会提醒程序猿小姐姐我休息一下 🙋～
