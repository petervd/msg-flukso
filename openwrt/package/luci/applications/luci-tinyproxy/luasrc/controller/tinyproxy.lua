--[[
LuCI - Lua Configuration Interface

Copyright 2008 Steven Barth <steven@midlink.org>
Copyright 2008 Jo-Philipp Wich <xm@leipzig.freifunk.net>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

$Id: tinyproxy.lua 3987 2009-01-02 21:35:25Z Cyrus $
]]--
module("luci.controller.tinyproxy", package.seeall)

function index()
	if not luci.fs.access("/etc/config/tinyproxy") then
		return
	end
	
	local page = entry({"admin", "services", "tinyproxy"}, cbi("tinyproxy"), "Tinyproxy")
	page.dependent = true
	page.i18n = "tinyproxy"
end