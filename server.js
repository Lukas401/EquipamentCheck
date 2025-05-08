const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const multer = require ('multer');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// para servir o HTML
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb (null, Date.now() + '-' + file.originalname)
});

const upload = multer ({ storage });

// Registrar equipamento
app.post('/equipamentos', upload.single ('foto'), (req, res) => {
  const { nome, equipamento, modelo, fabricante, tagid } = req.body;
  const foto = req.file ? `/uploads/${req.file.filename}` : null;
  const dataEntrada = new Date().toISOString();

  const sql = `
    INSERT INTO equipamentos (nome, equipamento, modelo, fabricante, tagid, status, dataEntrada, foto)
    VALUES (?, ?, ?, ?, ?, 'Entrada', ?, ?)
  `;

  db.run(sql, [nome, equipamento, modelo, fabricante, tagid, dataEntrada, foto], function (err) {
    if (err.message.includes ('Unique constraint failed')) {
      return res.status(400).json({ error: 'Tag ID já está em uso. Use um identificador único.' });
    }
    res.status(201).json({ 
      id: this.lastID,
      tagid,
      nome,
      equipamento,
      modelo,
      fabricante,
      foto});
  });
});

// Consultar equipamento por Tag ID
app.get('/equipamentos/:tagid', (req, res) => {
  const tagid = req.params.tagid;
  db.get('SELECT * FROM equipamentos WHERE tagid = ?', [tagid], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro interno' });
    if (!row) return res.status(404).json({ error: 'Equipamento não encontrado' });
    res.json(row);
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
