export default function data() {
  return {
    columns: [
      { Header: "Holder Name", accessor: "holder", align: "left" },
      { Header: "Certificate Name", accessor: "certificate", align: "left" },
      { Header: "Issue Date", accessor: "issue", align: "center" },
      { Header: "Expiry Date", accessor: "expiry", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
    ],
    rows: [],
  };
}
