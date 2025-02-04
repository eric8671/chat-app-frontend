import React,{useEffect, useState} from 'react'
import { ChatState } from '../Context/ChatProvider'
import {Box,Text} from '@chakra-ui/layout'
import { IconButton, Spinner, useToast ,FormControl,Input} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from 'axios'
import ScrollableChat from "./ScrollableChat"
import "./style.css";
import io from "socket.io-client"
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";


const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;


const SingleChat = ({fetchAgain,setFetchAgain}) => {

  const [messages, setMessages]=useState([]);
  const [loading, setLoading]=useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const[socketConnected, setSocketConnected] = useState(false)

    const {user,selectedChat,setSelectedChat,notification, setNotification}=ChatState()

    const toast = useToast();

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };


  const fetchMessages=async()=>{

    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `https://shashikant-connectify-api5.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
  }
  catch(error){
    toast({
      title: "Error Occured!",
      description: "Failed to load the Message",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
 }

  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit("setup",user);
    socket.on("connected",()=>setSocketConnected(true));
    socket.on('typing',()=>setIsTyping(true))
    socket.on("stop typing",()=> setIsTyping(false))
  },[])

    useEffect(()=>{
      fetchMessages();
      selectedChatCompare = selectedChat;
    },[selectedChat])

    
    useEffect(()=>{
      socket.on('message recieved',(newMessageReceived)=>{
        if(!selectedChatCompare|| selectedChatCompare._id !==newMessageReceived.chat._id){
          
            if (!notification.includes(newMessageReceived)) {
              setNotification([newMessageReceived, ...notification]);
              setFetchAgain(!fetchAgain);
            }
        }
        else{
          setMessages([...messages, newMessageReceived]);
        }
      })
    })
    


const sendMessage=async(event)=>{
    if(event.key==="Enter"&& newMessage){
      socket.emit('stop typing', selectedChat._id);
      try {
        const config={
          headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const {data} = await axios.post('https://shashikant-connectify-api5.onrender.com/api/message',{
          content: newMessage,
          chatId: selectedChat._id,
        },config);
       

        socket.emit('new message', data);

        setMessages([...messages,data]);

      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
}

const typingHandler=(e)=>{
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  
}


  return(
  <>
  {selectedChat?(
    <>
    <Text fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            fontWeight="500px"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            color="black"
            border="2px solid #38B2AC"
            bg="white">

            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat?(
                <>
                {getSender(user,selectedChat.users)}
                <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                </>
            ):(
                <>
                {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                    />
                </>
            )}

    </Text>
        <Box display="flex"
             flexDirection="column"
             justifyContent="flex-end"
             p={3}
             mt={1}
             bg="transparent"
             border="1px solid #38B2AC"
             w="100%"
             h="100%"
             borderRadius="1g"
             overflowY="hidden">
          {loading?(
            <Spinner  size="xl"
            w={10}
            h={10}
            color="#38B2AC"
            alignSelf="center"
            margin="auto"/>
          ):(
            <div className='messages'>
              <ScrollableChat messages={messages}/>
            </div>

          )}
          <FormControl
              onKeyDown={sendMessage}
              // id="first-name"
              isRequired
              mt={3}
            >
              {isTyping?<div>
              <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={50}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
              </div>:(<></>)}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                color="white"
                onChange={typingHandler}
              />
            </FormControl>
        </Box>
    </>
  ):(
    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="work sans" color="#38B2AC">
            Connect to Your friends
        </Text>
    </Box>
  )}
  </>
  )
}

export default SingleChat
