module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Campaign',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: ''
      },
      setting: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
      }
    },
    {
      timestamps: true
    }
  );
};