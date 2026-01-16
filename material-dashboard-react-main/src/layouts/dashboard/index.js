import { useState, useEffect } from "react";
import { supabase } from "supabaseClient";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import * as XLSX from "xlsx";

function StudentTable() {
  const [dbData, setDbData] = useState([]);
  const [rows, setRows] = useState([]);

  // Modal States
  const [open, setOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // --- FETCH DATA ---
  const getStudents = async () => {
    const { data, error } = await supabase.from("Student").select("*");
    if (error) {
      console.error("Error fetching:", error.message);
    } else if (data) {
      setDbData(data);
      formatRows(data);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student record?")) {
      const { error } = await supabase.from("Student").delete().eq("id", id);
      if (error) alert(error.message);
      else getStudents();
    }
  };

  // --- EDIT MODAL LOGIC ---
  const handleEditOpen = (student) => {
    setCurrentStudent(student);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentStudent(null);
  };

  const handleUpdate = async () => {
    // Use course_enrolled specifically to match your Supabase column name
    const { error } = await supabase
      .from("Student")
      .update({
        name: currentStudent.name,
        email: currentStudent.email,
        mobile: currentStudent.mobile,
        // Ensure we are sending the data back to the correct column
        course_enrolled: currentStudent.course || currentStudent.course_enrolled,
      })
      .eq("id", currentStudent.id);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      setOpen(false);
      // Refreshing the data is the key to updating the table UI
      await getStudents();
      alert("Student updated successfully!");
    }
  };

  // --- FORMAT DATA FOR TABLE ---
  const formatRows = (data) => {
    const formatted = data.map((item) => ({
      name: item.name,
      email: item.email,
      course: item.course_enrolled,
      mobile: item.mobile,
      action: (
        <MDBox display="flex" alignItems="center">
          <Tooltip title="Edit Student">
            <IconButton color="info" onClick={() => handleEditOpen(item)}>
              <Icon>edit</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Student">
            <IconButton color="error" onClick={() => handleDelete(item.id)}>
              <Icon>delete</Icon>
            </IconButton>
          </Tooltip>
        </MDBox>
      ),
    }));
    setRows(formatted);
  };

  // --- EXPORT TO EXCEL ---
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dbData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Student_Report.xlsx");
  };

  const columns = [
    { Header: "Name", accessor: "name", width: "25%" },
    { Header: "Email", accessor: "email", width: "25%" },
    { Header: "Course", accessor: "course", width: "20%" },
    { Header: "Mobile", accessor: "mobile", width: "15%" },
    { Header: "Actions", accessor: "action", align: "right" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Student Management</MDTypography>
            <MDButton variant="gradient" color="success" onClick={downloadExcel}>
              <Icon>download</Icon>&nbsp;Export Excel
            </MDButton>
          </MDBox>
          <DataTable table={{ columns, rows }} isSorted showTotalEntries entriesPerPage />
        </Card>
      </MDBox>

      {/* --- EDIT MODAL --- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <MDBox p={3}>
          <MDTypography variant="h5" mb={3}>
            Edit Student Info
          </MDTypography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDInput
                label="Full Name"
                fullWidth
                value={currentStudent?.name || ""}
                onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <MDInput
                label="Email"
                fullWidth
                value={currentStudent?.email || ""}
                onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <MDInput
                label="Mobile"
                fullWidth
                value={currentStudent?.mobile || ""}
                onChange={(e) => setCurrentStudent({ ...currentStudent, mobile: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
              <MDButton color="secondary" onClick={handleClose}>
                Cancel
              </MDButton>
              <MDButton color="info" variant="gradient" onClick={handleUpdate}>
                Save Changes
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </Dialog>
    </DashboardLayout>
  );
}

export default StudentTable;
