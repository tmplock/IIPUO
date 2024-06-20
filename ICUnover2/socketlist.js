class ISocketList
{
    constructor()
    {
        this.listSockets = [];
    }

    Add(socket)
    {
        //socket.id = 
        this.listSockets.push(socket);
    }

    Remove(socket)
    {
        for ( let i in this.listSockets )
        {
            if ( this.listSockets[i].id == socket.id )
                this.listSockets.splice(i, 1);
        }
        //this.listSockets.splice(socket.id, 1);
    }

    GetLength()
    {
        return this.listSockets.length;
    }

    GetSocket(i)
    {
        return this.listSockets[i];
    }

    PrintList(comment)
    {
        for ( let i in this.listSockets )
        {
            console.log(`${comment} : ${this.listSockets[i].strID} / ${this.listSockets[i].strPassword}, OnStage : ${this.listSockets[i].eStage}`);
        }
        console.log(`${comment} list length : ${this.GetLength()}`);
    }
}
module.exports = ISocketList;