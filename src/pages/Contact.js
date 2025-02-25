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
        }}
      >
        <Typography variant="h4">Contact FeastFlow</Typography>
        <p>
          Get in touch with us for the best dining experience in town. 
          We value your feedback and are here to assist you.
        </p>
      </Box>

      <Grid container spacing={4} sx={{ px: 10, py: 4 }}>
        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
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
          </Paper>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
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
          </Paper>

          {/* Google Map */}
          <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414!2d-122.01116148467422!3d37.33463524513264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb59127ce078f%3A0x18e1c3ce7becf1b!2sApple%20Park!5e0!3m2!1sen!2sin!4v1637309850935!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="restaurant-location"
            ></iframe>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Contact;