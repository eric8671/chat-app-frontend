import React,{useState} from 'react'
import {Box, Text} from '@chakra-ui/layout'
import {Button} from '@chakra-ui/button'
import {ChatState} from "../../Context/ChatProvider";
import { Tooltip } from '@chakra-ui/react';
import {Menu,MenuButton,MenuItem,MenuList} from "@chakra-ui/menu";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import {Drawer,DrawerBody,DrawerHeader,DrawerOverlay,DrawerContent} from '@chakra-ui/react'
import  {useDisclosure} from '@chakra-ui/react';
import {Input} from "@chakra-ui/react"
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import ChatLoading from '../ChatLoading';
import UserListItem from '../userAvatar/UserListItem';
import {Spinner} from '@chakra-ui/spinner';
import { getSender } from "../../config/ChatLogics";
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {user, setSelectedChat,chats,setChats,notification, setNotification}=ChatState()

  const history = useHistory()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    history.push("/");
  }

  const toast = useToast()

  const handleSearch=async()=>{
    if(!search){
      toast({
        title:"Please Enter something to search",
        status:"warning",
        duration:4000,
        isClosable:true,
        position:"top-left"
      });
      setSearchResult();
    }
    

    else{

    
    try {
      setLoading(true)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };
      const {data}= await axios.get(`https://shashikant-connectify-api5.onrender.com/api/user?search=${search}`,config)
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title:"Failed to search",
        status:"warning",
        duration:4000,
        isClosable:true,
        position:"top-left"
      })
    }
    
  }
  }

const accessChat=async(userId)=>{
  try {
    setLoadingChat(true)
    const config={
      headers:{
        "Content-type" :"application/json",
        Authorization:`Bearer ${user.token}` 
      },
    };

    const {data} = await axios.post('https://shashikant-connectify-api5.onrender.com/api/chat',{userId}, config);
    if(!chats.find((c)=>c._id===data._id)) setChats([data, ...chats]);
    setSelectedChat(data);
    setLoadingChat(false);
    onClose();
  } catch (error) {
    toast({
      title:"Error fetching the chat",
      description:error.message,
      status:error,
      duration:4000,
      isClosable:true,
      position:"bottom-left"
    })
  }
}

  return (
    <>
    <Box  display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="transparent"
          w="100%"
          p="5px 10px 5px 10px"
          borderWidth="5px">
      <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} border="2px">
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}
            color="#38B2AC">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="40px" fontFamily="Work sans" fontWeight ="Bold"color="#38B2AC">Connectify</Text>
        <div>
          // <Menu>
            // <MenuButton p={1}>
            // <NotificationBadge
            //     count={notification.length}
            //     effect={Effect.SCALE}
            //   />
            //   <BellIcon fontSize="3xl" m={1} color="darkgray"/>
            // </MenuButton>
            // <MenuList pl={2}>
            // {!notification.length && "No New Messages"}
            //   {notification.map((notif) => (
            //     <MenuItem
            //       key={notif._id}
            //       onClick={() => {
            //         setSelectedChat(notif.chat);
            //         setNotification(notification.filter((n) => n !== notif));
            //       }}
            //     >
            //       {notif.chat.isGroupChat
            //         ? `New Message in ${notif.chat.chatName}`
            //         : `New Message from ${getSender(user, notif.chat.users)}`}
            //     </MenuItem>
            //   ))}
            // </MenuList>
          // </Menu>
          <Menu>
            <MenuButton size="15px" as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
            </MenuButton>

            <MenuList>
              <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>

          </Menu>
        </div>
    </Box>

    <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          {/* <DrawerCloseButton /> */}
          <DrawerHeader borderBottomWidth="2px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input placeholder="Search by name or email" mr={2} value={search} onChange={(e)=>setSearch(e.target.value)}/>
              <Button colorScheme='blue' onClick={handleSearch}>Search</Button>
            </Box>
            {loading?(
                  <ChatLoading/>
                 
            ):(
              searchResult?.map((user)=>(
                <UserListItem 
                key={user._id} 
                user={user} 
                handleFunction={()=>accessChat(user._id)}/>
               
              ))
              
            )}
             {loadingChat && <Spinner ml="auto" display="flex"/>}
           
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </>
  )
}

export default SideDrawer;
