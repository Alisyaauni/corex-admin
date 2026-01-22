import { useState, useEffect } from "react";
import { supabase } from "supabaseClient";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDBadge from "components/MDBadge";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

function Certifications() {
  const [rows, setRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);

  // Form State
  const [currentCert, setCurrentCert] = useState({
    student_id: "",
    cert_name: "",
    issue_date: "",
    expiry_date: "",
  });

  // --- FETCH DATA ---
  const fetchCerts = async () => {
    const { data, error } = await supabase
      .from("Certifications") // Ensure this matches your table name exactly
      .select(`*, Student(id, name)`);

    if (error) {
      console.error("Error fetching certifications:", error);
    } else {
      formatRows(data);
    }
  };

  const fetchStudents = async () => {
    const { data } = await supabase.from("Student").select("id, name");
    setStudents(data || []);
  };

  useEffect(() => {
    fetchCerts();
    fetchStudents();
  }, []);

  // --- DELETE ---
  const handleDelete = async (id) => {
    if (window.confirm("Delete this certification record?")) {
      const { error } = await supabase.from("Certifications").delete().eq("id", id);
      if (error) alert(error.message);
      else fetchCerts();
    }
  };

  // --- SAVE (CREATE/UPDATE) ---
  const handleSave = async () => {
    const certData = {
      student_id: currentCert.student_id,
      cert_name: currentCert.cert_name,
      issue_date: currentCert.issue_date,
      expiry_date: currentCert.expiry_date,
    };

    let result;
    if (currentCert.id) {
      result = await supabase.from("Certifications").update(certData).eq("id", currentCert.id);
    } else {
      result = await supabase.from("Certifications").insert([certData]);
    }

    if (result.error) alert(result.error.message);
    else {
      setOpen(false);
      fetchCerts();
      setCurrentCert({ student_id: "", cert_name: "", issue_date: "", expiry_date: "" });
    }
  };

  // --- FORMAT ROWS ---
  const formatRows = (data) => {
    const today = new Date();
    const formatted = data.map((item) => {
      const isExpired = new Date(item.expiry_date) < today;
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
        action: (
          <MDBox display="flex">
            <Tooltip title="Edit">
              <IconButton
                color="info"
                onClick={() => {
                  setCurrentCert(item);
                  setOpen(true);
                }}
              >
                <Icon>edit</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleDelete(item.id)}>
                <Icon>delete</Icon>
              </IconButton>
            </Tooltip>
          </MDBox>
        ),
      };
    });
    setRows(formatted);
  };

  const columns = [
    { Header: "Holder", accessor: "holder", width: "25%" },
    { Header: "Certificate", accessor: "certificate", width: "25%" },
    { Header: "Issue Date", accessor: "issue", width: "15%" },
    { Header: "Expiry Date", accessor: "expiry", width: "15%" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Actions", accessor: "action", align: "right" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h5">Certification Records</MDTypography>
            <MDButton variant="gradient" color="dark" onClick={() => setOpen(true)}>
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>&nbsp;Add Certificate
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
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <MDBox p={3}>
          <MDTypography variant="h5" mb={3}>
            {currentCert.id ? "Edit Certificate" : "New Certificate"}
          </MDTypography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDInput
                select
                label="Select Student"
                fullWidth
                value={currentCert.student_id}
                SelectProps={{
                  displayEmpty: true,
                  sx: { padding: "12px 0" }, // Adjusts internal spacing
                }}
                onChange={(e) => setCurrentCert({ ...currentCert, student_id: e.target.value })}
              >
                {students.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </MDInput>
            </Grid>
            <Grid item xs={12}>
              <MDInput
                label="Certificate Name"
                fullWidth
                value={currentCert.cert_name}
                onChange={(e) => setCurrentCert({ ...currentCert, cert_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MDInput
                type="date"
                label="Issue Date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentCert.issue_date}
                onChange={(e) => setCurrentCert({ ...currentCert, issue_date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MDInput
                type="date"
                label="Expiry Date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentCert.expiry_date}
                onChange={(e) => setCurrentCert({ ...currentCert, expiry_date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <MDButton color="secondary" onClick={() => setOpen(false)}>
                Cancel
              </MDButton>
              <MDButton color="info" variant="gradient" onClick={handleSave}>
                Save
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </Dialog>
    </DashboardLayout>
  );
}

export default Certifications;
