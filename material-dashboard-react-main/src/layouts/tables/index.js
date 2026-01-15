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
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import { useState, useEffect } from "react";
import { supabase } from "supabaseClient";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

function CourseTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function getCourse() {
      // Perform a SELECT * query
      const { data, error } = await supabase.from("Course").select("*");

      if (error) {
        console.error("Error fetching:", error.message);
      } else {
        // Format the data for the Material Dashboard DataTable
        const formattedData = data.map((item) => ({
          coursename: item.course_name,
          courseprice: item.course_price,
          courseduration: item.course_duration,
        }));
        setRows(formattedData);
      }
    }
    getCourse();
  }, []);

  // Columns configuration for the DataTable component
  const columns = [
    { Header: "Name", accessor: "coursename", width: "25%" },
    { Header: "Course Price(RM)", accessor: "courseprice", width: "25%" },
    { Header: "Course Duration", accessor: "courseduration", width: "20%" },
  ];

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3}>
            <MDTypography variant="h5">Course Available</MDTypography>
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

export default CourseTable;
