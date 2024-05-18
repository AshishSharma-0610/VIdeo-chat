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



import React, { useEffect, useState } from 'react';
import './VideoChat.css';

const VideoChat = () => {
    const [transcript, setTranscript] = useState('');

    useEffect(() => {
        const deepgramApiKey = '0c44b52bafab0a3f558d701ec304fd8f4b3dd7eb'; // Replace with your actual Deepgram API key

        let peerConnection = new RTCPeerConnection();
        let localStream;
        let remoteStream;

        const init = async () => {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            remoteStream = new MediaStream();
            document.getElementById('user-1').srcObject = localStream;
            document.getElementById('user-2').srcObject = remoteStream;

            localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
                if (track.kind === 'audio') {
                    startTranscription(track);
                }
            });

            peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remoteStream.addTrack(track);
                });
            };
        };

        const startTranscription = async (audioTrack) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
            const processor = audioContext.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = async (event) => {
                try {
                    const audioBuffer = event.inputBuffer.getChannelData(0);
                    const wavData = encodeWAV(audioBuffer, audioContext.sampleRate);
                    const audioBlob = new Blob([wavData], { type: 'audio/wav' });
                    const reader = new FileReader();

                    reader.onloadend = async () => {
                        try {
                            const audioArrayBuffer = reader.result;
                            const response = await fetch('https://api.deepgram.com/v1/listen', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'audio/wav',
                                    'Authorization': `Token ${deepgramApiKey}`
                                },
                                body: audioArrayBuffer
                            });

                            if (!response.ok) {
                                throw new Error(`Deepgram API error: ${response.statusText}`);
                            }

                            const data = await response.json();
                            const { transcript } = data.results.channels[0].alternatives[0];
                            setTranscript(transcript); // Update the UI with the transcription
                        } catch (error) {
                            console.error('Error processing audio data:', error);
                        }
                    };

                    reader.readAsArrayBuffer(audioBlob);
                } catch (error) {
                    console.error('Error during audio processing:', error);
                }
            };

            source.connect(processor);
            processor.connect(audioContext.destination);
        };

        const encodeWAV = (samples, sampleRate) => {
            const buffer = new ArrayBuffer(44 + samples.length * 2);
            const view = new DataView(buffer);

            const writeString = (view, offset, string) => {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            };

            const floatTo16BitPCM = (output, offset, input) => {
                for (let i = 0; i < input.length; i++, offset += 2) {
                    const s = Math.max(-1, Math.min(1, input[i]));
                    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                }
            };

            writeString(view, 0, 'RIFF');
            view.setUint32(4, 32 + samples.length * 2, true);
            writeString(view, 8, 'WAVE');
            writeString(view, 12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            view.setUint16(22, 1, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * 2, true);
            view.setUint16(32, 2, true);
            view.setUint16(34, 16, true);
            writeString(view, 36, 'data');
            view.setUint32(40, samples.length * 2, true);

            floatTo16BitPCM(view, 44, samples);

            return view;
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
            <div className="transcript">
                <h3>Transcription:</h3>
                <p>{transcript}</p>
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
