const express = require('express');
const router = express.Router();
const conn = require('../config/database');

router.post('/login', (req, res) => {
    console.log(req.body);
})

router.post('/join', (req, res) => {
    console.log('/joindata', req.body);
    const sql = `
    INSERT INTO linkdb_member VALUES (?, ?, ?, ?);
    `
    conn.execute
})

module.exports = router;