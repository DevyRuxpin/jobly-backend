const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Company extends Model {
    static async search(searchTerm) {
      if (!searchTerm) {
        return this.findAll({
          order: [['name', 'ASC']],
          limit: 50
        });
      }
      return this.findAll({
        where: {
          name: sequelize.Sequelize.Op.iLike(`%${searchTerm}%`)
        },
        order: [['name', 'ASC']],
        limit: 50
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
        allowNull: false
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
      timestamps: false
    }
  );

  return Company;
}; 