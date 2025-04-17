const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../models');

class Job extends Model {
  static async search(title) {
    return await this.findAll({
      where: {
        title: {
          [sequelize.Op.iLike]: `%${title}%`
        }
      },
      order: [['title', 'ASC']],
      limit: 50, // Prevent excessive results
      include: [{
        model: sequelize.models.Company,
        attributes: ['handle', 'name', 'logo_url']
      }]
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
      type: DataTypes.FLOAT,
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
    indexes: [
      {
        name: 'job_title_idx',
        fields: ['title']
      },
      {
        name: 'job_company_handle_idx',
        fields: ['company_handle']
      }
    ],
    timestamps: false
  }
);

module.exports = Job; 