import { Image, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli style",
    "Anime style",
    "Cartoon style",
    "Fantasy style",
    "Realistic style",
    "3D style",
    "Potrait style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");

  const [publish, setPublish] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.secure_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed-image.png";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="flex items-start flex-wrap gap-4 text-slate-700 h-full overflow-y-scroll p-6">
      {/* left col */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex itc gap-3">
          <Sparkles className="w-6 text-amber-300" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Describe Your Image</p>

        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Describe what you want to see in image..."
          required
          rows={4}
        />

        <p className="mt-4 text-sm font-semibold">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? "text-yellow-500 bg-yellow-50"
                  : "text-gray-500 border-gray-300"
              } `}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />

            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-yellow-300 transition"></div>

            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Make this image public</p>
        </div>

        <button
          disabled={loading}
          className="flex items-center w-full gap-2 bg-gradient-to-r from-[#FB8C00] to-[#FFEB3B] text-white px-3 py-2 mt-6 text-sm rounded-lg cursor-pointer "
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-5" />
          )}
          Generate Image
        </button>
      </form>

      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-yellow-400" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-9 h-9" />
              <p className="">
                Describe an image and click "Generate Image" to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full flex flex-col gap-4">
            <img
              src={content}
              alt="content"
              className="w-full h-full object-contain rounded-md border"
            />

            <button
              onClick={handleDownload}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
