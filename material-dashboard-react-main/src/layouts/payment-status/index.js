import { useState, useEffect } from "react";
import { supabase } from "supabaseClient";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import paymentData from "layouts/payment-status/data/paymentDataTable";

function PaymentTable() {
  const { columns } = paymentData();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchPayments() {
      // We use .select(`*, Student(name)`) to get the student's name via Foreign Key
      const { data, error } = await supabase.from("Payment").select(`*, Student(name)`);

      if (error) {
        console.error("Error:", error);
      } else {
        const formattedRows = data.map((item) => ({
          student: item.Student?.name || "Unknown",
          amount: `RM ${item.amount_paid}`,
          date: item.payment_date,
          status: (
            <MDTypography
              variant="caption"
              color={item.payment_status === "Paid" ? "success" : "error"}
              fontWeight="medium"
            >
              {item.payment_status}
            </MDTypography>
          ),
          receipt: item.receipt_no,
        }));
        setRows(formattedRows);
      }
    }
    fetchPayments();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="medium">
                Payment Status Table
              </MDTypography>
              <MDButton variant="gradient" color="dark">
                <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                &nbsp;Add New Payment
              </MDButton>
            </MDBox>
            <MDBox>
              <DataTable
                table={{ columns, rows }}
                isSorted={false}
                entriesPerPage={true}
                showTotalEntries={true}
                noEndBorder
              />
            </MDBox>
          </Card>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default PaymentTable;
