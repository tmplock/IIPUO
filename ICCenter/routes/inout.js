const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.post('/request_input', async (req, res) => {

    console.log('/inout/request_input');
    console.log(req.body);

    res.send({result:'OK'});
});

router.post('/request_output', async (req, res) => {

    console.log('/inout/request_output');
    console.log(req.body);

    res.send({result:'OK'});
});

router.post('/request_rolling', async (req, res) => {

    console.log('/inout/request_rolling');
    console.log(req.body);

    res.send({result:'OK'});
});

router.post('/request_settle', async (req, res) => {

    console.log('/inout/request_settle');
    console.log(req.body);

    res.send({result:'OK'});
});

router.post('/request_give', async (req, res) => {

    console.log('/inout/request_give');
    console.log(req.body);

    res.send({result:'OK'});
});

router.post('/request_take', async (req, res) => {

    console.log('/inout/request_take');
    console.log(req.body);

    res.send({result:'OK'});
});

router.post('/request_changestate', async (req, res) => {

    console.log('/inout/request_changestate');
    console.log(req.body);

    res.send({result:'OK'});
});

module.exports = router;