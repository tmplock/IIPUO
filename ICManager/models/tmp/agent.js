const moment = require('moment');

module.exports = (sequelize, Sequelize) => {

    const Agent = sequelize.define("agent", {
        name: {
            type:Sequelize.STRING,
        },
        parent: {
            type:Sequelize.INTEGER,
        },
        some_value: {
            type:Sequelize.STRING,
        },
        createdAt:{
            type:Sequelize.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD');
                //return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD h:mm:ss');
            }
        },
    });

    return Agent;
};