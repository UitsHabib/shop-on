const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');

const Profile = sequelize.define('profiles', {
    title: {
        type: DataTypes.STRING(50)
    },
    slug: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.ENUM,
        values: ['custom', 'standard'],
        defaultValue: 'custom'
    },
    description: {
        type: DataTypes.STRING(500)
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    updated_by: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Profile;