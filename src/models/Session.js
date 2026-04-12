module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Session',
    {
      sessionDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      nextSteps: {
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