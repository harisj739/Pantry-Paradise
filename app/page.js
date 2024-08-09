'use client';
import Image from "next/image";
import { useState, useEffect } from 'react';
import {firestore} from "@/firebase";
import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import {doc, getDoc, setDoc, deleteDoc, getDocs, collection, query} from 'firebase/firestore';
import "bootstrap-icons/font/bootstrap-icons.css";
import dynamic from 'next/dynamic';
const SearchBar = dynamic(() => import('search-bar-react'), { ssr: false });
import Head from "next/head";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async() => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList);
  }

  const addItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()) {
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity + 1});
    }
    else {
      await setDoc(docRef, {quantity: 1});
    }

    await updateInventory();
  }

  const editItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()) {
      const {name, quantity} = docSnap.data();
      await setDoc(docRef, {name: name, quantity: quantity});
    }

    await updateInventory();
  }

    // Filtering the inventory based on search query
    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const removeItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()) {
      const {quantity} = docSnap.data();
      if(quantity === 1) {
        await deleteDoc(docRef);
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1});
      }
    }

    await updateInventory();
  }

  // Only will run once when the page loads because there's nothing in the dependency array.
  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width={"100vw"} height={"100vh"} bgcolor="#F2D2BD" display={"flex"} flexDirection="column" justifyContent="center" alignItems={'center'} gap={2} overflow={"auto"} sx={{
          gap: '16px', // Use gap to control spacing between children
          overflowX: 'hidden', // Horizontal scrolling if needed
          overflowY: 'auto' // Hide vertical scrolling if not needed
        }}>
      <Modal open={open} onClose={handleClose}>
        <Box position={"absolute"} top={"50%"} left={"50%"} width={"200px"} bgcolor={"white"} border={"2px solid #000"} boxShadow={24} p={4} display={"flex"} flexDirection={"column"} gap={3} sx={{transform:'translate(-50%, -50%)',}}>
          <Typography variant={"h6"}> Add Item  </Typography>
          <Stack width={"100%"} direction={"row"} spacing={2}>
            <TextField varient={"outlined"} fullWidth value={itemName} onChange={(e) => {setItemName(e.target.value)}}> </TextField>
            <Button
                variant={"outlined"}
                onClick={()=> {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}> Add </Button>
          </Stack>
        </Box>
      </Modal>
      {/*<Box border={"1px solid #fff"}>*/}
        <Box width={"800px"} height={"100px"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Typography variant={"h2"} color={'#80461B'}>
            Pantry Paradise
          </Typography>
        </Box>
        <Box width={"1000px"} height={"43px"} display={"flex"} flexDirection="row">
            <SearchBar
                onChange={(text) => setSearchQuery(text)}
                onFocus={() => console.log('focused')}
                size='large'
                width='100%'
                autoFocus
                placeholder='Search Pantry Item'
                onClear={() => setSearchQuery('')} // Clear search query on clear
                value={searchQuery} // Set the value to the current search query
            />
            <Button
                variant={"contained"}
                color={"success"}
                onClick={() => {
                    handleOpen()
                }}> <i class="bi bi-plus-circle" style={{paddingRight: "10px"}}></i> Add </Button>
        </Box>
      <Box display='flex' flexWrap='wrap' flexDirection={'row'} justifyContent="center" spacing={2} overflow={"auto"} paddingLeft={'50px'} sx={{
        gap: '30px', // Use gap to control spacing between children
        overflowX: 'auto', // Horizontal scrolling if needed
        overflowY: 'auto' // Hide vertical scrolling if not needed
      }}>
        {
            filteredInventory.map(({name, quantity}) => (
              <Box key={"name"} minHeight={"150px"} display={"flex"} alignItems={"center"} padding={10} sx={{
                borderRadius: '16px', // Adjust the value as needed for rounder edges
                border: '1px solid #7B3F00',  // Optional: Add border to visualize the rounded corners
                  paddingTop: '5px',
                padding: '16px',      // Optional: Add padding for spacing
                margin: '8px',        // Optional: Add margin between items
                bgcolor: '#CD7F32',
                boxShadow: '0px 4px 8px #7B3F00',
                overflow: 'auto', // Handles overflow content
              }}>
                <Typography variant={"h4"} color={"#fff"} textAlign={"center"} paddingRight={"50px"}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={"h4"} color={"#fff"} textAlign={"center"} >
                  {quantity}
                </Typography>
                <Stack direction={"column"} spacing={2} paddingLeft={"50px"} sx={{ marginLeft: 'auto'}} >
                  <Button
                      variant={"contained"}
                      color={"error"}
                      sx={{
                        borderRadius: "50px",
                      }}
                      onClick={() => {
                        removeItem(name)
                      }}
                  >
                    <i className="bi bi-trash3" style={{paddingRight: "10px"}}></i>
                    Delete
                  </Button>
                  <Button
                      variant={"contained"}
                      color="secondary"
                      sx={{
                        borderRadius: "50px",
                      }}
                      onClick={() => {
                        addItem(name)
                      }}
                  >
                    <i className="bi bi-pencil-square" style={{paddingRight: "10px"}}></i>
                    Update
                  </Button>
                </Stack>
              </Box>
          ))}
      </Box>
      {/*</Box>*/}
      {/*<Typography variant={"h1"}>  Inventory Management </Typography>*/}
      {/*{inventory.map((item, index) => {*/}
      {/*    return(*/}
      {/*        <Box key={"index"}>*/}
      {/*      {item.name}*/}
      {/*      {item.quantity}*/}
      {/*    </Box>)*/}
      {/*  })}*/}
    </Box>
  )
}
