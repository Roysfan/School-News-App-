import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Sun, Moon, Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [news, setNews] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Events");

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const mockNews = [
      { id: 1, title: "School Annual Day Announced", category: "Events" },
      { id: 2, title: "Science Fair Winners", category: "Academics" },
      { id: 3, title: "New Sports Equipment Arrives", category: "Sports" },
    ];
    setNews(mockNews);
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const addNews = () => {
    if (!newTitle.trim()) return;
    const newItem = {
      id: Date.now(),
      title: newTitle.trim(),
      category: newCategory,
    };
    setNews((prev) => [newItem, ...prev]);
    setNewTitle("");
  };

  const filteredNews = news.filter((item) => {
    const matchTitle = item.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || item.category === category;
    return matchTitle && matchCategory;
  });

  const categories = ["Events", "Academics", "Sports"];
  const chartData = categories.map((cat) => ({
    name: cat,
    value: news.filter((n) => n.category === cat).length,
  }));
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-gray-900 min-h-screen"}>
      <div className="flex justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">School News</h1>
        <div className="flex gap-2">
          <Input placeholder="Search news..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-40" />
          <Button onClick={() => setDarkMode(!darkMode)} variant="outline">
            {darkMode ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>

      <div className="flex justify-center gap-2 p-4">
        {["All", ...categories].map((cat) => (
          <Button key={cat} onClick={() => setCategory(cat)} variant={category === cat ? "default" : "outline"}>
            {cat}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 p-4 border-b">
        <Input placeholder="Enter news title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="flex-1" />
        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <Button onClick={addNews}>Add News</Button>
      </div>

      <motion.div layout className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNews.map((item) => (
          <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.category}</p>
                <Button className="mt-3" onClick={() => toggleBookmark(item.id)} variant="secondary">
                  {bookmarks.includes(item.id) ? <BookmarkCheck /> : <Bookmark />}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center p-6">
        <PieChart width={300} height={300}>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
