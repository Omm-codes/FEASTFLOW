import React, { useState } from "react";
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
  Container,
  Divider,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import {
  Call,
  Mail,
  LocationOn,
  AccessTime,
  Send,
  ArrowForward
} from "@mui/icons-material";
import { styled } from "@mui/system";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
  border: '1px solid #f0f0f0',
  height: '100%',
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
  },
}));

const FormTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#552a0f',
    },
  },
  '& .MuiFormLabel-root.Mui-focused': {
    color: '#552a0f',
  },
}));

const InfoRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': { 
    border: 0 
  },
  '& .MuiTableCell-root': { 
    padding: theme.spacing(2, 0),
    borderBottom: '1px dashed #f0f0f0',
    verticalAlign: 'top'
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(85, 42, 15, 0.08)',
  borderRadius: '50%',
  width: 46,
  height: 46,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: theme.spacing(2),
}));

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Thank you! Your message has been sent successfully.',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Layout>
      <Box sx={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1542181961-9590d0c79dab?auto=format&fit=crop&w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        py: 6,
        mb: 6
      }}>
        <Container>
          <Typography 
            variant="h3"
            align="center" 
            sx={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              mb: 2
            }}
          >
            Get In Touch
          </Typography>
          
          <Typography 
            variant="subtitle1"
            align="center" 
            sx={{ 
              maxWidth: 700,
              mx: 'auto',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.1rem',
              lineHeight: 1.6,
              opacity: 0.9
            }}
          >
            We'd love to hear from you! Whether you have a question about our menu, 
            want to provide feedback, or are interested in catering, we're here to help.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={5} lg={4}>
            <StyledPaper>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  color: '#333',
                  position: 'relative',
                  pb: 2,
                  mb: 3,
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "60px",
                    borderBottom: "3px solid #ffd54f"
                  }
                }}
              >
                Contact Information
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  fontFamily: "'Poppins', sans-serif",
                  color: '#666',
                  lineHeight: 1.6
                }}
              >
                Feel free to reach out using any of the information below. We aim to respond 
                to all inquiries within 24 hours.
              </Typography>
              
              <TableContainer component="div" sx={{ mb: 3 }}>
                <Table sx={{ minWidth: '100%' }}>
                  <TableBody>
                    <InfoRow>
                      <TableCell width="60px">
                        <IconContainer>
                          <LocationOn sx={{ color: "#552a0f" }} />
                        </IconContainer>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 500,
                            color: '#333',
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Our Location
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            fontFamily: "'Poppins', sans-serif",
                            lineHeight: 1.6
                          }}
                        >
                          Sector 8, Plot 1, Ghansoli<br />
                          Navi Mumbai, Maharashtra 400701
                        </Typography>
                      </TableCell>
                    </InfoRow>
                    
                    <InfoRow>
                      <TableCell>
                        <IconContainer>
                          <Call sx={{ color: "#552a0f" }} />
                        </IconContainer>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 500,
                            color: '#333',
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Phone Number
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          +91 98765 43210
                        </Typography>
                      </TableCell>
                    </InfoRow>
                    
                    <InfoRow>
                      <TableCell>
                        <IconContainer>
                          <Mail sx={{ color: "#552a0f" }} />
                        </IconContainer>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 500,
                            color: '#333',
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Email Address
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          info@feastflow.com
                        </Typography>
                      </TableCell>
                    </InfoRow>
                    
                    <InfoRow>
                      <TableCell>
                        <IconContainer>
                          <AccessTime sx={{ color: "#552a0f" }} />
                        </IconContainer>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 500,
                            color: '#333',
                            mb: 0.5,
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Opening Hours
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            fontFamily: "'Poppins', sans-serif",
                            lineHeight: 1.6
                          }}
                        >
                          Monday - Friday: 7:30 AM - 9:00 PM<br />
                          Saturday - Sunday: 8:00 AM - 10:00 PM
                        </Typography>
                      </TableCell>
                    </InfoRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ 
                mt: 4, 
                p: 2, 
                borderRadius: 2, 
                bgcolor: 'rgba(85, 42, 15, 0.04)',
                border: '1px dashed rgba(85, 42, 15, 0.2)'
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#552a0f',
                    fontFamily: "'Poppins', sans-serif",
                    fontStyle: 'italic'
                  }}
                >
                  "We value your feedback and are constantly working to improve our services.
                  If you have any suggestions, please let us know!"
                </Typography>
              </Box>
            </StyledPaper>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7} lg={8}>
            <StyledPaper>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  color: '#333',
                  position: 'relative',
                  pb: 2,
                  mb: 3,
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "60px",
                    borderBottom: "3px solid #ffd54f"
                  }
                }}
              >
                Send us a Message
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4,
                  fontFamily: "'Poppins', sans-serif",
                  color: '#666',
                  maxWidth: 700
                }}
              >
                Fill out the form below, and we'll respond to your message as soon as possible.
                All fields marked with an asterisk (*) are required.
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      placeholder="Enter your name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormTextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      type="email"
                      placeholder="Enter your email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      variant="outlined"
                      placeholder="What is this regarding?"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      multiline
                      rows={6}
                      placeholder="Tell us what you need help with..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                      sx={{
                        backgroundColor: '#552a0f',
                        color: 'white',
                        py: 1.5,
                        px: 4,
                        borderRadius: '30px',
                        fontSize: '1rem',
                        textTransform: 'none',
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 500,
                        boxShadow: '0 4px 15px rgba(85, 42, 15, 0.3)',
                        '&:hover': {
                          backgroundColor: '#3e1e09',
                          boxShadow: '0 6px 20px rgba(85, 42, 15, 0.4)',
                        }
                      }}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </StyledPaper>
          </Grid>
        </Grid>
        
        {/* Map Section */}
        <Box sx={{ mt: 5 }}>
          <Typography 
            variant="h5" 
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              color: '#333',
              mb: 3,
              textAlign: 'center'
            }}
          >
            Find Us
          </Typography>
          
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              height: 400,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <iframe
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=400701,%20Sector%208,%20Plot%201,%20Ghansoli,%20Navi%20Mumbai,%20Maharashtra%20400701+(SIGCE%20Canteen)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="canteen-location"
            ></iframe>
          </Paper>
        </Box>
        
        {/* FAQ Section */}
        <Box 
          sx={{ 
            mt: 8,
            p: 4, 
            borderRadius: 3, 
            bgcolor: '#f9f7f4',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Typography 
            variant="h5" 
            align="center"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              color: '#333',
              mb: 4,
              position: "relative",
              pb: 2,
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                borderBottom: "3px solid #ffd54f"
              }
            }}
          >
            Frequently Asked Questions
          </Typography>
          
          <Grid container spacing={4}>
            {[
              {
                question: "How can I place a bulk order for an event?",
                answer: "For bulk orders or catering inquiries, please contact us at least 48 hours in advance. You can reach us by email or phone, and we'll provide you with options and pricing based on your requirements."
              },
              {
                question: "Do you offer vegetarian and vegan options?",
                answer: "Yes, we offer a wide range of vegetarian options and several vegan choices. All dietary options are clearly marked on our menu for your convenience."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit/debit cards, UPI payments, and cash. For pre-orders and catering, we also offer bank transfer options."
              },
              {
                question: "Can I modify my order after it's been placed?",
                answer: "Order modifications are possible if made at least 30 minutes before the scheduled pickup/delivery time. Please contact us directly for any changes."
              }
            ].map((faq, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      mb: 1,
                      color: '#552a0f', 
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    {faq.question}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontFamily: "'Poppins', sans-serif",
                      lineHeight: 1.7
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="text"
              endIcon={<ArrowForward />}
              sx={{
                color: '#552a0f',
                fontFamily: "'Poppins', sans-serif",
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(85, 42, 15, 0.05)',
                }
              }}
            >
              View more FAQs
            </Button>
          </Box>
        </Box>
      </Container>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Contact;