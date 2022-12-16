const Wallet = require('./db/schema/wallet')
const Transaction = require('./db/schema/transaction')
const uuid = require('uuid')

const getWalletByID = async function(walletID){
  try {
    const walletItem = await Wallet.findById(walletID);
    return walletItem;
  } catch (error) {
    console.log('error getting wallet by ID', id, error);
    return null;
  }
}
module.exports.getWalletByID = getWalletByID

module.exports.updateWalletBalance = async function({id, amount}){
  // with the latest walletItem for the id, we want to compare a property that should still be the latest updated property before we add a modification to it
  // handling race condition
  let latestWalletItem = null;
  do {
    latestWalletItem = await getWalletByID(id);
    const newBalance = (
      parseFloat(latestWalletItem.balance) + parseFloat(amount)
    ).toFixed(4);

    //
    latestWalletItem = await Wallet.findOneAndUpdate(
      { _id: id , updatedAt: { $lte : latestWalletItem.updatedAt}},
      { updatedAt: new Date(), balance: newBalance },
      { new: true }
    );
  } while (!latestWalletItem);
  return latestWalletItem.balance;
}

module.exports.createNewTransaction = async function({
  description,
  type,
  amount,
  newBalance,
  walletID,
}) {
  const transactionID = uuid.v4();

  const newTransaction = new Transaction({
    _id: transactionID,
    description,
    type,
    amount,
    balance: newBalance,
    wallet: walletID,
    date: new Date(),
  });
  await newTransaction.save();
  return {
    balance: newBalance,
    transactionId: transactionID,
  };
}


module.exports.getWalletByName = async function (name){
  const walletItem = await Wallet.find({
    name: name
  }).exec();
  return walletItem
}

module.exports.createAWalletWithNameAndBalance = async function(name,balance){
  const walletID = uuid.v4();
  const date = new Date();
  const newWallet = new Wallet({
    name:name,
    balance: balance,
    date: date,
    updatedAt: date,
    _id: walletID
  })
  await newWallet.save();
  /// create a transaction entry of initial credit
  const transactionID = uuid.v4();
  const newTransaction = new Transaction({
    date: date,
    _id: transactionID,
    type:'CREDIT',
    wallet:walletID,
    amount: balance,
    balance: balance,
    description:'Setup'
  });
  await newTransaction.save();

  return {
    id: walletID,
    transactionId:transactionID,
    balance,
    name,
    date
  };
}

module.exports.getTransactionsForWalletID = async function ({
  walletID,
  skip,
  limit,
  sortObject,
}) {
  const transactionItems = await Transaction.find({ wallet: walletID })
    .sort(sortObject)
    .skip(skip)
    .limit(limit)
    .select("_id wallet amount balance date");
  return transactionItems;
};
module.exports.getTransactionType = function(amount) {
  return amount < 0 ? "DEBIT" : amount > 0 ? "CREDIT" : "Nothing";
}
