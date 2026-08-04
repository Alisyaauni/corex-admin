import { useState, useEffect } from "react";
import { supabase } from "supabaseClient";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import Card from "@mui/material/Card";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import certData from "layouts/certificates/data/certDataTable";

function Certifications() {
  const { columns } = certData();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchCerts() {
      const { data, error } = await supabase.from("Certifications").select(`*, Student(name)`);

      if (error) {
        console.error("Error fetching certifications:", error);
      } else {
        const today = new Date();
        const formattedRows = data.map((item) => {
          const expiration = new Date(item.expiry_date);
          const isExpired = expiration < today;

          return {
            holder: item.Student?.name || "N/A",
            certificate: item.cert_name,
            issue: item.issue_date,
            expiry: item.expiry_date,
            status: (
              <MDBadge
                badgeContent={isExpired ? "Expired" : "Active"}
                color={isExpired ? "error" : "success"}
                variant="gradient"
                size="sm"
              />
            ),
          };
        });
        setRows(formattedRows);
      }
    }
    fetchCerts();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3}>
            <MDTypography variant="h5">Certification Records</MDTypography>
          </MDBox>
          <MDBox>
            <DataTable
              table={{ columns, rows }}
              isSorted={true}
              entriesPerPage={true}
              showTotalEntries={true}
              noEndBorder
            />
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default Certifications;
