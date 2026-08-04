/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Icon from "@mui/material/Icon";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useState, useEffect } from "react";
import { supabase } from "supabaseClient";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import * as XLSX from "xlsx"; // Import the Excel library

// Dashboard components

function StudentTable() {
  const [dbData, setDbData] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function getStudents() {
      const { data, error } = await supabase.from("Student").select("*");

      if (error) {
        console.error("Error fetching:", error.message);
      } else if (data) {
        setDbData(data); // Save raw data for Excel export

        // Format for the UI Table
        const formattedRows = data.map((item) => ({
          name: item.name,
          email: item.email,
          ic: item.ic_passport,
          course: item.course_enrolled,
          session: item.session_date,
          mobile: item.mobile,
        }));
        setRows(formattedRows);
      }
    }
    getStudents();
  }, []);

  // --- EXPORT FUNCTION ---
  const downloadExcel = () => {
    if (dbData.length === 0) {
      alert("No data available to export");
      return;
    }

    // 1. Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(dbData);
    // 2. Create a new workbook
    const workbook = XLSX.utils.book_new();
    // 3. Append the sheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registered Students");
    // 4. Download the file
    XLSX.writeFile(workbook, "Student_Registration_Report.xlsx");
  };

  // Columns configuration for the DataTable component
  const columns = [
    { Header: "Name", accessor: "name", width: "25%" },
    { Header: "Email", accessor: "email", width: "25%" },
    { Header: "Course", accessor: "course", width: "20%" },
    { Header: "Mobile", accessor: "mobile", width: "15%" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Student Enrollment List</MDTypography>

            {/* EXCEL BUTTON */}
            <MDButton
              variant="gradient"
              color="success"
              onClick={downloadExcel}
              startIcon={<Icon>download</Icon>}
            >
              Export to Excel
            </MDButton>
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

export default StudentTable;
