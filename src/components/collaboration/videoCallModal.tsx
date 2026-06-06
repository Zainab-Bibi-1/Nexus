import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, X, MonitorUp, PhoneCall, MonitorOff } from 'lucide-react';
import { Button } from '../ui/Button';
import Peer from 'peerjs';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingTitle: string;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, meetingTitle }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [peerId, setPeerId] = useState<string>("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>(""); 
  const [isCalling, setIsCalling] = useState(false);

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const currentStream = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const activeCall = useRef<any>(null); // Call reference save karne ke liye

  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          currentStream.current = stream;
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }

          const peer = new Peer();
          
          peer.on('open', (id) => {
            setPeerId(id);
          });

          peer.on('call', (call) => {
            activeCall.current = call;
            call.answer(stream);
            call.on('stream', (userRemoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = userRemoteStream;
              }
            });
          });

          peerInstance.current = peer;
        })
        .catch((err) => console.error("Camera access error:", err));
    }

    return () => {
      currentStream.current?.getTracks().forEach(track => track.stop());
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      peerInstance.current?.destroy();
    };
  }, [isOpen]);

  const callPeer = (id: string) => {
    if (!peerInstance.current || !currentStream.current) return;
    
    setIsCalling(true);
    const call = peerInstance.current.call(id, currentStream.current);
    activeCall.current = call;
    
    call.on('stream', (userRemoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = userRemoteStream;
      }
      setIsCalling(false);
    });
  };

  // --- SCREEN SHARE LOGIC START ---
  const handleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        
        const screenTrack = stream.getVideoTracks()[0];

        // Apne video mein screen dikhayein
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        // Peer ko screen bhejna
        if (activeCall.current && activeCall.current.peerConnection) {
          const senders = activeCall.current.peerConnection.getSenders();
          const videoSender = senders.find((s: any) => s.track?.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(screenTrack);
          }
        }

        // Jab user "Stop Sharing" button (browser wala) dabaye
        screenTrack.onended = () => {
          stopScreenSharing();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error("Screen share error:", err);
      }
    } else {
      stopScreenSharing();
    }
  };

  const stopScreenSharing = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Wapis camera par switch karein
    if (myVideoRef.current && currentStream.current) {
      myVideoRef.current.srcObject = currentStream.current;
    }

    // Peer ko wapis camera track bhejna
    if (activeCall.current && activeCall.current.peerConnection && currentStream.current) {
      const videoTrack = currentStream.current.getVideoTracks()[0];
      const senders = activeCall.current.peerConnection.getSenders();
      const videoSender = senders.find((s: any) => s.track?.kind === 'video');
      if (videoSender) {
        videoSender.replaceTrack(videoTrack);
      }
    }
    setIsScreenSharing(false);
  };
  // --- SCREEN SHARE LOGIC END ---

  useEffect(() => {
    if (currentStream.current) {
      if (currentStream.current.getAudioTracks().length > 0) {
        currentStream.current.getAudioTracks()[0].enabled = !isMuted;
      }
      if (currentStream.current.getVideoTracks().length > 0) {
        currentStream.current.getVideoTracks()[0].enabled = isVideoOn;
      }
    }
  }, [isMuted, isVideoOn]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-hidden">
      <div className="bg-gray-900 w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col h-[85vh] border border-gray-800">
        
        {/* Header */}
        <div className="p-5 flex justify-between items-center bg-gray-800/50 border-b border-gray-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div>
              <h3 className="font-bold text-lg leading-none">{meetingTitle}</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                Your ID: <span className="text-primary-400 font-mono select-all">{peerId || "Connecting..."}</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 bg-gray-900 p-1.5 rounded-xl border border-gray-700 ml-4">
            <input 
              type="text" 
              placeholder="Paste Remote Peer ID..." 
              value={remotePeerIdValue}
              onChange={(e) => setRemotePeerIdValue(e.target.value)}
              className="bg-transparent text-xs px-3 focus:outline-none text-white w-48"
            />
            <Button 
              size="sm" 
              onClick={() => callPeer(remotePeerIdValue)}
              disabled={!remotePeerIdValue}
              className="px-4 py-1.5 h-auto text-[10px]"
            >
              <PhoneCall size={14} className="mr-2" /> Connect
            </Button>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Video Workspace */}
        <div className="flex-1 relative flex items-center justify-center bg-black/40">
          <div className="w-full h-full flex items-center justify-center">
             <video 
               ref={remoteVideoRef} 
               autoPlay 
               playsInline
               className="w-full h-full object-cover"
             />
             {!remoteVideoRef.current?.srcObject && (
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-white uppercase">
                    {meetingTitle.charAt(0)}
                  </div>
                  <p className="text-gray-400 font-medium">
                    {isCalling ? "Calling partner..." : "Waiting for connection..."}
                  </p>
               </div>
             )}
          </div>
          
          <div className="absolute bottom-6 right-6 w-52 h-36 bg-gray-800 rounded-2xl border-2 border-primary-500 overflow-hidden shadow-2xl z-10">
            <video 
              ref={myVideoRef} 
              autoPlay 
              muted 
              playsInline
              className={`w-full h-full object-cover ${!isVideoOn && !isScreenSharing ? 'hidden' : ''}`} 
            />
            {!isVideoOn && !isScreenSharing && (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <VideoOff size={32} className="text-gray-700" />
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[8px] text-white font-bold uppercase">
              {isScreenSharing ? "Sharing Screen" : "You"}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-6 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 flex justify-center items-center gap-6">
          <Button variant={isMuted ? "danger" : "outline"} onClick={() => setIsMuted(!isMuted)} className="rounded-full w-12 h-12 flex items-center justify-center text-white">
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
          
          <Button variant={!isVideoOn ? "danger" : "outline"} onClick={() => setIsVideoOn(!isVideoOn)} className="rounded-full w-12 h-12 flex items-center justify-center text-white">
            {!isVideoOn ? <VideoOff size={20} /> : <Video size={20} />}
          </Button>

          {/* Screen Share Button Updated */}
          <Button 
            variant={isScreenSharing ? "primary" : "outline"} 
            onClick={handleScreenShare} 
            className="rounded-full w-12 h-12 text-white transition-all"
          >
            {isScreenSharing ? <MonitorOff size={20} /> : <MonitorUp size={20} />}
          </Button>

          <div className="h-8 w-px bg-gray-700 mx-2" />

          <Button variant="danger" onClick={onClose} className="rounded-xl px-8 py-3 flex gap-3 items-center h-auto font-bold uppercase tracking-wider">
            <PhoneOff size={20} /> End Call
          </Button>
        </div>
      </div>
    </div>
  );
};