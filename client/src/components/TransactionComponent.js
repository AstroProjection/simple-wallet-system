import { useState, useEffect } from "react";
import moment from "moment";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button"

function TransactionsComponent(props) {
  const [sortState, setSortState] = useState({});
  const [transactionItems, setTransactionItems] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;


  function getSortDirection(value){
    switch(value){
      case 1:
        return "ASC";
      case 2:
        return "DESC";
      case 0:
      default:
        return false;
    }
  }

  function getURLSortKey(sortKey){
    const sortKeys = {
      date:'Date',
      amount:'Amount'
    }
    return sortKeys[sortKey] 
  }

  function getSortString(){
    let sortString = ''
    for(const [sortKey,sortValue] of Object.entries(sortState)){
      const sortDirection = getSortDirection(sortValue);
      if(sortDirection){
        sortString += `${getURLSortKey(sortKey)}_${sortDirection},`;
      }
    }
    return sortString;
  }

  function getSortIcon(key){
    return sortState[key] === 1 ? "v" : sortState[key] === 2 ? "^" : "";
  }
  async function fetchTransactions(walletId, pageNumber) {
    const sortString = getSortString();
    const response = await fetch(
      `/transactions?walletid=${walletId}&skip=${
        pageSize * (pageNumber - 1)
      }&limit=${pageSize}&sort=${sortString}`
    ).then((res) => res.json());
    if (response === "FAIL") {
      return;
    }
    setTransactionItems(response);
  }
  const download = function (data) {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "download.csv");
    a.click();
  };
  const csvObjectValues = function (csvRows = [], obj) {
    const values = Object.values(obj).join(",");
    csvRows.push(values);
  };
  async function downloadAvailableTransactions() {
    if (transactionItems.length > 0) {
      const csvRows = [];
      /// get the keys for csv
      const headers = Object.keys(transactionItems[0]);
      csvRows.push(headers.join(","));
      const values = Object.values(transactionItems[0]).join(",");
      csvRows.push(values);

      for (let i = 1; i < transactionItems.length; i++) {
        csvObjectValues(csvRows, transactionItems[i]);
      }
      download(csvRows.join("\n"));
    }
  }

  useEffect(() => {
    fetchTransactions(props.walletId, pageNumber);
  }, [props.walletId, pageNumber, sortState]);

  function handleSort(key){
    return (e)=>{
      setSortState((prevState)=>{
        const newState = {...prevState}
        if(newState[key]){
          newState[key] = (newState[key] + 1)%3; 
        } else {
          newState[key] = 1;
        }
        return newState
      })
    }
  }
  return (
    <>
      <TableContainer
        style={{ height: "80vh", overflowY: "scroll", overflowX: "hidden" }}
        component={Paper}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell
                onClick={handleSort("date")}
                style={{ cursor: "pointer" }}
              >
                Date {getSortIcon("date")}
              </TableCell>
              <TableCell
                onClick={handleSort("amount")}
                style={{ cursor: "pointer" }}
              >
                Amount {getSortIcon("amount")}
              </TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Wallet ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionItems.map((transactionItem) => {
              return (
                <TableRow
                  key={transactionItem.id}
                  style={{ border: "1px solid black" }}
                >
                  {Object.entries(transactionItem).map((item, index) => (
                    <TableCell key={index} style={{ border: "1px solid grey" }}>
                      {item[0] === "date"
                        ? moment(item[1]).format("DD/MM/YYYY hh:mm:ss")
                        : item[1]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <Button
          variant="outlined"
          onClick={() => {
            setPageNumber((oldPageNumber) => {
              if (oldPageNumber > 1) {
                return --oldPageNumber;
              }
              return oldPageNumber;
            });
          }}
        >
          {`<-`}
        </Button>
        <p style={{ display: "flex", alignItems: "center" }}>{pageNumber}</p>
        <Button
          variant="outlined"
          onClick={() => {
            setPageNumber((oldPageNumber) => {
              if (transactionItems.length < pageSize) {
                return oldPageNumber;
              }
              return ++oldPageNumber;
            });
          }}
        >
          {`->`}
        </Button>
      </div>
      <div>
        <Button onClick={() => props.setTransactions(false)}>
          Back to Transact Page
        </Button>
      </div>
      <div>
        <Button onClick={downloadAvailableTransactions}>
          Download These Transactions
        </Button>
      </div>
    </>
  );
}
export default TransactionsComponent;
