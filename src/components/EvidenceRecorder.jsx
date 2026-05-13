import { useRef, useState } from "react";
import {
  Camera,
  StopCircle,
  UploadCloud,
  Download,
  Video,
  CheckCircle,
} from "lucide-react";
import { uploadEvidenceToCloudinary } from "../services/cloudinaryService";

const getSupportedMimeType = () => {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];

  return types.find((type) => MediaRecorder.isTypeSupported(type)) || "";
};

const EvidenceRecorder = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const [videoBlob, setVideoBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cloudUrl, setCloudUrl] = useState("");
  const [error, setError] = useState("");

  const startRecording = async () => {
    try {
      setError("");
      setVideoURL("");
      setVideoBlob(null);
      setCloudUrl("");
      chunksRef.current = [];

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera recording is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });

      const videoTracks = stream.getVideoTracks();

      if (videoTracks.length === 0) {
        setError("No camera video track found. Please allow camera permission.");
        return;
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const mimeType = getSupportedMimeType();

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalMimeType = mimeType || "video/webm";

        const blob = new Blob(chunksRef.current, {
          type: finalMimeType,
        });

        const localUrl = URL.createObjectURL(blob);

        setVideoBlob(blob);
        setVideoURL(localUrl);

        stream.getTracks().forEach((track) => track.stop());

        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      recorder.start(1000);
      setRecording(true);
    } catch (error) {
      console.log(error);

      if (error.name === "NotAllowedError") {
        setError("Camera/microphone permission denied. Please allow permissions.");
      } else if (error.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else if (error.name === "NotReadableError") {
        setError("Camera is already being used by another app.");
      } else {
        setError("Unable to start video recording.");
      }
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recording) {
      recorderRef.current.stop();
      setRecording(false);
    }
  };

  const uploadEvidence = async () => {
    if (!videoBlob) {
      alert("Please record evidence first.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const uploadedUrl = await uploadEvidenceToCloudinary(videoBlob);

      setCloudUrl(uploadedUrl);
      localStorage.setItem("latestEvidenceUrl", uploadedUrl);

      alert("Evidence uploaded successfully.");
    } catch (error) {
      console.log(error);
      setError("Evidence upload failed. Check Cloudinary settings.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-black">
            Evidence
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              {" "}Recorder
            </span>
          </h2>

          <p className="text-gray-400 mt-4">
            Record audio/video evidence and upload it securely for SOS alerts.
          </p>
        </div>

        <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
          <div className="relative aspect-video bg-black/70 rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center">
            {videoURL ? (
              <video
                src={videoURL}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            )}

            {!recording && !videoURL && (
              <div className="absolute text-center text-gray-400 pointer-events-none">
                <Video size={54} className="mx-auto mb-3" />
                <p>Camera preview will appear here</p>
              </div>
            )}

            {recording && (
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-red-600 text-white font-bold animate-pulse">
                REC
              </div>
            )}
          </div>

          {error && (
            <p className="mt-5 text-red-400 font-semibold">
              {error}
            </p>
          )}

          <div className="flex flex-col md:flex-row gap-4 mt-8">
            {!recording ? (
              <button
                onClick={startRecording}
                className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold hover:scale-[1.02] transition"
              >
                <Camera size={20} />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-red-600 font-bold hover:bg-red-700 transition"
              >
                <StopCircle size={20} />
                Stop Recording
              </button>
            )}

            {videoURL && (
              <a
                href={videoURL}
                download="voice-of-her-evidence.webm"
                className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 font-bold hover:bg-white/15 transition"
              >
                <Download size={20} />
                Download
              </a>
            )}

            {videoBlob && (
              <button
                onClick={uploadEvidence}
                disabled={uploading}
                className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-blue-600 font-bold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <UploadCloud size={20} />
                {uploading ? "Uploading..." : "Upload Evidence"}
              </button>
            )}
          </div>

          {cloudUrl && (
            <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
              <p className="text-green-400 font-bold flex items-center gap-2">
                <CheckCircle size={20} />
                Evidence uploaded successfully
              </p>

              <a
                href={cloudUrl}
                target="_blank"
                rel="noreferrer"
                className="text-pink-300 break-all mt-3 inline-block"
              >
                {cloudUrl}
              </a>

              <p className="text-gray-400 text-sm mt-3">
                This evidence link will be attached to the next SOS alert.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EvidenceRecorder;
