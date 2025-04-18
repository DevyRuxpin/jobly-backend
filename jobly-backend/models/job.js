const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Job extends Model {
    static async search(searchTerm) {
      if (!searchTerm) {
        return this.findAll({
          order: [['title', 'ASC']],
          limit: 50
        });
      }
      return this.findAll({
        where: {
          title: sequelize.Sequelize.Op.iLike(`%${searchTerm}%`)
        },
        order: [['title', 'ASC']],
        limit: 50
      });
    }
  }

  Job.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      salary: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      equity: {
        type: DataTypes.DECIMAL(4, 3),
        allowNull: true,
        validate: {
          min: 0,
          max: 1
        }
      },
      company_handle: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'handle'
        }
      }
    },
    {
      sequelize,
      modelName: 'Job',
      tableName: 'jobs',
      timestamps: false
    }
  );

  return Job;
}; 