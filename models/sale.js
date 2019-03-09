const CPF = require('@fnando/cpf/dist/node');

module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define('Sale', {
    cfeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientDocument: {
      field: 'client_document',
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isCpfValid() {
          if (!CPF.isValid(this.clientDocument)) {
            throw new Error("It's not a valid client document");
          }
        },
      },
    },
    purchaseDate: {
      field: 'purchase_date',
      type: DataTypes.DATE,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      field: 'company_id',
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  }, {
    freezeTableName: true,
    tableName: 'sales',
    version: true,
    defaultScope: {
      attributes: ['id', 'cfeId', 'clientDocument', 'purchaseDate', 'total', 'createdAt', 'updatedAt', 'version'],
    },
  });
  // eslint-disable-next-line func-names
  Sale.associate = function (models) {
    Sale.belongsTo(models.Company, { as: 'company' });
    Sale.hasMany(models.SaleItem, { as: 'items', onDelete: 'cascade' });
  };
  return Sale;
};
