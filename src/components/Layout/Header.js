import React, { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tab,
  Tabs,
  Paper,
  Avatar,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import {
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  MenuBook as MenuBookIcon,
  ContactMail as ContactMailIcon,
  ShoppingCart as ShoppingCartIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  PersonOutline as PersonOutlineIcon,
  LockOutlined as LockOutlinedIcon,
  Email as EmailIcon
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "../../images/logo.png";
import "../../styles/HeaderStyles.css";
import { CartContext } from "../../context/cartContext";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Login/Register dialog state
  const [loginOpen, setLoginOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleLoginOpen = () => {
    setLoginOpen(true);
  };
  
  const handleLoginClose = () => {
    setLoginOpen(false);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleLogin = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // Here you would add actual authentication logic
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    setIsLoggedIn(true);
    setUsername(data.get('email').split('@')[0]);
    handleLoginClose();
  };
  
  const handleRegister = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // Here you would add actual registration logic
    console.log({
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    });
    setIsLoggedIn(true);
    setUsername(data.get('name'));
    handleLoginClose();
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  const menuItems = [
    { link: "/", name: "Home", icon: <HomeIcon /> },
    { link: "/menu", name: "Menu", icon: <MenuBookIcon /> },
    {
      link: "/myorders",
      name: "My Orders",
      icon: (
        <Badge 
          badgeContent={cart.length} 
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#552a0f',
              color: 'white',
              fontWeight: 'bold',
            }
          }}
        >
          <ShoppingCartIcon />
        </Badge>
      ),
    },
    { link: "/about", name: "About", icon: <InfoIcon /> },
    { link: "/contact", name: "Contact", icon: <ContactMailIcon /> },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ 
        py: 2.5, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'
      }}>
        {/* Logo in drawer */}
        <Box
          component="img"
          src={Logo}
          alt="FeastFlow"
          sx={{ 
            height: '45px',
            mb: 1
          }}
        />
        
        <Typography
          variant="subtitle1"
          sx={{
            color: '#552a0f',
            fontWeight: "600",
            fontFamily: "'Playfair Display', serif",
          }}
        >
         
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(0,0,0,0.1)' }} />
      
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.link}
              sx={{
                py: 1.5,
                "&.active": {
                  color: '#552a0f',
                  backgroundColor: "rgba(85, 42, 15, 0.06)",
                  borderRight: '4px solid #552a0f',
                },
                '&:hover': {
                  backgroundColor: "rgba(85, 42, 15, 0.03)",
                }
              }}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.link ? '#552a0f' : '#666',
                  minWidth: '40px'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: location.pathname === item.link ? 600 : 500,
                  fontSize: '0.95rem',
                  color: location.pathname === item.link ? '#552a0f' : '#333'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Login/Account in drawer */}
        <ListItem disablePadding>
          {isLoggedIn ? (
            <ListItemButton
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: "rgba(85, 42, 15, 0.03)",
                }
              }}
              onClick={handleLogout}
            >
              <ListItemIcon sx={{ color: '#666', minWidth: '40px' }}>
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText 
                primary={`Logout (${username})`}
                primaryTypographyProps={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#333'
                }}
              />
            </ListItemButton>
          ) : (
            <ListItemButton
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: "rgba(85, 42, 15, 0.03)",
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleLoginOpen();
              }}
            >
              <ListItemIcon sx={{ color: '#666', minWidth: '40px' }}>
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Login / Register"
                primaryTypographyProps={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#333'
                }}
              />
            </ListItemButton>
          )}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <AppBar
          component="nav"
          sx={{
            bgcolor: scrolled ? "rgba(255,255,255,0.95)" : "white",
            boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "0 2px 4px rgba(0,0,0,0.05)",
            transition: 'all 0.3s ease',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: { xs: "10px 0", sm: "8px 0" },
                minHeight: { xs: '64px', sm: '70px' },
              }}
            >
              {/* Mobile Menu Icon */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                sx={{ 
                  display: { sm: "none" }, 
                  color: "#552a0f",
                  '&:hover': {
                    backgroundColor: 'rgba(85, 42, 15, 0.04)'
                  }
                }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>

              {/* Logo and Brand Container */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexGrow: { xs: 1, sm: 0 },
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}>
                <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src={Logo}
                    alt="FeastFlow"
                    height="48px"
                    sx={{ 
                      mr: { xs: 1, sm: 2 },
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#552a0f',
                      fontWeight: "bold",
                      display: { xs: 'none', md: 'block' },
                      fontFamily: "'Playfair Display', serif",
                      letterSpacing: '0.5px',
                      fontSize: '1.3rem'
                    }}
                  >
                    
                  </Typography>
                </NavLink>
              </Box>

              {/* Desktop Navigation */}
              <Box 
                sx={{ 
                  display: { xs: "none", sm: "flex" },
                  gap: { sm: 1, md: 2 },
                  alignItems: 'center'
                }}
              >
                {menuItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.link}
                    className={({ isActive }) =>
                      isActive ? "navigation-link active" : "navigation-link"
                    }
                    style={{
                      textDecoration: 'none',
                      color: '#333',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {item.name === "My Orders" ? (
                      <Badge 
                        badgeContent={cart.length} 
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#552a0f',
                            color: 'white',
                            fontWeight: 'bold'
                          }
                        }}
                      >
                        {item.name}
                      </Badge>
                    ) : (
                      item.name
                    )}
                  </NavLink>
                ))}
                
                {/* Login/Account Button */}
                {isLoggedIn ? (
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    sx={{
                      bgcolor: 'rgba(85, 42, 15, 0.06)',
                      color: '#552a0f',
                      fontWeight: 500,
                      ml: { sm: 1, md: 2 },
                      px: 2,
                      py: 0.7,
                      borderRadius: '20px',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(85, 42, 15, 0.1)'
                      }
                    }}
                    startIcon={<PersonOutlineIcon />}
                  >
                    {username}
                  </Button>
                ) : (
                  <Button
                    color="inherit"
                    onClick={handleLoginOpen}
                    sx={{
                      bgcolor: '#552a0f',
                      color: 'white',
                      fontWeight: 500,
                      ml: { sm: 1, md: 2 },
                      px: 2,
                      py: 0.7,
                      borderRadius: '20px',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#3e1e09'
                      }
                    }}
                    startIcon={<PersonOutlineIcon />}
                  >
                    Login
                  </Button>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Mobile Drawer */}
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0,0,0,0.3)'
              },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 280,
                bgcolor: "white",
                borderRadius: '0 8px 8px 0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Login/Register Dialog */}
        <Dialog 
          open={loginOpen} 
          onClose={handleLoginClose}
          maxWidth="xs"
          fullWidth
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '12px',
              overflow: 'hidden'
            }
          }}
        >
          <Box sx={{ 
            bgcolor: '#552a0f',
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600
              }}
            >
              {tabValue === 0 ? 'Login' : 'Register'}
            </Typography>
            <IconButton 
              onClick={handleLoginClose}
              sx={{ color: 'white' }}
            >
              <Divider orientation="vertical" sx={{ height: 16, borderColor: 'rgba(255,255,255,0.5)' }} />
            </IconButton>
          </Box>
          
          <DialogContent sx={{ p: 3, mt: 1 }}>
            <Box 
              sx={{ 
                width: '100%', 
                display: 'flex',
                justifyContent: 'center',
                mb: 3
              }}
            >
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#555',
                    mx: 1
                  },
                  '& .Mui-selected': {
                    color: '#552a0f',
                    fontWeight: 600
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#552a0f'
                  }
                }}
              >
                <Tab label="Login" />
                <Tab label="Register" />
              </Tabs>
            </Box>
            
            {tabValue === 0 && (
              <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#552a0f',
                      },
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                      color: '#552a0f',
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#552a0f',
                      },
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                      color: '#552a0f',
                    },
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      value="remember" 
                      color="primary" 
                      sx={{
                        '&.Mui-checked': {
                          color: '#552a0f',
                        }
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.9rem',
                      color: '#666'
                    }
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    bgcolor: '#552a0f',
                    '&:hover': {
                      bgcolor: '#3e1e09'
                    },
                    py: 1.2,
                    textTransform: 'none',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '1rem'
                  }}
                >
                  Log In
                </Button>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: '#666', fontSize: '0.9rem' }}
                  >
                    Don't have an account yet?{' '}
                    <Box
                      component="span"
                      onClick={() => setTabValue(1)}
                      sx={{
                        color: '#552a0f',
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Sign Up
                    </Box>
                  </Typography>
                </Box>
              </Box>
            )}
            
            {tabValue === 1 && (
              <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#552a0f',
                      },
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                      color: '#552a0f',
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#552a0f',
                      },
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                      color: '#552a0f',
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#552a0f',
                      },
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                      color: '#552a0f',
                    },
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      value="terms" 
                      color="primary" 
                      required
                      sx={{
                        '&.Mui-checked': {
                          color: '#552a0f',
                        }
                      }}
                    />
                  }
                  label="I agree to the terms and conditions"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.9rem',
                      color: '#666'
                    }
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    bgcolor: '#552a0f',
                    '&:hover': {
                      bgcolor: '#3e1e09'
                    },
                    py: 1.2,
                    textTransform: 'none',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '1rem'
                  }}
                >
                  Sign Up
                </Button>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: '#666', fontSize: '0.9rem' }}
                  >
                    Already have an account?{' '}
                    <Box
                      component="span"
                      onClick={() => setTabValue(0)}
                      sx={{
                        color: '#552a0f',
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Log In
                    </Box>
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Scroll to top button */}
        {showScrollTop && (
          <IconButton
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              backgroundColor: 'rgba(85, 42, 15, 0.8)',
              color: 'white',
              zIndex: 99,
              '&:hover': {
                backgroundColor: 'rgba(85, 42, 15, 0.95)',
              },
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
            onClick={scrollToTop}
            aria-label="scroll to top"
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        )}

        {/* Push content down */}
        <Box>
          <Toolbar />
        </Box>
      </Box>
    </>
  );
};

export default Header;