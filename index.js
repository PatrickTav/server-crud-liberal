const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

// Local que esta rodando o servidor
const port = 8080;

// Middlewares
app.use(express());
app.use(cors());
app.use(express.json());

// Conexão co, o banco de dados
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "users",
});

// Buscando todos os usuários do banco
app.get("/users", (req, res) => {
  const dataSQl = "SELECT * FROM registrations";
  connection.query(dataSQl, (err, response) => {
    if (err) {
      res.status(500).json();
    }
    res.status(200).json(response);
  });
});

//  Buscando usuário específico do banco
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const dataSQL = "SELECT * FROM registrations WHERE id_user = ? ";
  connection.query(dataSQL, [id], (err, response) => {
    if (err) {
      res.status(500).json();
    }
    res.status(200).json(response);
  });
});

// Mandando usuário para o banco
app.post("/register", (req, res) => {
  const { cpf, name, workCard, sector, phone } = req.body;

  const dataSQL = "SELECT * FROM registrations WHERE cpf_user = ?";
  const dataSQLPost =
    "INSERT INTO registrations (cpf_user, name_user, workcard_user,sector_user, phones_user) VALUES (?,?,?,?,?)";

  connection.query(dataSQL, [cpf], (err, result) => {
    if (err) {
      res.status(500).send(err);
    }
    if (result.length === 0) {
      connection.query(
        dataSQLPost,
        [cpf, name, workCard, sector, phone],
        (err, result) => {
          if (err) {
            res.status(500).send(err);
          }

          res.status(200).send(result);
        }
      );
    }
  });
});

// Deletando usuário no banco
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const dataSQL = "DELETE FROM registrations WHERE id_user = ?";

  connection.query(dataSQL, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(result);
  });
});

// Editando uruário no banco
app.patch("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { cpf, name, workCard, sector, phone } = req.body;
  const dataSQL = "UPDATE registrations SET cpf_user = ?, name_user = ?, workcard_user = ?,sector_user = ?, phones_user = ? WHERE id_user = ?";

  connection.query(dataSQL,[cpf, name, workCard, sector, phone, id ], (err, result)=>{
    if(err){
      res.status(500).send(err)
    }
    console.log(result)
    res.status(200).send(result)
  })
});

// Onde o express esta ouvindo
app.listen(port, () => console.log(`conectado na porta ${port}`));
