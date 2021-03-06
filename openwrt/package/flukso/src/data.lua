--
-- data.lua: property and methods for manipulating incoming measurements
-- Copyright (c) 2009 jokamajo.org
--
-- This program is free software; you can redistribute it and/or
-- modify it under the terms of the GNU General Public License
-- as published by the Free Software Foundation; either version 2
-- of the License, or (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with this program; if not, write to the Free Software
-- Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
--
-- $Id$
--

local os, math, table =
      os, math, table

local getfenv, setmetatable, pairs =
      getfenv, setmetatable, pairs

module (...)
local modenv = getfenv() -- module environment

function new()
  return setmetatable({}, {__index = modenv})
end

function add(M, meter, timestamp, value)
  if not M[meter] then M[meter] = {} end
  M[meter][timestamp] = value
end

function clear(M)
  for meter in pairs(M) do
    M[meter] = nil
  end
end

function filter(M, span, offset)
  for meter, T in pairs(M) do
    local H = {} -- helper table, an indexed array containing all the measurement's timestamps
    for timestamp in pairs(T) do H[#H+1] = timestamp end
    table.sort(H) -- sort in ascending order, oldest timestamps will be treated first

    local i = 2
    while not (H[i+1] == nil or H[i] > os.time()-offset) do
      if math.floor(H[i-1]/span) == math.floor(H[i]/span) and math.floor(H[i]/span) == math.floor(H[i+1]/span) then
        T[H[i]] = nil
        table.remove(H, i)
      else
        i = i+1
      end
    end
  end
end
