import React,{useState} from 'react'
import {Button} from "@chakra-ui/button"
import {VStack} from "@chakra-ui/layout";
import { FormControl,FormLabel } from '@chakra-ui/form-control';
import {Input,InputGroup,InputRightElement} from "@chakra-ui/input";
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import {useHistory} from 'react-router-dom'
import { ChatState } from "../../Context/ChatProvider";
// import { useNavigate } from 'react-router-dom'
// import { BrowserRouter as Router } from 'react-router-dom';

const Login = () => {
    const[show,setShow]=useState(false)
    const[email,setEmail] = useState();
    const[password,setPassword] = useState();

    const[loading,setLoading]=useState(false);

    const toast = useToast()
    const history = useHistory();
    const { setUser } = ChatState();

    const handleClick =()=>setShow(!show);


 const submitHandler = async()=>{
        setLoading(true);
        if(!email || !password){
            toast({
                title: "Please Fill all the Fields",
                status:"warning",
                duration:3000,
                isClosable:true,
                position:"bottom",
            });
            setLoading(false);
            return ;
        }
        try {
            const config={
                 headers:{
                    "Content-type":"application/json",
                 },
            };
            const {data} = await axios.post("https://shashikant-connectify-api5.onrender.com/api/user/login",{email,password},config);
            toast({
                title: "Login Successful",
                status:"success",
                duration:3000,
                isClosable:true,
                position:"bottom",
            });
            setUser(data)
            localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);
            history.push('/chats')
           
        } catch (error) {
            toast({
                title: "Error Occured",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"bottom",
            });
            setLoading(false);
        }
    };


  return (
    // <Router>
    <VStack spacing="5px">
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input value={email} placeholder='Enter Your Email'
            onChange={(e)=>setEmail(e.target.value)}/>
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input 
                value={password}
                type={show?"text":"password"}
                placeholder='Enter Your password'
                onChange={(e)=>setPassword(e.target.value)}/>
                
               <InputRightElement width ="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show? "Hide":"Show"}
                </Button>
                
                </InputRightElement> 

            </InputGroup>
        </FormControl>

        
        <Button colorScheme='blue' width="100%"
        style={{marginTop:15}} onClick={submitHandler}
        isLoading={loading}>
            Login
        </Button>

        <Button variant="solid" colorScheme='red' width="100%"
        onClick={()=>{
            setEmail("guest@example.com");
            setPassword("12345");
        }}>
            Get Guest User Credentials
        </Button>
    </VStack>
    // </Router>
  )
  
}

export default Login
