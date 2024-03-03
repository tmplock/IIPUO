const axios = require('axios');


let Balance = () =>
{
    const cDate = new Date().toString();
    const cAddress = `https://iipgame.com/cq9/transaction/balance/iip1-test`;
    // let objectAxios = {
    //     account:'iip1-user2',
    //     eventTime:new Date(),
    //     gamehall:'motivation-t',
    //     gamecode:'cq9',
    //     roundid:9999999,
    //     amount:1000,
    //     mtcode:cDate
    // };

    axios.get(cAddress, null)
    .then((response)=> {
        //res.send({result:'OK', reason:'OK'});

        console.log(`######`);
        console.log(response.data);

        return response.data.data.balance;
    })
    .catch((error)=> {
        //res.send({result:'Error', reason:'OK'});

        console.log('error');

        return 0;
    });

}

//Balance();

let Bet = () =>
{
    const cDate = new Date().toString();
    const cAddress = `https://iipgame.com/cq9/transaction/game/rollout`;
    let objectAxios = {
        account:'iip1-test',
        eventTime:new Date(),
        gamehall:'motivation-t',
        gamecode:'cq9',
        roundid:9999999,
        amount:1000,
        mtcode:cDate
    };

    axios.post(cAddress, objectAxios)
    .then((response)=> {
        //res.send({result:'OK', reason:'OK'});

        console.log(response.data);
    })
    .catch((error)=> {
        //res.send({result:'Error', reason:'OK'});

        console.log('error');
    });

}

let Win = () => {
    const cDate = new Date().toString();
    const cAddress = `https://iipgame.com/cq9/transaction/game/rollin`;
    let objectAxios = {
        account:'iip1-test',
        eventTime:new Date(),
        gamehall:'motivation-t',
        gamecode:'cq9',
        roundid:9999999,
        amount:1000,
        mtcode:cDate,
        bet:0,
        win:0,
        createTime:cDate,
        rake:0,
        gametype:0
    };

    axios.post(cAddress, objectAxios)
    .then((response)=> {
        //res.send({result:'OK', reason:'OK'});

        console.log(response.data);

    })
    .catch((error)=> {
        //res.send({result:'Error', reason:'OK'});

        console.log('error');
    });
}
