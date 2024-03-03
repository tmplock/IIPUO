const EnumBettingTarget = Object.freeze(
    {
        "Tie":0, 
        "Player":1, 
        "PlayerUnder":2, 
        "PlayerOver":3, 
        "Banker":4, 
        "BankerUnder":5, 
        "BankerOver":6, 
        "PlayerPair":7, 
        "BankerPair":8, 
        "EitherPair":9, 
        "PerfectPair":10, 
        //
        "Evolution":11,
        "Blackjack":12,
        "Roulette":13,
        "Slot":14,
        "PBG":15,
        "Max":16,
        "Bonus":17,
        "Tiger":18,
    }
);
exports.EBettingTarget = EnumBettingTarget;

class IBettingClass
{
    constructor(iGameCode, iRound, iChips, iTarget, strGroupID)
    {
        this.iGameCode = iGameCode;
        this.iRound = iRound;
        this.iChips = iChips;
        this.iTarget = iTarget;
        this.strGroupID = strGroupID;
    }
}

class IBettingObjectClass
{
    constructor(iBetting, iWin, iRolling)
    {
        this.iBetting = iBetting;
        this.iWin = iWin;
        this.iRolling = iRolling;
    }
}
exports.IBettingObject = IBettingObjectClass;
//exports.IBettingObjectReset = (object) => {
var ResetBettingObject = (object) => {//}
    object.iBetting = 0;
    object.iWin = 0;
    object.iRolling = 0;
}

class IRealtimeBettingObjectClass
{
    constructor(strRoomname)
    {
        this.strRoomname = strRoomname;
        this.iRound = 1;
        this.kBettingInfo = [];
        for ( var i = 0; i < EnumBettingTarget.Max; ++ i)
            this.kBettingInfo.push(new IBettingObjectClass(0,0,0));
    }
}
exports.IRealtimeBettingObject = IRealtimeBettingObjectClass;

class IRealtimeBettingClass
{
    constructor()
    {
        this.iMaxRooms = 10;
        
        this.kRealtime = [];
        for ( var i = 0; i < this.iMaxRooms; ++i)
        {
            this.kRealtime.push(new IRealtimeBettingObjectClass(`GameNo.${i+1}`));
        }
        //this.kRealTimeRecords = [];

        // this.kOverview = [];
        // for ( var i = 0; i < EnumBettingTarget.Max; ++i)
        //     this.kOverview.push(new IBettingObjectClass(0,0,0));
    }
    // Reset()
    // {
    //     for ( var i = 0; i < EnumBettingTarget.Max; ++i) {
    //         ResetBettingObject(this.kOverview[i]);
    //         // this.kOverview[i].iBetting = 0;
    //         // this.kOverview[i].iWin = 0;
    //         // this.kOverview[i].iRolling = 0;
    //     }
    // }
    ResetRealtime()
    {
        for ( var j = 0; j < this.iMaxRooms; ++j)
        {
            for ( var i = 0; i < EnumBettingTarget.Max; ++i) {
                ResetBettingObject(this.kRealtime[j].kBettingInfo[i]);
            }
        }
    }
    ResetRealtimeRoom(iRoomNo)
    {
        for ( var i = 0; i < EnumBettingTarget.Max; ++i) {
            ResetBettingObject(this.kRealtime[iRoomNo].kBettingInfo[i]);
        }

        // for ( var i in this.kRealTimeRecords )
        // {
        //     if ( this.kRealTimeRecords[i].iGameCode == iRoomNo) {
        //         this.kRealTimeRecords.splice(i, 1);
        //         i--;
        //     }                
        // }

        console.log(`ResetRealtimeRoom Data Length : ${this.kRealTimeRecords.length}`);
    }
    AddRealTimeBetting(iGameCode, iRound, iChips, iTarget, strGroupID)
    {
        //this.kRealTimeRecords.push(new IBettingClass(iGameCode, iRound, iChips, iTarget, strGroupID));
        this.kRealtime[iGameCode].kBettingInfo[iTarget].iBetting += iChips;
    }
    // CalculateRolling(iGameCode, iChips, iTarget, fSlotR, fBaccaratR, fUnderOverR, fBlackjackR, fEvolution, fRoulette)
    // {
    //     //console.log(`CalculateRolling Target : ${iTarget}, Chips : ${iChips}`);
    //     switch(iTarget)
    //     {
    //         case EnumBettingTarget.Tie:
    //         case EnumBettingTarget.Player:
    //         case EnumBettingTarget.Banker:

