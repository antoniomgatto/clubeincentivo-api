const CPF = require('@fnando/cpf/dist/node');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define(
    'Sale',
    {
      cfeId: {
        type: DataTypes.STRING,
        allowNull: false,
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
      cashback: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      cashbackDate: {
        field: 'cashback_date',
        type: DataTypes.DATE,
        allowNull: false,
      },
      onBalance: {
        type: DataTypes.BOOLEAN,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
      customerId: {
        type: DataTypes.INTEGER,
        field: 'customer_id',
        allowNull: false,
      },
      companyId: {
        type: DataTypes.INTEGER,
        field: 'company_id',
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'sales',
      version: true,
      hooks: {
        // eslint-disable-next-line no-unused-vars
        beforeValidate: (sale, options) => {
          if (sale.total != null) {
            sale.cashback = sale.total * 0.10; // only 10% for now
            sale.cashbackDate = moment().day(7); // cashback only after 7 days for now
          }
        }
      },
      defaultScope: {
        attributes: [
          'id',
          'cfeId',
          'purchaseDate',
          'total',
          'cashback',
          'cashbackDate',
          'onBalance',
          'createdAt',
          'updatedAt',
          'version',
        ],
      },
    },
  );
  // eslint-disable-next-line func-names
  Sale.associate = function (models) {
    Sale.belongsTo(models.Company, { as: 'company' });
    Sale.belongsTo(models.Customer, { as: 'customer' });
    Sale.hasMany(models.SaleItem, { as: 'items', onDelete: 'cascade' });
  };
  return Sale;
};
