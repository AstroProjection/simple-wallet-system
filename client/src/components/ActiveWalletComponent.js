import { useState } from "react";

import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Typography } from "@mui/material";

function ActiveWalletComponent(props) {
  const [amount, setAmount] = useState(0);
  const [transaction, setTransaction] = useState("Recharge");
  async function transactWallet(walletId, amount, transaction) {
    // send a request to the initalization endpoint
    const response = await fetch(`/transact/${walletId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: transaction, amount }),
    }).then((res) => res.json());
    if (response === "FAIL") {
      props.setError(true);
      return null;
    }
    // look at response to set ui state
    return response;
  }
  //
  async function handleFormSubmit(event) {
    event.preventDefault();
    const res = await transactWallet(props.walletId, amount, transaction);
    if (res) {
      const { balance } = res;
      props.setWalletBalance(balance);
    }
  }

  return (
    <>
      <Container
        fixed
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "lightgrey",
        }}
      >
        {props.walletName && (
          <Typography variant="h4">Wallet - {props.walletName}</Typography>
        )}
        <label htmlFor="balance">Initial Balance:</label>
        <TextField
          type="text"
          id="balance"
          disabled
          value={props.walletBalance}
        />
        <div>
          <ToggleButtonGroup
            value={transaction}
            exclusive
            onChange={(e, newValue) => setTransaction(newValue)}
            aria-label="text alignment"
          >
            <ToggleButton value="Recharge">CREDIT</ToggleButton>
            <ToggleButton value="Debit">DEBIT</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            type="number"
            inputProps={{ min: 0 }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "right" }}>
          <Button onClick={handleFormSubmit} variant="contained">
            Submit
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              props.setTransactions(true);
            }}
          >
            Transactions
          </Button>
        </div>
      </Container>
    </>
  );
}

export default ActiveWalletComponent;
