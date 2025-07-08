const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");
const multer = require("multer");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/img", express.static(path.join(__dirname, "img")));

// Caminho para pasta de uploads
const uploadDir = path.join(__dirname, "uploads");

// Verifica se o diretório de upload existe, se não, cria
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuração do storage do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

const PREFIXES = {
  Notebook: 'NB',
  Desktop: 'DT',
  Monitor: 'MN',
  Impressora: 'IM',
  Celular: 'CE',
  Tablet: 'TB',
  Teclado: 'TC',
  Mouse: 'MS',
  Webcam: 'WC',
  'Fone de Ouvido': 'FO',
  Carregador: 'CG',
  'HD Externo': 'HE',
  'Pen Drive': 'PD',
  'Chave de fenda / Philips': 'CF',
  Furadeira: 'FD',
  Parafusadeira: 'PF',
  'Serra Elétrica': 'SE',
  Martelo: 'MA',
  Alicate: 'AL',
  Outros: 'OT',
};

app.get('/next-tagid/:equipamento', (req, res) => {
  const equipamento = req.params.equipamento;
  const prefix = PREFIXES[equipamento] || equipamento.slice(0, 2).toUpperCase();
  const sql =
    'SELECT tagid FROM equipamentos WHERE tagid LIKE ? ORDER BY id DESC LIMIT 1';
  db.get(sql, [prefix + '%'], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro ao consultar banco' });
    let next = 1;
    if (row && row.tagid) {
      const n = parseInt(row.tagid.slice(prefix.length), 10);
      if (!isNaN(n)) next = n + 1;
    }
    const tagid = prefix + String(next).padStart(3, '0');
    res.json({ tagid });
  });
});

// Registrar equipamento
app.post("/equipamentos", upload.single("foto"), (req, res) => {
  const { nome, equipamento, modelo, fabricante, tagid, serial } = req.body;
  const foto = req.file ? `/uploads/${req.file.filename}` : null;
  const dataEntrada = new Date().toISOString();

  const sql = `
    INSERT INTO equipamentos (nome, equipamento, modelo, fabricante, tagid, status, dataEntrada, foto, serial)
    VALUES (?, ?, ?, ?, ?, 'Entrada', ?, ?, ?)
  `;

  db.run(
    sql,
    [nome, equipamento, modelo, fabricante, tagid, dataEntrada, foto, serial],
    function (err) {
      if (err) {
        console.error("Erro ao inserir no banco:", err.message);

        // Tratamento específico para erro de chave duplicada
        if (err.message.includes("UNIQUE constraint failed: equipamentos.tagid")) {
          return res.status(400).json({
            error: "Tag ID já está em uso. Use um identificador único.",
          });
        }

        // Tratamento para outros erros
        return res.status(500).json({
          error: "Erro ao inserir equipamento: " + err.message,
        });
      }

      // Caso não ocorra erro, retorna os dados inseridos
      res.status(201).json({
        id: this.lastID,
        tagid,
        nome,
        equipamento,
        modelo,
        fabricante,
        foto,
        serial,
      });
    }
  );
});

// Consultar equipamento por Tag ID
app.get("/equipamentos/:tagid", (req, res) => {
  const tagid = req.params.tagid;
  db.get("SELECT * FROM equipamentos WHERE tagid = ?", [tagid], (err, row) => {
    if (err) return res.status(500).json({ error: "Erro interno" });
    if (!row)
      return res.status(404).json({ error: "Equipamento não encontrado" });
    res.json(row);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
