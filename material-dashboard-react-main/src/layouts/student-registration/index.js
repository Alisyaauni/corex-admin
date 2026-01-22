import { useState, useEffect } from "react";
import { supabase } from "supabaseClient";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function StudentRegistration() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [student, setStudent] = useState({
    name: "",
    ic_passport: "",
    dob: "",
    gender: "",
    nationality: "",
    mobile: "",
    email: "",
    address: "",
    selectedCourse: "",
    selectedSession: "",
  });

  useEffect(() => {
    async function fetchData() {
      const { data: courseData } = await supabase.from("Course").select("*");
      const { data: calendarData } = await supabase.from("Calendar").select("*");
      setCourses(courseData || []);
      setSessions(calendarData || []);
    }
    fetchData();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;

    // LOGIC: If the user changes the course, reset the selected session
    if (name === "selectedCourse") {
      setStudent({ ...student, [name]: value, selectedSession: "" });
    } else {
      setStudent({ ...student, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("Student").insert([
      {
        name: student.name,
        ic_passport: student.ic_passport,
        dob: student.dob,
        gender: student.gender,
        nationality: student.nationality,
        mobile: student.mobile,
        email: student.email,
        address: student.address,
        course_enrolled: student.selectedCourse,
        session_date: student.selectedSession,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Registration successful!");
      setStudent({
        name: "",
        ic_passport: "",
        dob: "",
        gender: "",
        nationality: "",
        mobile: "",
        email: "",
        address: "",
        selectedCourse: "",
        selectedSession: "",
      });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} display="flex" justifyContent="center">
        <Card sx={{ width: "100%", maxWidth: "800px" }}>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            mx={2}
            mt={-3}
            p={3}
            textAlign="center"
          >
            <MDTypography variant="h4" color="white">
              Course Enrollment Form
            </MDTypography>
          </MDBox>

          <MDBox p={3} component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Details */}
              <Grid item xs={12} md={6}>
                <MDInput
                  name="name"
                  label="Full Name"
                  value={student.name}
                  onChange={handleInput}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MDInput
                  name="ic_passport"
                  label="IC/Passport"
                  value={student.ic_passport}
                  onChange={handleInput}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MDInput
                  type="date"
                  name="dob"
                  label="Date of Birth"
                  value={student.dob}
                  onChange={handleInput}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Course Selection Dropdown */}
              <Grid item xs={12} md={6}>
                <MDInput
                  select
                  name="selectedCourse"
                  label="Select Course"
                  value={student.selectedCourse}
                  onChange={handleInput}
                  fullWidth
                  required
                  SelectProps={{
                    displayEmpty: true,
                    sx: { padding: "12px 0" }, // Adjusts internal spacing
                  }}
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.course_name}>
                      {course.course_name}
                    </MenuItem>
                  ))}
                </MDInput>
              </Grid>

              {/* Session Selection Dropdown */}
              <Grid item xs={12} md={6}>
                <MDInput
                  select
                  name="selectedSession"
                  label="Available Sessions"
                  value={student.selectedSession}
                  onChange={handleInput}
                  fullWidth
                  required
                  SelectProps={{
                    displayEmpty: true,
                    sx: { padding: "12px 0" }, // Adjusts internal spacing
                  }}
                  disabled={!student.selectedCourse}
                >
                  {sessions
                    .filter((s) => s.course_title === student.selectedCourse)
                    .map((session) => (
                      <MenuItem key={session.id} value={`${session.date} ${session.time}`}>
                        {session.date} at {session.time}
                      </MenuItem>
                    ))}
                  {sessions.filter((s) => s.course_title === student.selectedCourse).length ===
                    0 && <MenuItem disabled>No sessions found for this course</MenuItem>}
                </MDInput>
              </Grid>

              {/* Contact & Address */}
              <Grid item xs={12} md={6}>
                <MDInput
                  name="mobile"
                  label="Mobile"
                  value={student.mobile}
                  onChange={handleInput}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MDInput
                  name="gender"
                  label="Gender"
                  value={student.gender}
                  onChange={handleInput}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MDInput
                  name="nationality"
                  label="Nationality"
                  value={student.nationality}
                  onChange={handleInput}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <MDInput
                  name="email"
                  type="email"
                  label="Email"
                  value={student.email}
                  onChange={handleInput}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  name="address"
                  label="Home Address"
                  value={student.address}
                  onChange={handleInput}
                  multiline
                  rows={2}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <MDButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Complete Registration"}
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default StudentRegistration;
