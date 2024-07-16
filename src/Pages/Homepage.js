import React,{useEffect} from 'react';
import {Container,Box,Text,Tab,TabList,Tabs,TabPanel,TabPanels} from "@chakra-ui/react";
import Login from '../components/Authentification/Login'
import SignUP from '../components/Authentification/SignUP'
import { useHistory } from 'react-router-dom';

const Homepage = () => {


  const history = useHistory();

  useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if(user){
          history.push('/');
      }
  },[history])


  return(
      <Container maxW="xl" centerContent>
    <Box d="flex" justifyContent="center" textAlign="center" p={3} bg= {"white"} w="100%" m="40px 0 15px 0" borderRadius="4px" borderWidth="2px">
        <Text fontSize="50px" fontFamily="Work sans" fontWeight="bold" color="blue">Connectify</Text>
    </Box>
    <Box bg="white" w="100%" p={4} borderRadius="4px" borderWidth="2px">
    <Tabs variant='soft-rounded'>
  <TabList mb="10px">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <SignUP/>
    </TabPanel>
  </TabPanels>
</Tabs>
    </Box>
    </Container>
  )
  
};

export default Homepage;
