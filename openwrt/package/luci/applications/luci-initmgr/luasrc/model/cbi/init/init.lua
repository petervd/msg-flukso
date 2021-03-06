--[[
LuCI - Lua Configuration Interface

Copyright 2008 Steven Barth <steven@midlink.org>
Copyright 2008 Jo-Philipp Wich <xm@leipzig.freifunk.net>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

$Id: init.lua 3528 2008-10-06 20:09:06Z jow $
]]--

require("luci.sys")
require("luci.util")

local inits = { }

for _, name in ipairs(luci.sys.init.names()) do
	local index   = luci.sys.init.index(name)
	local enabled = luci.sys.init.enabled(name)

	inits["%02i.%s" % { index, name }] = {
		name    = name,
		index   = tostring(index),
		enabled = enabled
	}
end


m = SimpleForm("initmgr", translate("initmgr"), translate("initmgr_desc"))
m.reset = false

s = m:section(Table, inits)

i = s:option(DummyValue, "index", translate("initmgr_index"))
n = s:option(DummyValue, "name", translate("initmgr_name"))

e = s:option(Flag, "enabled", translate("initmgr_enabled"))

e.cfgvalue = function(self, section)
	return inits[section].enabled and "1" or "0"
end

e.write = function(self, section, value)
	if value == "1" and not inits[section].enabled then
		inits[section].enabled = true
		return luci.sys.init.enable(inits[section].name)
	elseif value == "0" and inits[section].enabled then
		inits[section].enabled = false
		return luci.sys.init.disable(inits[section].name)
	end
	return true
end

return m
