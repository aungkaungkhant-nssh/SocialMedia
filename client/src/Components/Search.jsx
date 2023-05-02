import React, { useRef, useState } from 'react'
import {Modal,Box, Typography, OutlinedInput, InputAdornment, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText} from "@mui/material"
import {
    PersonSearch as PersonSearchIcon
} from '@mui/icons-material'
import { userSearch } from '../apiCall';
import {useNavigate} from 'react-router-dom'
const style={
    position: "absolute",
	top: {
		lg: "10%",
		md: "10%",
		sm: "5%",
	},
	left: {
		lg: "20%",
		md: "20%",
		sm: "5%",
	},
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
	width: {
		lg: "60%",
		md: "60%",
		sm: "90%",
	},
}
function Search({open,setOpen}) {
    const handleClose = () => setOpen(false);
    const input = useRef();
    const [searchLists,setSearchLists] = useState([]);
    const navigate  = useNavigate();
    const handleSearch = async()=>{
        let searchUser = input.current.value;
        let res = await userSearch({searchUser})
        setSearchLists(res)
    }
  return (
    <div>
        <Modal
            open={open}
            onClose ={handleClose}
        >
            <Box sx={style}>
                <OutlinedInput 
                    inputRef={input}
                    onChange={handleSearch}
                    fullWidth={true}
                    variant="outlined"
                    placeholder='Search User'
                    startAdornment={
                        <InputAdornment position='start'>
                            <PersonSearchIcon />
                        </InputAdornment>
                    }
                />
                <List>
                    {
                        searchLists.map((s)=>
                            <ListItem key={s._id}>
                                    <ListItemButton
                                        onClick={()=>{
                                            setOpen(false)
                                            navigate(`/${s.handle}`)
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt="profile"
                                            src={s?.profile && s?.profile}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={s.name+"@"+s.handle}
                                            secondary={"sdf"}
                                        />
                                    </ListItemButton>
                            </ListItem>
                        )

                    }
              
                </List>
            </Box>
        </Modal>
    </div>
  )
}

export default Search