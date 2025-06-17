const express = require('express');
const router = express.Router();
const ProfessorService = require('../services/professor.service'); // Certifique-se de que o caminho está correto

router.get('/listar', (req, res) => {
    try {
        const lista = ProfessorService.listar();
        res.json(lista);
    } catch (error) {
        res.status(500).send('Erro ao listar professores');
    }
});

router.post('/cadastrar', (req, res) => {
    "/criar",
    (request, response) => {
    try {
        const professor = req.body;
        const novoProfessor = ProfessorService.cadastrar(professor);
        res.status(201).json(novoProfessor);
    } catch (error) {
        res.status(500).send('Erro ao cadastrar professor');
    }
}
});

module.exports = router;