    //             //console.log(`Baccarat Percent ${iChips * fBaccaratR * 0.01}`);
    //             return iChips * fBaccaratR * 0.01;
    //             break;
    //         case EnumBettingTarget.PlayerUnder:
    //         case EnumBettingTarget.PlayerOver:
    //         case EnumBettingTarget.BankerUnder:
    //         case EnumBettingTarget.BankerOver:
    //             //console.log(`UnderOver Percent ${iChips * fUnderOverR * 0.01}`);
    //             return iChips * fUnderOverR * 0.01;
    //             break;
    //         case EnumBettingTarget.PlayerPair:
    //         case EnumBettingTarget.BankerPair:
    //         case EnumBettingTarget.EitherPair:
    //         case EnumBettingTarget.PerfectPair:
    //             //console.log(`Baccarat Percent ${iChips * fBaccaratR * 0.01}`);
    //             return iChips * fBaccaratR * 0.01;
    //             break;
    //         case EnumBettingTarget.Evolution:
    //             return iChips * fEvolution * 0.01;
    //             break;
    //         case EnumBettingTarget.Blackjack:
    //             return iChips * fBlackjackR * 0.01;
    //         case EnumBettingTarget.Roulette:
    //             return iChips * fRoulette * 0.01;
    //         case EnumBettingTarget.Slot:
    //             return iChips * fSlotR * 0.01;
    //         }
    // }

    CalculateRolling(iGameCode, iChips, iTarget, fSlotR, fBaccaratR, fUnderOverR, fBlackjackR, fEvolution, fRoulette)
    {
        //console.log(`CalculateRolling Target : ${iTarget}, Chips : ${iChips}`);
        switch(iTarget)
        {
            case EnumBettingTarget.Tie:
            case EnumBettingTarget.Player:
            case EnumBettingTarget.Banker:

                //console.log(`Baccarat Percent ${iChips * fBaccaratR * 0.01}`);
                return iChips * fBaccaratR * 0.01;
                break;
            case EnumBettingTarget.PlayerUnder:
            case EnumBettingTarget.PlayerOver:
            case EnumBettingTarget.BankerUnder:
            case EnumBettingTarget.BankerOver:
                //console.log(`UnderOver Percent ${iChips * fUnderOverR * 0.01}`);
                return iChips * fUnderOverR * 0.01;
                break;
            case EnumBettingTarget.PlayerPair:
            case EnumBettingTarget.BankerPair:
            case EnumBettingTarget.EitherPair:
            case EnumBettingTarget.PerfectPair:
            case EnumBettingTarget.Bonus:
            case EnumBettingTarget.Tiger:
                //console.log(`Baccarat Percent ${iChips * fBaccaratR * 0.01}`);
                return iChips * fBaccaratR * 0.01;
                break;
            case EnumBettingTarget.Evolution:
                return iChips * fEvolution * 0.01;
                break;
            case EnumBettingTarget.Blackjack:
                return iChips * fBlackjackR * 0.01;
            case EnumBettingTarget.Roulette:
                return iChips * fRoulette * 0.01;
            case EnumBettingTarget.Slot:
                return iChips * fSlotR * 0.01;
            }
    }

};
exports.IRealtimeBetting = IRealtimeBettingClass;

class IDailyBettingObjectClass
{
    constructor(strDate)
    {
        this.iInput = 0;
        this.iOutput = 0;
        this.iTotalCash = 0;
        this.iRolling = 0;
        this.iSettle = 0;
        this.iExchange = 0;
        this.strDate = strDate;
        this.kBettingInfo = [];
        // for ( var i = 0; i < EnumBettingTarget.Max; ++ i)
        //     this.kBettingInfo.push(new IBettingObjectClass(0,0,0));
    }
}
exports.IDailyBettingObject = IDailyBettingObjectClass;

class IAgentObjectClass
{
    // constructor(strID, strNickname, fSlot, fBaccarat, fUnderOver, fBlackjack, fEvolution, fRoulette, iInput, iOutput, iClass, 
    //     iNumAgents, iNumShops, iNumUsers, iLoan, iRollingMoney, iMyRollingMoney, iTotalMoney, iMyMoney, 
    //     strGroupID, iTotal)
    constructor(strID, strNickname, fSlot, fBaccarat, fUnderOver, iInput, iOutput, iClass, 
        iNumAgents, iNumShops, iNumUsers, iLoan, iRollingMoney, iMyRollingMoney, iTotalMoney, iMyMoney, 
        strGroupID, iTotal)
    {
        this.strID = strID;
        this.strNickname = strNickname;
        this.fSlot = fSlot;
        this.fBaccarat = fBaccarat;
        this.fUnderOver = fUnderOver;
        // this.fBlackjack = fBlackjack;
        // this.fEvolution = fEvolution;
        // this.fRoulette = fRoulette;
        this.iInput = iInput;
        this.iOutput = iOutput;
        this.iClass = iClass;
        this.iNumAgents = iNumAgents;
        this.iNumShops = iNumShops;
        this.iNumUsers = iNumUsers;
        this.iLoan = iLoan;
        this.iRollingMoney = iRollingMoney;
        this.iMyRollingMoney = iMyRollingMoney;
        this.iTotalMoney = iTotalMoney;
        this.iMyMoney = iMyMoney;
        this.strGroupID = strGroupID;
        this.iTotal = iTotal;
    }
}
exports.IAgentObject = IAgentObjectClass;