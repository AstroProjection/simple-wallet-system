import { useState } from "react";
import TransactionsComponent from "./TransactionComponent";
import ActiveWalletComponent from "./ActiveWalletComponent";

function LoadedWalletComponent(props) {
  const [transactions, setTransactions] = useState(false);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", maxWidth: "900px" }}
    >
      {transactions ? (
        <TransactionsComponent
          setTransactions={setTransactions}
          walletId={props.walletId}
        />
      ) : (
        <ActiveWalletComponent
          walletId={props.walletId}
          setTransactions={setTransactions}
          walletName={props.walletName}
          walletBalance={props.walletBalance}
          setError={props.setError}
          setWalletBalance={props.setWalletBalance}
        />
      )}
    </div>
  );
}

export default LoadedWalletComponent;
