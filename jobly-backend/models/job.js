const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Job extends Model {
    static associate(models) {
      Job.belongsTo(models.Company, {
        foreignKey: 'companyId',
        as: 'company',
      });
      Job.belongsToMany(models.User, {
        through: models.Application,
        foreignKey: 'jobId',
        otherKey: 'userId',
      });
    }
  }

  Job.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salary: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      equity: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          min: 0,
          max: 1,
        },
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Job',
    }
  );

  return Job;
}; 