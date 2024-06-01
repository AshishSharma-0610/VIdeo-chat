/*import React, { useEffect } from 'react';

const VideoChat = () => {
    useEffect(() => {
        let peerConnection = new RTCPeerConnection();
        let localStream;
        let remoteStream;

        const init = async () => {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            remoteStream = new MediaStream();
            document.getElementById('user-1').srcObject = localStream;
            document.getElementById('user-2').srcObject = remoteStream;

            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
            });

            peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track);
                });
            };
        };

        const createOffer = async () => {
            peerConnection.onicecandidate = async (event) => {
                if (event.candidate) {
                    document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription);
                }
            };

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
        };

        const createAnswer = async () => {
            let offer = JSON.parse(document.getElementById('offer-sdp').value);

            peerConnection.onicecandidate = async (event) => {
                if (event.candidate) {
                    console.log('Adding answer candidate...:', event.candidate);
                    document.getElementById('answer-sdp').value = JSON.stringify(peerConnection.localDescription);
                }
            };

            await peerConnection.setRemoteDescription(offer);

            let answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
        };

        const addAnswer = async () => {
            console.log('Add answer triggered');
            let answer = JSON.parse(document.getElementById('answer-sdp').value);
            console.log('answer:', answer);
            if (!peerConnection.currentRemoteDescription) {
                peerConnection.setRemoteDescription(answer);
            }
        };

        init();

        document.getElementById('create-offer').addEventListener('click', createOffer);
        document.getElementById('create-answer').addEventListener('click', createAnswer);
        document.getElementById('add-answer').addEventListener('click', addAnswer);

        // Cleanup function
        return () => {
            document.getElementById('create-offer').removeEventListener('click', createOffer);
            document.getElementById('create-answer').removeEventListener('click', createAnswer);
            document.getElementById('add-answer').removeEventListener('click', addAnswer);
        };
    }, []);

    return (
        <div>



            <div id="video-chat-container">
                <video className="video-player" id="user-1" autoPlay playsInline></video>
                <video className="video-player" id="user-2" autoPlay playsInline></video>
            </div>

            <div className="step">

                <button id="create-offer">Create Offer</button>
            </div>


            <textarea id="offer-sdp" placeholder='User 2, paste SDP offer here...'></textarea>

            <div className="step">

                <button id="create-answer">Create answer</button>
            </div>



            <textarea id="answer-sdp" placeholder="User 1, paste SDP answer here..."></textarea>

            <div className="step">

                <button id="add-answer">Add answer</button>
            </div>
        </div>
    );
};

export default VideoChat;
*/



import React, { useEffect } from 'react';
import './VideoChat.css';

const VideoChat = () => {
    useEffect(() => {
        let peerConnection = new RTCPeerConnection();
        let localStream;
        let remoteStream;

        const init = async () => {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            remoteStream = new MediaStream();
            document.getElementById('user-1').srcObject = localStream;
            document.getElementById('user-2').srcObject = remoteStream;

            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
            });

            peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track);
                });
            };
        };

        const createOffer = async () => {
            peerConnection.onicecandidate = async (event) => {
                if (event.candidate) {
                    document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription);
                }
            };

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
        };

        const createAnswer = async () => {
            let offer = JSON.parse(document.getElementById('offer-sdp').value);

            peerConnection.onicecandidate = async (event) => {
                if (event.candidate) {
                    console.log('Adding answer candidate...:', event.candidate);
                    document.getElementById('answer-sdp').value = JSON.stringify(peerConnection.localDescription);
                }
            };

            await peerConnection.setRemoteDescription(offer);

            let answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
        };

        const addAnswer = async () => {
            console.log('Add answer triggered');
            let answer = JSON.parse(document.getElementById('answer-sdp').value);
            console.log('answer:', answer);
            if (!peerConnection.currentRemoteDescription) {
                peerConnection.setRemoteDescription(answer);
            }
        };

        init();

        document.getElementById('create-offer').addEventListener('click', createOffer);
        document.getElementById('create-answer').addEventListener('click', createAnswer);
        document.getElementById('add-answer').addEventListener('click', addAnswer);

        // Cleanup function
        return () => {
            document.getElementById('create-offer').removeEventListener('click', createOffer);
            document.getElementById('create-answer').removeEventListener('click', createAnswer);
            document.getElementById('add-answer').removeEventListener('click', addAnswer);
        };
    }, []);

    return (
        <div>
            <div className="video-chat-container">
                <video className="video-player local-video" id="user-1" autoPlay playsInline></video>
                <video className="video-player" id="user-2" autoPlay playsInline></video>
            </div>
            <div className="step">
                <button id="create-offer">Create Offer</button>
            </div>
            <textarea id="offer-sdp" placeholder='User 2, paste SDP offer here...'></textarea>
            <div className="step">
                <button id="create-answer">Create Answer</button>
            </div>
            <textarea id="answer-sdp" placeholder="User 1, paste SDP answer here..."></textarea>
            <div className="step">
                <button id="add-answer">Add Answer</button>
            </div>
        </div>
    );
};

export default VideoChat;





// VideoChat.jsx
/*import React, { useRef, useEffect } from 'react';
import './VideoChat.css';

const VideoChat = () => {
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();

    useEffect(() => {
        const initializeStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localVideoRef.current.srcObject = stream;
                remoteVideoRef.current.srcObject = stream; // Set the same stream for both video elements
            } catch (error) {
                console.error('Error accessing media devices: ', error);
            }
        };

        initializeStream();
    }, []);

    return (
        <div className="video-chat-container">
            <video ref={localVideoRef} autoPlay muted className="local-video"></video>
            <video ref={remoteVideoRef} autoPlay muted className="remote-video"></video>
        </div>
    );
};

export default VideoChat;
*




/**VideoChat.jsx
1.58 KB • 51 extracted lines

Formatting may be inconsistent from source.

// VideoChat.js
import React, { useRef, useEffect } from 'react';
import Peer from 'simple-peer';
import './VideoChat.css'; // Import CSS file for styling

const VideoChat = () => {
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    let peer = null;

    useEffect(() => {
        const initializePeer = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localVideoRef.current.srcObject = stream;
                peer = new Peer({ initiator: true, stream });
                peer.on('signal', (data) => {
                    // Send signal data to the peer
                });
                peer.on('stream', (stream) => {
                    remoteVideoRef.current.srcObject = stream;
                });
            } catch (error) {
                console.error('Error accessing media devices: ', error);
            }
        };
        initializePeer();

        return () => {
            if (peer) {
                peer.destroy();
            }
        };
    }, []);

    // Function to handle signal from remote peer
    const handleSignal = (data) => {
        // Process signal data
        peer.signal(data);
    };

    return (
        <div className="video-chat-container"> 
        <video ref={localVideoRef} autoPlay muted className="local-video"></video> 
        <video ref={remoteVideoRef} autoPlay className="remote-video"></video>
    </div>
);
};

export default VideoChat;
*/
