export default function data() {
  return {
    columns: [
      { Header: "Student Name", accessor: "student", width: "30%", align: "left" },
      { Header: "Amount (RM)", accessor: "amount", align: "left" },
      { Header: "Date", accessor: "date", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Receipt", accessor: "receipt", align: "center" },
    ],
    rows: [], // This will be filled by Supabase
  };
}
