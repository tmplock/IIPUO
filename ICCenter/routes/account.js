const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const db = require('../db');

router.post('/login', (req, res) => {

    console.log(`/account/login`);
    console.log(req.body);

    res.send({result:'OK'});
});

module.exports = router;