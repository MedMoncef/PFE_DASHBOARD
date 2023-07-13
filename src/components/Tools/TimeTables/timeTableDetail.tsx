import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { styled } from '@mui/system';
import { Box, InputLabel, Button, TextField, MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

const API_URL_TIMETABLE = 'http://localhost:7000/timetables';
const API_URL_USER = 'http://localhost:7000/users';

const OuterContainer = styled('div')({
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  backgroundImage: "url('https://images.unsplash.com/photo-1530229540764-5f6ab595fdbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')",
  backgroundSize: 'cover',
});

const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  background: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.25)',
});

interface User {
  nom: string;
  prenom: string;
}

interface TimeTables {
  _id: string;
  user: User;
  loginTime: Date;
  loginDate: Date;
  isLate: Boolean;
}

const TimeTablePage = () => {
  const [timeTables, setTimeTables] = useState<TimeTables | null>(null);
  const router = useRouter();
  const { timetableId } = router.query;
  const [user, setUser] = useState<string>("");
  const [loginTime, setLoginTime] = useState<string>("");
  const [loginDate, setLoginDate] = useState<string>("");
  const [isLate, setIsLate] = useState<Boolean | null>(null);
  const [userList, setUserList] = useState<TimeTables[] | null>(null);

  useEffect(() => {
    if (timetableId) {
      axios.get(`${API_URL_TIMETABLE}/get/${timetableId}`).then((res) => {
        if (res.data) {
          setTimeTables(res.data);
          setLoginTime(new Date(res.data.loginTime).toLocaleTimeString());
          setLoginDate(new Date(res.data.loginDate).toLocaleDateString());
          setIsLate(res.data.isLate);
        }
      });
    }
  }, [timetableId]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !loginTime || !loginDate || isLate === null) {
      console.error("Please fill in all fields");
      return;
    }

    try {
      const timeTableData = {
        user,
        loginTime,
        loginDate,
        isLate,
      };

      await axios.put(`${API_URL_TIMETABLE}/${timetableId}`, timeTableData);
      toast.success('TimeTable updated successfully');
      router.push('/Tables/RoomTypes/roomType');
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const fetchData = async () => {
    const result = await axios(API_URL_USER);
    setUserList(result.data);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setUser(event.target.value);
  };

  const handleIsLateChange = (event: SelectChangeEvent<string>) => {
    setIsLate(event.target.value === 'true');
  };

  return (
    <OuterContainer>
      {timeTables && (
        <FormContainer>
          <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{ display: 'flex', flexDirection: 'column', '& .MuiTextField-root': { m: 1, width: '30ch' }, }}
          >
            <InputLabel id="demo-simple-select-label">Users</InputLabel>
            {userList && (
              <Select
                id="user"
                name="user"
                label="User"
                onChange={handleChange}
                sx={{ mb: 2, width: 'auto' }}
              >
                {userList.map((type: TimeTables) => (
                  <MenuItem key={type._id} value={type._id}>{type.user}</MenuItem>
                ))}
              </Select>
            )}

            <TextField
              required
              id="loginTime"
              name="loginTime"
              label="loginTime"
              variant="outlined"
              type="time"
              value={loginTime}
              onChange={(e) => setLoginTime(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
            <TextField
              required
              id="loginDate"
              name="loginDate"
              label="loginDate"
              variant="outlined"
              type="date"
              value={loginDate}
              onChange={(e) => setLoginDate(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />

            <InputLabel id="demo-simple-select-isLate-label">Is Late?</InputLabel>
            <Select
              value={isLate ? "true" : "false"}
              id="isLate"
              name="isLate"
              label="Is Late"
              onChange={handleIsLateChange}
              sx={{ mb: 2, width: 'auto' }}
            >
              <MenuItem value="true">true</MenuItem>
              <MenuItem value="false">false</MenuItem>
            </Select>

            <Button type="submit" variant="outlined" color="primary">
              Modify TimeTable
            </Button>
          </Box>
        </FormContainer>
      )}
    </OuterContainer>
  );
};

export default TimeTablePage;