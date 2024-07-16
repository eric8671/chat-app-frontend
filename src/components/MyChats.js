import React,{useState, useEffect} from 'react'
import { ChatState } from '../Context/ChatProvider';
import {useToast} from '@chakra-ui/react';
import axios from 'axios';
import { Box, Stack, Text } from "@chakra-ui/layout";
import {Button} from "@chakra-ui/button"
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from './miscellaneous/GroupChatModal';
import ChatLoading from './ChatLoading';


const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const {selectedChat, setSelectedChat, user,chats,setChats} = ChatState();
      
    const toast = useToast();

    const fetchChats= async()=>{
        try {
           const config={
            headers: {
                Authorization:`Bearer ${user.token}`,
            },
           } ;
           const {data}=await axios.get("https://shashikant-connectify-api5.onrender.com/api/chat",config);
           
           setChats(data);
        } catch (error) {
            toast({
                title:"Error occured",
                description: "Failed to load the chats",
                status: "error",
                duration:4000,
                isClosable: true,
                position:"bottom-left"
            })

        }
    }
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
      }, [fetchAgain]);
    

  return(
  <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }} flexDirection="column" alignItems="center" p={3}
  bg="transparent"
  w={{ base: "100%", md: "30%" }}
  borderRadius="lg"
  borderWidth="1px"
  >

    <Box pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="#38B2AC"
        >

            My Chats


            <GroupChatModal>
            <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bg="transparent"
            color="#38B2AC"
            border="2px">
            New Group Chat
          </Button>
          </GroupChatModal>

    </Box>
    <Box display="flex"
         flexDirection="column"
         p={3}
         bg="#F8F8F8"
         w="100%"
         h="100%"
         borderRadius="lg"
         overflowY="hidden"
         background="transparent"
       >
         {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                 <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
                 </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        
        )}

    </Box>

  </Box>
  )
}

export default MyChats


