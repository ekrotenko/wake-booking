const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const db = require('../db');

const Park = db.define('park', {
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            len: [3, 30]
        }

    },
    country:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len: [3, 30]
        }
    },
    city:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len: [3, 30]
        }
    },
    zipCode:{
        type: DataTypes.STRING,
        validate:{
            len: [5, 9]
        }
    },
    address:{
        type: DataTypes.STRING,
        validate:{
            len: [3, 30]
        }
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len: [3, 30]
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len: [5, 50],
            isEmail: true
        }
    },
    website:{
        type: DataTypes.STRING,
        validate:{
            len: [3, 30],
            isUrl: true
        }
    },
    latitude:{
        type: DataTypes.STRING
    },
    longitude:{
        type: DataTypes.STRING
    }
}, {
    paranoid: true
});

module.exports = Park;