const RSS = require("rss");
const express = require("express");
const { supabase } = require("./supabase");

const feedOptions = {
  title: "Mi Feed RSS",
  description: "Este es un ejemplo de un feed RSS generado con Node.js",
  feed_url: "https://mi-sitio.com/rss",
  site_url: "https://mi-sitio.com",
};

const feed = new RSS(feedOptions);

feed.item({
  title: "Título del artículo",
  description: "Descripción del artículo",
  url: "https://mi-sitio.com/articulo-1",
  date: new Date(),
});

const app = express();

const getBlogs = async () => {
  const blogs = await supabase.from("blogs").select("*");
  return blogs.data;
};

app.get("/feed.xml", async (req, res) => {
  // verificar la base de datos

  // convertir los datos en un objeto compatible

  // agregaros al rssOutput

  const response = await getBlogs();

  response.forEach((e) => {
    feed.item({
      title: e.title,
      description: e.description,
      url: e.url,
      date: new Date(),
    });
  });

  const rssOutput = feed.xml({ indent: true });

  res.type("application/xml");
  res.send(rssOutput);
});

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
