import React from "react";
import Layout from "./../components/Layout/Layout";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import {
  Call,
  Mail,
  LocationOn,
  AccessTime,
} from "@mui/icons-material";
import { styled } from "@mui/system";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const Contact = () => {
  return (
    <Layout>
      <Box
        sx={{
          my: 5,
          ml: 10,
          "& h4": {
            fontWeight: "bold",
            mb: 2,
          },
          [theme => theme.breakpoints.down('md')]: {
            ml: 3,
          }
        }}
      >
        <Typography variant="h4">Contact FeastFlow</Typography>
        <p>
          Get in touch with us for the best food experience. 
          We value your feedback and are here to assist you.
        </p>
      </Box>

      <Grid container spacing={3} sx={{ px: { xs: 3, md: 10 }, py: 4 }}>
        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Typography variant="h5" gutterBottom>
              Send us a Message
            </Typography>
            <form>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                required
                type="email"
              />
              <TextField
                fullWidth
                label="Message"
                variant="outlined"
                margin="normal"
                required
                multiline
                rows={4}
              />
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "goldenrod",
                  "&:hover": {
                    bgcolor: "#DAA520",
                  },
                }}
              >
                Send Message
              </Button>
            </form>
          </StyledPaper>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <LocationOn sx={{ color: "goldenrod", mr: 2 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        123 FeastFlow Street,
                        <br />
                        Foodie District, FF 12345
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Call sx={{ color: "goldenrod", mr: 2 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        +1 234 567 8900
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Mail sx={{ color: "goldenrod", mr: 2 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        info@feastflow.com
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <AccessTime sx={{ color: "goldenrod", mr: 2 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        Monday - Sunday
                        <br />
                        10:00 AM - 10:00 PM
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>

          {/* Google Map */}
          <StyledPaper elevation={3} sx={{ mt: 4, p: 2 }}>
            <iframe
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=400701,%20Sector%208,%20Plot%201,%20Ghansoli,%20Navi%20Mumbai,%20Maharashtra%20400701+(SIGCE%20Canteen)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="canteen"
            ></iframe>
          </StyledPaper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Contact;