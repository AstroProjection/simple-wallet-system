import { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

function InitializeWalletComponent(props) {
  const [username, setUsername] = useState("");
  const [initialBalance, setInitialBalance] = useState(20);

  async function InitializeWallet(username, balance) {
    // send a request to the initalization endpoint
    const response = await fetch("/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username, balance }),
    }).then((res) => res.json());
    if (response === "FAIL") {
      props.setError(true);
      return null;
    }
    // look at response to set ui state
    return response;
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const res = await InitializeWallet(username, initialBalance);
    if (res) {
      const { id, name, balance } = res;
      localStorage.setItem("walletid", id);
      props.setWalletName(name);
      props.setWalletBalance(balance);
      props.setActiveWallet(id);
    }
  }

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "500px",
        padding: "5px 8px",
        border: "black",
        borderRadius: "4px",
        backgroundColor: "lightgrey",
      }}
    >
      <Typography variant="h4">Initialize a wallet</Typography>
      <Container
        style={{
          padding: "5px 8px",
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={handleFormSubmit}
        noValidate
      >
        <label htmlFor="username">Username:</label>
        <TextField
          type="text"
          id="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          value={username}
        />
        <label htmlFor="initial-balance">Initial Balance:</label>
        <TextField
          type="text"
          id="initial-balance"
          value={initialBalance}
          onChange={(e) => {
            setInitialBalance(e.target.value);
          }}
        />
        <Button variant="contained" onClick={handleFormSubmit}>
          Submit
        </Button>
      </Container>
    </Container>
  );
}
export default InitializeWalletComponent;
