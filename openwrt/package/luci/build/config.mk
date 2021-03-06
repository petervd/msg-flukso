LUAC = luac
LUAC_OPTIONS = -s
LUA_TARGET ?= source

LUA_MODULEDIR = /usr/lib/lua
LUA_LIBRARYDIR = /usr/lib/lua

LUCI_MODULEDIR = $(LUA_MODULEDIR)/luci
LUCI_LIBRARYDIR = $(LUA_LIBRARYDIR)/luci

UVL_SCHEMEDIR = host/lib/uci/schema

HTDOCS = /www

LUA=$(shell which lua)
XSLTPROC=$(shell which xsltproc)
