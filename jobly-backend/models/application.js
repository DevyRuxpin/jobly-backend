const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Application extends Model {}

  Application.init(
    {
      username: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'username'
        }
      },
      job_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'jobs',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'Application',
      tableName: 'applications',
      timestamps: false
    }
  );

  return Application;
}; 