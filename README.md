[![Dependency Status](https://dependencyci.com/github/jsxc/strophe.jinglejs/badge)](https://dependencyci.com/github/jsxc/strophe.jinglejs)

strophe.jinglejs
==============

strophe.jinglejs is a webrtc connection plugin for [strophe.js](http://strophe.im/strophejs/) that uses [jingle.js](https://github.com/otalk/jingle.js). Strophe is a popular library for writing XMPP client applications that run on any of the current popular browsers. Instead of the native TCP binding, strophe.js uses BOSH (Bidirectional-streams Over Synchronous HTTP, a variant of long polling) to connect to an XMPP server. Besides enabling anyone to build (federated) IM applications, this opens up the browser as an addressable endpoint for two-way exchange of structured messages, including presence and publish-subscribe applications.

This plugin makes it possible to negotiate audio/video streams via XMPP and then relinquish control to the WebRTC support of browsers like Firefox and Chrome for the actual out-of-band media streams. XMPP/Jingle you get the authenticated, secured and federated media signaling, whereas WebRTC gives you an API to set up the media streams using RTP/ICE/STUN and provide access to cameras and microphones.

The ["Silo-Free WebRTC"](http://vimeo.com/77289728) talk from the 2013 Realtime Conference explains this very well. The XMPP specific part starts around 17:00.

Strophe.jinglejs in the wild:

- [jsxc](https://github.com/jsxc/jsxc/)
