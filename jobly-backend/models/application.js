const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Application extends Model {
    static associate(models) {
      Application.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      Application.belongsTo(models.Job, {
        foreignKey: 'jobId',
      });
    }
  }

  Application.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Jobs',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Application',
      indexes: [
        {
          unique: true,
          fields: ['userId', 'jobId'],
        },
      ],
    }
  );

  return Application;
}; 