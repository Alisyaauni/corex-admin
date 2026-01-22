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
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

function SessionTable() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  // --- FETCH DATA FROM CALENDAR ---
  const getSessions = async () => {
    const { data, error } = await supabase
      .from("Calendar")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching sessions:", error.message);
    } else {
      formatRows(data);
    }
  };

  useEffect(() => {
    getSessions();
  }, []);

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      const { error } = await supabase.from("Calendar").delete().eq("id", id);
      if (error) alert(error.message);
      else getSessions();
    }
  };

  // --- MODAL CONTROLS ---
  const handleEditOpen = (session) => {
    setCurrentSession(session);
    setOpen(true);
  };

  const handleAddOpen = () => {
    setCurrentSession({ date: "", time: "", course_title: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentSession(null);
  };

  // --- SAVE / UPDATE LOGIC ---
  const handleSave = async () => {
    const sessionData = {
      date: currentSession.date,
      time: currentSession.time,
      course_title: currentSession.course_title,
    };

    if (currentSession.id) {
      // UPDATE
      const { error } = await supabase
        .from("Calendar")
        .update(sessionData)
        .eq("id", currentSession.id);

      if (error) alert(error.message);
      else finishAction("updated");
    } else {
      // INSERT
      const { error } = await supabase.from("Calendar").insert([sessionData]);

      if (error) alert(error.message);
      else finishAction("added");
    }
  };

  const finishAction = (type) => {
    setOpen(false);
    getSessions();
    alert(`Session successfully ${type}!`);
  };

  // --- FORMAT FOR DATA TABLE ---
  const formatRows = (data) => {
    const formatted = data.map((item) => ({
      course: item.course_title,
      date: item.date,
      time: item.time,
      action: (
        <MDBox display="flex" alignItems="center">
          <Tooltip title="Edit Session">
            <IconButton color="info" onClick={() => handleEditOpen(item)}>
              <Icon>edit</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Session">
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
    { Header: "Course Title", accessor: "course", width: "40%" },
    { Header: "Date", accessor: "date", width: "25%" },
    { Header: "Time", accessor: "time", width: "20%" },
    { Header: "Actions", accessor: "action", align: "right" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Training Sessions (Calendar)</MDTypography>
            <MDButton
              variant="gradient"
              color="dark"
              onClick={handleAddOpen}
              startIcon={<Icon>add</Icon>}
            >
              Add New Session
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

      {/* --- ADD/EDIT MODAL --- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <MDBox p={3}>
          <MDTypography variant="h5" mb={3}>
            {currentSession?.id ? "Edit Session" : "Create New Session"}
          </MDTypography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDInput
                label="Course Title"
                fullWidth
                placeholder="e.g. BOSIET With EBS"
                value={currentSession?.course_title || ""}
                onChange={(e) =>
                  setCurrentSession({ ...currentSession, course_title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MDInput
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentSession?.date || ""}
                onChange={(e) => setCurrentSession({ ...currentSession, date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MDInput
                label="Time"
                placeholder="e.g. 09:00 AM - 05:00 PM"
                fullWidth
                value={currentSession?.time || ""}
                onChange={(e) => setCurrentSession({ ...currentSession, time: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <MDButton color="secondary" onClick={handleClose}>
                Cancel
              </MDButton>
              <MDButton color="info" variant="gradient" onClick={handleSave}>
                {currentSession?.id ? "Save Changes" : "Confirm Add"}
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </Dialog>
    </DashboardLayout>
  );
}

export default SessionTable;
