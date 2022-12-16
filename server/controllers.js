const {
  getTransactionType,
  getWalletByID,
  getWalletByName,
  getTransactionsForWalletID,
  createAWalletWithNameAndBalance,
  createNewTransaction,
  updateWalletBalance,
} = require("./utils");

const sortKeys = {
  Date:'date',
  Amount:'amount'
}
const sortDirections = {
  ASC: 1,
  DESC: -1,
};

module.exports = {
  setupHandler: async (req, res) => {
    let response = "FAIL";
    const { name, balance } = req.body;
    if (!name || !balance) {
      console.log("required input `name` and `balance` not found");
      res.statusCode = 500;
      return res.json(response);
    }
    // add checks to see if wallet name already exists
    const walletWithSameName = await getWalletByName(name);
    if (walletWithSameName.length > 0) {
      console.log("wallet with the same name already exists");
      res.statusCode = 500;
      return res.json(response);
    }

    // check if balance is a valid entry
    /// setup the intialization of a wallet
    // create an initial transaction item in the transaction table
    const responseForRequest = await createAWalletWithNameAndBalance(
      name,
      balance
    );
    // return the transactionId + wallet details
    res.json(responseForRequest);
  },
  transactHandler: async (req, res) => {
    let response = "FAIL";
    // description, amount
    const { description, amount } = req.body;
    const walletID = req.params.walletid;

    const walletItem = await getWalletByID(walletID);
    if (!walletItem) {
      console.log("wallet does not exist for id", walletID);
      res.statusCode = 403;
      return res.json(response);
    }
    // +ve amount => credit
    // -ve amount => debit
    // description = 'Recharge' is to update the balance
    const numericAmount = Number(amount);
    if(isNaN(numericAmount) || numericAmount < 0){
      console.log('Invalid numberic number');
      res.statusCode = 500;
      return res.json(response);
    }

    const calculatedAmount = description === "Debit" ? numericAmount * -1 : numericAmount;
    const transactionType = getTransactionType(calculatedAmount);
    // update wallet item
    const finalBalance = await updateWalletBalance({ id: walletItem._id, amount: parseFloat(calculatedAmount).toFixed(4) });
    // add entry to transactions table
    const newTransaction = await createNewTransaction({
      description: description,
      type: transactionType,
      amount: calculatedAmount,
      newBalance: finalBalance,
      walletID: walletItem._id,
    });
    // returns new balance + transactionId
    response = {
      balance: finalBalance,
      transactionId: newTransaction.transactionId,
    };
    return res.json(response);
  },
  getTransactionsHandler: async (req, res) => {
    // from queryParams walletid , skip , limit
    let response = "FAIL";
    const { walletid, skip, limit, sort } = req.query;
    if (!walletid) {
      res.statusCode = 404;
      return res.json(response);
    }
    let sortObject ={}
    if(sort){
      const tempArr = sort.split(',')
      tempArr.reduce((sortObject,item)=>{
        const keyOrderPair = item.split('_');
        const key = sortKeys[keyOrderPair?.[0]];
        const order = sortDirections[keyOrderPair?.[1]];
        if(key && order){
          sortObject[key] = order
        }
        return sortObject;
      },sortObject)
    }
    const paginatedItems = await getTransactionsForWalletID({
      walletID: walletid,
      skip: skip || 0,
      limit: limit || 0,
      sortObject,
    });
    // return transaction Items
    response = paginatedItems;
    res.statusCode = 200;
    return res.json(response);
  },
  getWalletHandler: async (req, res) => {
    let response = "FAIL";
    // return wallet details
    const walletID = req.params.id;
    const walletItem = await getWalletByID(walletID);
    if (walletItem) {
      res.statusCode = 200;
      const { date, balance, name, _id } = walletItem;
      response = { date, balance, name, id: _id };
    }
    return res.send(response);
  },
};
