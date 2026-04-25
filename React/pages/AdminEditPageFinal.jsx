import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import icmaIcon from "../assets/ICMA2026-Footer.png";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import { Stack } from "@mui/material";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
// import { getStyles } from "../utils/getStyles";
import { useTheme } from "@mui/material/styles";

const AdminEditPage = () => {
  //write a component that will allow the admin to edit the voting options
  //the admin should be able to add, delete, and edit the voting options
  //the admin should be able to see the current voting options
  const eventIds = [
    "668decd851930e822903d375",
    "668decef51930e822903d376",
    "668decf551930e822903d377",
    "668decfd51930e822903d378",
    "668ded0351930e822903d379",
    "668ded0e51930e822903d37a",
    "668deded51930e822903d37c",
    "668deda751930e822903d37b",
  ];
  const eventId = "668deded51930e822903d37c";
  const recEventId = "668deda751930e822903d37b";
  const roundNumber = 1;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [participantList, setParticipantList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [voteItem, setVoteItem] = useState("");
  const [voteCount, setVoteCount] = useState(1);
  const [resultMessage, setResultMessage] = useState("");
  const [eventList, setEventList] = useState([]);
  const [recParticipantList, setRecParticipantList] = useState([]);
  const [existRecParticipantList, setExistRecParticipantList] = useState([]);
  const names = ["Oliver Hansen", "Van Henry", "April Tucker"];

  const handleChange = (event) => {
    // console.log(event);
    const {
      target: { value },
    } = event;
    const list = value === "string" ? value.split(",") : value;
    const recList = recParticipantList.filter((participant) =>
      list.includes(participant.name),
    );
    console.log({ value });
    setExistRecParticipantList(recList);
  };

  useEffect(() => {
    const getParticipantList = async () => {
      const windowLocation = window.location.href;
      const participantListResult = await axios.get(
        `/participant/${eventId}/${roundNumber}/100/true?pw=${
          windowLocation.split("?")?.[1]?.split("=")?.[1]
        }`,
      );
      setRecParticipantList(participantListResult?.data?.participants);

      const existRecParticipantListResult = await axios.get(
        `/participant/${recEventId}/${roundNumber}/100/true?pw=${
          windowLocation.split("?")?.[1]?.split("=")?.[1]
        }`,
      );
      setExistRecParticipantList(
        existRecParticipantListResult?.data?.participants,
      );
    };

    const getEventList = async () => {
      const eventListResult = await axios.get(
        `/event/${eventIds.join(",")}?pw=${
          window.location.href.split("?")?.[1]?.split("=")?.[1]
        }`,
      );
      setEventList(eventListResult?.data);
      console.log(eventListResult);
    };

    getEventList();
    getParticipantList();
  }, [resultMessage]);

  const handleParticipantChange = (event) => {
    setSelectedParticipant(event.target.value);
  };
  const wqd = () => {};
  const onSaveClick = async () => {
    const editResult = await axios.post(`/admin/edit/event-participant`, {
      eventId: recEventId,
      pw: window.location.href.split("?")?.[1]?.split("=")?.[1],
      participantIds: existRecParticipantList.map(
        (participant) => participant._id,
      ),
    });

    console.log(editResult);

    if (editResult?.data?.success) {
      setResultMessage("Saved successfully");
    } else {
      setResultMessage("Save failed");
    }
  };

  useEffect(() => {
    if (voteCount <= 0 && voteCount !== "") {
      setVoteCount(1);
    }
  }, [voteCount]);

  const onVoteChannelClick = (action) => async () => {
    if (!selectedEvent) {
      setResultMessage("Please select an event");
      return;
    }

    const result = await axios.post(`/admin/voteChannel`, {
      eventId: selectedEvent._id,
      pw: window.location.href.split("?")?.[1]?.split("=")?.[1],
      action,
      roundNumber: 1,
    });

    if (result?.data?.success) {
      setResultMessage(
        `Vote channel ${action} (event: ${selectedEvent.name}) successfully`,
      );
    } else {
      setResultMessage(
        `Vote channel ${action} (event: ${selectedEvent.name}) failed`,
      );
    }
    setSelectedEvent(null);
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4">Admin Edit Page</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4">投票通道開關</Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Event
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedEvent}
                label="Select Event"
                onChange={handleEventChange}
              >
                {eventList.map((event) => (
                  <MenuItem key={event._id} value={event}>
                    {`${event.name} (投票通道已${
                      event.status !== "closed" ? "開啟" : "關閉"
                    })`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={onVoteChannelClick("open")}
              >
                開啟投票通道
              </Button>

              <Button
                variant="contained"
                color="error"
                onClick={onVoteChannelClick("close")}
              >
                關閉投票通道
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">復活賽名單更改</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">名單</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={existRecParticipantList.map(
                (participant) => `${participant.name}`,
              )}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              // MenuProps={MenuProps}
            >
              {recParticipantList.map((participant) => (
                <MenuItem
                  key={participant.name}
                  value={participant.name}
                  // style={getStyles(name, personName, theme)}
                >
                  {participant.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={onSaveClick}>
            Save
          </Button>
        </Box>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{
              color: resultMessage === "Saved successfully" ? "green" : "red",
            }}
          >
            {resultMessage}
          </Typography>
        </Grid>
      </Container>
      <Container maxWidth="md">
        <Box
          sx={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
          }}
        >
          <img src={icmaIcon} alt="icma" className="icmaIcon" />
        </Box>
      </Container>
    </Box>
  );
};

export default AdminEditPage;
