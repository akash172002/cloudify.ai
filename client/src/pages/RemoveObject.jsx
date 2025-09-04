import { Scissors, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (object.split(" ").length > 1) {
        return toast("Please enter one object name");
      }

      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content);
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
          <h1 className="text-xl font-semibold">Oject Removal</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Image</p>

        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />

        <p className="mt-6 text-sm font-medium">
          Describe Object name to remove
        </p>

        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g., watch or spoon, Only single object name"
          required
          rows={4}
        />

        <button
          disabled={loading}
          className="flex items-center w-full gap-2 bg-gradient-to-r from-[#FB8C00] to-[#FFEB3B] text-white px-3 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>

      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-yellow-400" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-9 h-9" />
              <p className="">
                Upload an image and click "Remove Object" to get started
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

export default RemoveObject;
