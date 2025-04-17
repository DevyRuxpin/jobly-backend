const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Company extends Model {
    static async search(name) {
      return await this.findAll({
        where: {
          name: {
            [sequelize.Sequelize.Op.iLike]: `%${name}%`
          }
        },
        order: [['name', 'ASC']],
        limit: 20 // Prevent excessive results
      });
    }
  }

  Company.init(
    {
      handle: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      num_employees: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      logo_url: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Company',
      tableName: 'companies',
      indexes: [
        {
          name: 'company_name_idx',
          fields: ['name']
        },
        {
          name: 'company_handle_idx',
          fields: ['handle']
        }
      ],
      timestamps: false
    }
  );

  return Company;
}; 