const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// para servir o HTML

// Registrar equipamento
app.post('/equipamentos', (req, res) => {
  const { nome, equipamento, modelo, fabricante, tagid } = req.body;
  const dataEntrada = new Date().toLocaleString();

  const sql = `
    INSERT INTO equipamentos (nome, equipamento, modelo, fabricante, tagid, status, dataEntrada)
    VALUES (?, ?, ?, ?, ?, 'Entrada', ?)
  `;

  db.run(sql, [nome, equipamento, modelo, fabricante, tagid, dataEntrada], function (err) {
    if (err) {
      return res.status(400).json({ error: 'Erro ao inserir equipamento ou Tag ID duplicado.' });
    }
    res.status(201).json({ id: this.lastID });
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
