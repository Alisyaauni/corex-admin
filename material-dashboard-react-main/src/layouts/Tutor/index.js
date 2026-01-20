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
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

function Overview() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header
        profile1={
          <MDBox mt={5} mb={3}>
            <ProfileInfoCard
              title="profile information"
              description="Founder of the company and lead tutor. Responsible for creating the training programs, teaching students, and providing guidance and mentorship throughout the learning process."
              info={{
                fullName: "Zulkifli Bin Mohammad",
                mobile: "012-6121327",
                email: "zulkifli.m38@gmail.com",
                location: "Malaysia",
              }}
              social={[{ link: "#", icon: <FacebookIcon />, color: "facebook" }]}
              action={{ route: "", tooltip: "Edit Profile" }}
              shadow={false}
            />
          </MDBox>
        }
        profile2={
          <MDBox mt={5} mb={3}>
            <ProfileInfoCard
              title="profile information"
              description="Assistant tutor who supports teaching activities and helps in delivering lessons, guiding students, and ensuring smooth training sessions."
              info={{
                fullName: "Mohd Azim Hafizi Bin Zulkifli",
                mobile: "012-6041327",
                email: "azimhafiz0101@gmail.com",
                location: "Malaysia",
              }}
              social={[{ link: "#", icon: <FacebookIcon />, color: "facebook" }]}
              action={{ route: "", tooltip: "Edit Profile" }}
              shadow={false}
            />
          </MDBox>
        }
      />
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
