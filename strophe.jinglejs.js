/* jshint -W117 */
'use strict';

var JSM = require('jingle');
var RTC = require('webrtc-adapter-test');

var jxt = require('jxt').createRegistry();
jxt.use(require('jxt-xmpp-types'));
jxt.use(require('jxt-xmpp'));

var IqStanza = jxt.getDefinition('iq', 'jabber:client');

(function($) {
   Strophe.addConnectionPlugin('jingle', {
      connection: null,
      peer_constraints: {},
      AUTOACCEPT: false,
      localStream: null,
      manager: null,
      RTC: null,

      init: function(conn) {
         var self = this;

         self.RTC = RTC;

         self.connection = conn;

         if ((RTC.webrtcDetectedVersion < 33 && RTC.webrtcDetectedBrowser === 'firefox') || RTC.webrtcDetectedBrowser === 'chrome') {
            self.peer_constraints = {
               mandatory: {
                  'OfferToReceiveAudio': true,
                  'OfferToReceiveVideo': true
               }
            };

            if (RTC.webrtcDetectedBrowser === 'firefox') {
               self.peer_constraints.mandatory.MozDontOfferDataChannel = true;
            }
         } else {
            self.peer_constraints = {
               'offerToReceiveAudio': true,
               'offerToReceiveVideo': true
            };

            if (RTC.webrtcDetectedBrowser === 'firefox') {
               self.peer_constraints.mozDontOfferDataChannel = true;
            }
         }

         self.manager = new JSM({
            peerConnectionConstraints: self.peer_constraints,
            jid: self.connection.jid,
            selfID: self.connection.jid
         });

         var events = {
            'incoming': 'callincoming.jingle',
            'terminated': 'callterminated.jingle',
            'peerStreamAdded': 'remotestreamadded.jingle',
            'peerStreamRemoved': 'remotestreamremoved.jingle',
            'ringing': 'ringing.jingle',
            'log:error': 'error.jingle'
         };

         $.each(events, function(key, val) {
            self.manager.on(key, function() {
               $(document).trigger(val, arguments);
            });
         });

         self.manager.on('incoming', function(session) {
            session.on('change:connectionState', function(session, state) {
               $(document).trigger('iceconnectionstatechange.jingle', [session.sid, session, state]);
            });
         });

         if (this.connection.disco) {
            var i;
            for (i = 0; i < self.manager.capabilities.length; i++) {
               self.connection.disco.addFeature(self.manager.capabilities[i]);
            }
         }
         this.connection.addHandler(this.onJingle.bind(this), 'urn:xmpp:jingle:1', 'iq', 'set', null, null);

         this.manager.on('send', function(data) {

            var iq = new IqStanza(data);

            self.connection.send($.parseXML(iq.toString()).getElementsByTagName('iq')[0]);
         });

         //@TODO add on client unavilable (this.manager.endPeerSessions(peer_jid_full, true))
      },
      onJingle: function(iq) {
         var req = jxt.parse(iq.outerHTML);

         this.manager.process(req.toJSON());

         return true;
      },
      initiate: function(peerjid, stream) { // initiate a new jinglesession to peerjid
         var session = this.manager.createMediaSession(peerjid);

         session.on('change:connectionState', function(session, state) {
            $(document).trigger('iceconnectionstatechange.jingle', [session.sid, session, state]);
         });

         if (stream) {
            this.localStream = stream;
         }

         // configure session
         if (this.localStream) {
            session.addStream(this.localStream);
            session.start();

            return session;
         }

         console.error('No local stream defined');
      },
      terminate: function(jid, reason, silent) { // terminate by sessionid (or all sessions)
         if (typeof jid === 'undefined' || jid === null) {
            this.manager.endAllSessions(reason, silent);
         } else {
            this.manager.endPeerSessions(jid, reason, silent);
         }
      },
      terminateByJid: function(jid) {
         this.manager.endPeerSessions(jid);
      },
      addICEServer: function(server) {
         this.manager.addICEServer(server);
      },
      setICEServers: function(servers) {
         this.manager.iceServers = servers;
      },
      setPeerConstraints: function(constraints) {
         this.manager.config.peerConnectionConstraints = constraints;
      }
   });
}(jQuery));
