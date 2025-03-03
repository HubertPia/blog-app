import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "123456",
  port: 5432,
});
db.connect();

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

// Strona logowania
app.get("/", (req, res) => {
  res.render("login.ejs");
});

// Obsługa logowania użytkownika
app.post("/login", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.send("Proszę podać login i hasło!");
  }

  const result = await db.query("SELECT * FROM users WHERE login = $1", [
    login,
  ]);

  if (result.rows.length === 0) {
    return res.send("Nie znaleziono użytkownika!");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.send("Nieprawidłowe hasło");
  }

  req.session.userId = user.id;
  req.session.userName = user.name;
  req.session.color = user.color;

  res.redirect("/index");
});

// Strona rejestracji
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Obsługa rejestracji użytkownika
app.post("/register", async (req, res) => {
  const { name, surname, login, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query(
      "INSERT INTO users (name, surname, login, password) VALUES ($1, $2, $3, $4)",
      [name, surname, login, hashedPassword]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Błąd rejestracji - login jest już zajęty");
  }
});

// Strona główna
app.get("/index", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/");
  }

  res.render("index.ejs", { name: req.session.userName });
});

// Wylogowanie
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
