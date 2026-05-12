import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

import {
  Camera,
  Mic,
  Video,
  StopCircle,
  Download,
} from "lucide-react";

import { uploadEvidenceToCloudinary } from "../services/cloudinaryService";

const EvidenceRecorder = () => {

  const videoRef = useRef(null);

  const mediaRecorderRef = useRef(null);

  const [stream, setStream] = useState(null);

  const [recording, setRecording] = useState(false);

  const [videoURL, setVideoURL] = useState("");

  const [chunks, setChunks] = useState([]);

  const [videoBlob, setVideoBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cloudUrl, setCloudUrl] = useState("");

  // Start Camera
  const startCamera = async () => {

    try {

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

    } catch (error) {

      console.log(error);

      alert("Camera access denied");
    }
  };

  // Start Recording
  const startRecording = () => {

    if (!stream) return;

    const mediaRecorder =
      new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.start();

    setRecording(true);

    mediaRecorder.ondataavailable = (event) => {

      if (event.data.size > 0) {

        setChunks((prev) => [
          ...prev,
          event.data,
        ]);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, {
        type: "video/webm",
      });

      const url = URL.createObjectURL(blob);

      setVideoBlob(blob);
      setVideoURL(url);
      setChunks([]);
    };
  };

  // Stop Recording
  const stopRecording = () => {

    mediaRecorderRef.current.stop();

    setRecording(false);
  };

  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    startCamera();

  }, []);

  const uploadEvidence = async () => {
    if (!videoBlob) {
      alert("No evidence video found");
      return;
    }

    try {
      setUploading(true);

      const uploadedUrl = await uploadEvidenceToCloudinary(videoBlob);

      setCloudUrl(uploadedUrl);

      alert("Evidence uploaded successfully");
    } catch (error) {
      console.log(error);
      alert("Evidence upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="relative py-28 px-6 overflow-hidden">

      {/* Glow */}
      <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-red-500/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >

          <h1 className="text-5xl font-black">
            Emergency
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
              {" "}Evidence Recorder
            </span>
          </h1>

          <p className="text-gray-400 mt-5">
            Capture audio and video evidence automatically during emergencies.
          </p>

        </motion.div>

        {/* Main Card */}
        <div className="mt-20 bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl relative overflow-hidden">

          {/* Camera Feed */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10">

            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-[500px] object-cover bg-black"
            />

            {/* Recording Indicator */}
            {recording && (

              <motion.div
                animate={{
                  opacity: [1, 0.4, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                className="absolute top-5 left-5 flex items-center gap-3 bg-red-500/20 backdrop-blur-lg px-4 py-2 rounded-full border border-red-500/30"
              >

                <div className="w-3 h-3 rounded-full bg-red-500" />

                <span>Recording...</span>

              </motion.div>
            )}

          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-6 justify-center mt-10">

            {!recording ? (

              <button
                onClick={startRecording}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 font-bold flex items-center gap-3 hover:scale-105 transition"
              >

                <Video />

                Start Recording

              </button>

            ) : (

              <button
                onClick={stopRecording}
                className="px-8 py-4 rounded-2xl bg-white/10 border border-white/10 font-bold flex items-center gap-3 hover:bg-white/20 transition"
              >

                <StopCircle />

                Stop Recording

              </button>
            )}

          </div>

          {/* Download */}
          {videoURL && (

            <div className="mt-10 text-center">

              <a
                href={videoURL}
                download="voice-of-her-evidence.webm"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 font-bold hover:scale-105 transition"
              >

                <Download />

                Download Evidence

              </a>

            </div>
          )}

          {videoURL && (
            <div className="mt-6 text-center">
              <button
                onClick={uploadEvidence}
                disabled={uploading}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-bold hover:scale-105 transition disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Evidence to Cloud"}
              </button>
            </div>
          )}

          {cloudUrl && (
            <div className="mt-6 text-center bg-black/30 border border-white/10 rounded-2xl p-5">
              <p className="text-green-400 font-bold">
                Evidence Uploaded Successfully
              </p>

              <a
                href={cloudUrl}
                target="_blank"
                rel="noreferrer"
                className="text-pink-400 break-all mt-3 inline-block"
              >
                {cloudUrl}
              </a>
            </div>
          )}

          {/* Bottom Info */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">

            <div className="bg-black/20 border border-white/10 rounded-3xl p-6">

              <Camera className="text-pink-400 mb-4"/>

              <h2 className="text-2xl font-bold">
                HD Recording
              </h2>

            </div>

            <div className="bg-black/20 border border-white/10 rounded-3xl p-6">

              <Mic className="text-purple-400 mb-4"/>

              <h2 className="text-2xl font-bold">
                Audio Capture
              </h2>

            </div>

            <div className="bg-black/20 border border-white/10 rounded-3xl p-6">

              <Video className="text-red-400 mb-4"/>

              <h2 className="text-2xl font-bold">
                Secure Evidence
              </h2>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default EvidenceRecorder;
