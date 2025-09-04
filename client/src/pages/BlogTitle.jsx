import { useAuth } from "@clerk/clerk-react";
import { Hash, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitle = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Buisness",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategories, setSelectedCategories] = useState("General");

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategories}`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
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

  return (
    <div className="flex items-start flex-wrap gap-4 text-slate-700 h-full overflow-y-scroll p-6">
      {/* left col */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex itc gap-3">
          <Sparkles className="w-6 text-amber-300" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Keyword</p>

        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The Future of AI is..."
          required
        />

        <p className="mt-4 text-sm font-semibold">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {blogCategories.map((item) => (
            <span
              onClick={() => setSelectedCategories(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategories === item
                  ? "text-yellow-500 bg-yellow-50"
                  : "text-gray-500 border-gray-300"
              } `}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        <br />
        <button
          disabled={loading}
          className="flex items-center w-full gap-2 bg-gradient-to-r from-[#FB8C00] to-[#FFEB3B] text-white px-3 py-2 mt-6 text-sm rounded-lg cursor-pointer justify-center"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate Title
        </button>
      </form>

      {/* right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-yellow-400" />
          <h1 className="text-xl font-semibold">Generated Title</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9" />
              <p className="">
                Enter a topic and click "Generated Title" to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitle;
