import React from 'react'
import {useToast,Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,} from '@chakra-ui/react'
import {Button} from '@chakra-ui/button'
import { useDisclosure, Box,Input,FormControl} from '@chakra-ui/react'
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import {Spinner} from '@chakra-ui/spinner';

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query){
            return
        }
        try {
            setLoading(true);
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
                title:"Error Occured",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 4000,
                isClosable:true,
                position:"bottm-left",
            })
        }

    }

    const handleSubmit=async()=>{
        if(!groupChatName||!selectedUsers){
            toast({
                title:"Please fill all the fields",
                description: "warning",
                status: "error",
                duration: 4000,
                isClosable:true,
                position:"top",
            })
            return;
        }
        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data}=await axios.post("https://shashikant-connectify-api5.onrender.com/api/chat/group",{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map((u)=>u._id)),
            },config)
            setChats([data,...chats]);
                onClose();
                toast({
                    title:"New Group Created",
                    status: "success",
                    duration: 4000,
                    isClosable:true,
                    position:"top",
                })
        } catch (error) {
            toast({
                title:"Failed to Create the Group!",
                description: error.response.data,
                status: "error",
                duration: 4000,
                isClosable:true,
                position:"top",
            })
        }
    }

    const handleDelete=(delUser)=>{
        setSelectedUsers(
            selectedUsers.filter((sel)=>sel._id!==delUser._id)
        )
    }

    const handleGroup=(userToAdd)=>{
        if (selectedUsers.includes(userToAdd)) {
            toast({
              title: "User already added",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
            fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">Create Group</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" alignItems="center">
              <FormControl>
                <Input placeholder="Group Name" mb={3} onChange={(e)=>setGroupChatName(e.target.value)}/>
              </FormControl>
              <FormControl>
                <Input placeholder="Add Members" mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
              </FormControl>

              <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map(u=>(
                    <UserBadgeItem key={user._id} user={u}
                    handleFunction={()=>handleDelete(u)}/>
                ))}
                </Box>

              {loading?<div>loading<Spinner ml="auto" display="flex"/></div>:(
                searchResult?.slice(0,4).map(user=>(
                    <UserListItem key={user._id} user={user}
                    handleFunction={()=>handleGroup(user)}/>
                ))
              )}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
               Create
              </Button>
             
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default GroupChatModal
