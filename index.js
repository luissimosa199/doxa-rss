const RSS = require("rss");
const express = require("express");
const { supabase } = require("./supabase");

const feedOptions = {
  title: "DOXA RSS FEED",
  description: "DOXA RSS FEED FOR SOCIAL NETWORK",
  feed_url: "https://mi-sitio.com/feed.xml",
  site_url: "https://mi-sitio.com",
};


const app = express();

const getBlogs = async () => {
  try {

    const blogs = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);
    return blogs.data;
  } catch(err) {
    console.log(err)
  }
};

const feed = new RSS(feedOptions);

app.get("/feed.xml", async (req, res) => {
  
  let currentItem = null;

  const response = await getBlogs();

  response.forEach((e) => {
    currentItem = {
      title: e.title,
      description: e.description,
      url: e.url,
      date: new Date(),
    };
    return;
  });

  if (currentItem) {
    feed.item(currentItem);
  }

  const rssOutput = feed.xml({ indent: true });

  res.type("application/xml");
  res.send(rssOutput);
});

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
