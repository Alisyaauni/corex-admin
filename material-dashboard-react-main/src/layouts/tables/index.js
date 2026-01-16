import { useState, useEffect } from "react";
import { supabase } from "supabaseClient";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";

function CourseTable() {
  const [rows, setRows] = useState([]);

  // Modal States
  const [open, setOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  // --- FETCH DATA ---
  const getCourse = async () => {
    const { data, error } = await supabase.from("Course").select("*");
    if (error) {
      console.error("Error fetching:", error.message);
    } else {
      formatRows(data);
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this course? This may affect student records linked to it."
      )
    ) {
      const { error } = await supabase.from("Course").delete().eq("id", id);
      if (error) alert(error.message);
      else getCourse();
    }
  };

  // --- EDIT MODAL LOGIC ---
  const handleEditOpen = (course) => {
    setCurrentCourse(course);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCourse(null);
  };

  // --- OPEN FOR ADDING ---
  const handleAddOpen = () => {
    setCurrentCourse({ course_name: "", course_price: "", course_duration: "" }); // Empty form
    setOpen(true);
  };

  // --- SAVE LOGIC (Handles both Add and Update) ---
  const handleSave = async () => {
    // Create the data object WITHOUT the ID first
    const courseData = {
      course_name: currentCourse.course_name,
      course_price: currentCourse.course_price,
      course_duration: currentCourse.course_duration,
    };

    if (currentCourse.id) {
      // --- MODE: EDITING ---
      const { error } = await supabase.from("Course").update(courseData).eq("id", currentCourse.id); // Update the specific ID

      if (error) alert(error.message);
      else finishAction("updated");
    } else {
      // --- MODE: ADDING NEW ---
      // Notice we do NOT send currentCourse.id here at all
      const { error } = await supabase.from("Course").insert([courseData]);

      if (error) alert(error.message);
      else finishAction("added");
    }
  };

  const finishAction = (type) => {
    setOpen(false);
    getCourse(); // This refreshes your table
    alert(`Course successfully ${type}!`);
  };

  // --- FORMAT DATA FOR TABLE ---
  const formatRows = (data) => {
    const formatted = data.map((item) => ({
      coursename: item.course_name,
      courseprice: item.course_price,
      courseduration: item.course_duration,
      action: (
        <MDBox display="flex" alignItems="center">
          <Tooltip title="Edit Course">
            <IconButton color="info" onClick={() => handleEditOpen(item)}>
              <Icon>edit</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Course">
            <IconButton color="error" onClick={() => handleDelete(item.id)}>
              <Icon>delete</Icon>
            </IconButton>
          </Tooltip>
        </MDBox>
      ),
    }));
    setRows(formatted);
  };

  const columns = [
    { Header: "Name", accessor: "coursename", width: "35%" },
    { Header: "Price (RM)", accessor: "courseprice", width: "20%" },
    { Header: "Duration", accessor: "courseduration", width: "25%" },
    { Header: "Actions", accessor: "action", align: "right" },
  ];

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Course Available</MDTypography>

            {/* NEW ADD BUTTON */}
            <MDButton
              variant="gradient"
              color="dark"
              onClick={handleAddOpen}
              startIcon={<Icon>add</Icon>}
            >
              Add New Course
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

      {/* --- REUSABLE MODAL (ADD & EDIT) --- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <MDBox p={3}>
          <MDTypography variant="h5" mb={3}>
            {/* Dynamic Title */}
            {currentCourse?.id ? "Edit Course Info" : "Create New Course"}
          </MDTypography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDInput
                label="Course Name"
                fullWidth
                value={currentCourse?.course_name || ""}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, course_name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <MDInput
                label="Price (RM)"
                fullWidth
                type="number"
                value={currentCourse?.course_price || ""}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, course_price: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <MDInput
                label="Duration"
                fullWidth
                value={currentCourse?.course_duration || ""}
                onChange={(e) =>
                  setCurrentCourse({ ...currentCourse, course_duration: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
              <MDButton color="secondary" onClick={handleClose}>
                Cancel
              </MDButton>
              <MDButton color="info" variant="gradient" onClick={handleSave}>
                {/* Dynamic Button Label */}
                {currentCourse?.id ? "Save Changes" : "Confirm Add"}
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </Dialog>
    </DashboardLayout>
  );
}

export default CourseTable;
