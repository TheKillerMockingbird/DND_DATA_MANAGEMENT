module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Character',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      characterClass: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      race: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1
        }
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
      },
      campaignId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: true
    }
  );
};