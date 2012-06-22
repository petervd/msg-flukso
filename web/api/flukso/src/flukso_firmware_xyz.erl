%%
%% The /firmware/xyz resource implementation.
%%
%% Copyright (c) 2011 Fraunhofer Institut ITWM (www.itwm.fraunhofer.de)
%%
%% This program is free software; you can redistribute it and/or
%% modify it under the terms of the GNU General Public License
%% as published by the Free Software Foundation; either version 2
%% of the License, or (at your option) any later version.
%%
%% This program is distributed in the hope that it will be useful,
%% but WITHOUT ANY WARRANTY; without even the implied warranty of
%% MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
%% GNU General Public License for more details.
%%
%% You should have received a copy of the GNU General Public License
%% along with this program; if not, write to the Free Software
%% Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
%%

-module(flukso_firmware_xyz).
-author('Ely de Oliveira <ely.oliveira@itwm.fraunhofer.de>').

-export([init/1,
         allowed_methods/2,
         malformed_request/2,
         is_authorized/2,
         content_types_provided/2,
         to_json/2]).

-include_lib("webmachine/include/webmachine.hrl").
-include("flukso.hrl").


%init([]) -> 
%    {ok, undefined}.


%Logging
init(Config) ->
   {{trace, "/var/log/erlang/flukso-api/trace"}, Config}.


allowed_methods(ReqData, State) ->
    {['GET'], ReqData, State}.


malformed_request(ReqData, State) ->
    case wrq:method(ReqData) of
        'GET'  -> malformed_GET(ReqData, State)
    end.


malformed_GET(ReqData, _State) ->
    {_Version, ValidVersion} = check_version(wrq:get_req_header("X-Version", ReqData)),
    {Device, ValidDevice} = check_device(wrq:path_info(firmware, ReqData)),
    {Digest, ValidDigest} = check_digest(wrq:get_req_header("X-Digest", ReqData)),

    State = #state{device = Device, digest = Digest},

    {case {ValidVersion, ValidDevice, ValidDigest} of
        {true, true, true} -> false;
        _ -> true
     end,
    ReqData, State}.


is_authorized(ReqData, State) ->
    case wrq:method(ReqData) of
        'GET'  -> is_auth_GET(ReqData, State)
    end.


is_auth_GET(ReqData, #state{device = Device, digest = ClientDigest} = State) ->
    io:fwrite("is_auth_GET firmware\n"),

    {data, Result} = mysql:execute(pool, device_key, [Device]),

    {case mysql:get_result_rows(Result) of

      [[Key]] -> check_digest(Key, ReqData, ClientDigest);
      _ -> false
    end, ReqData, State}.


content_types_provided(ReqData, State) ->
    {[{"application/json", to_json}], ReqData, State}.


to_json(ReqData, #state{device = Device, digest = ClientDigest} = State) ->
    io:fwrite("to_json firmware\n"),

    {data, Result} = mysql:execute(pool, device_props, [Device]),

    case mysql:get_result_rows(Result) of

      [[Key, NextVersion, Resets, CurrentVersion]] ->

        %FIXME: Prepare upgrade file with cumulative upgrades
        Path = string:concat(string:concat("./var/upgrades/", integer_to_list(NextVersion)), ".sh"),
        {ok, File} = file:read_file(Path),

        Answer = [{<<"data">>, base64:encode(File)}],
        digest_response(Key, Answer, ReqData, State, false);

      _ ->
        %Internal Server Error (logical error)
        {{halt, 500}, ReqData, State}
    end.
