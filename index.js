import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.send("Proszę podać imię!");
  }

  req.session.name = name;
  res.redirect("/index");
});

app.get("/index", (req, res) => {
  if (!req.session.name) {
    return res.redirect("/");
  }

  res.render("index.ejs", { name: req.session.name });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
