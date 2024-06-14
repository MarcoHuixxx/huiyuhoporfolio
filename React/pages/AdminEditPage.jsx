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
import icmaIcon from "../assets/icma.svg";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";

const AdminEditPage = () => {
  //write a component that will allow the admin to edit the voting options
  //the admin should be able to add, delete, and edit the voting options
  //the admin should be able to see the current voting options
  const eventId = "664b20f7cbd11e4bca2386c8";
  const roundNumber = 1;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [participantList, setParticipantList] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [voteItem, setVoteItem] = useState("");
  const [voteCount, setVoteCount] = useState(1);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    const getParticipantList = async () => {
      const windowLocation = window.location.href;
      const participantListResult = await axios.get(
        `/participant/${eventId}/${roundNumber}/100/true?pw=${
          windowLocation.split("?")?.[1]?.split("=")?.[1]
        }`
      );
      setParticipantList(participantListResult?.data?.participants);
    };
    getParticipantList();
  }, []);

  const handleParticipantChange = (event) => {
    setSelectedParticipant(event.target.value);
  };

  const onSaveClick = async () => {
    if (!selectedParticipant) {
      setResultMessage("Please select a participant");
      return;
    }

    if (!voteItem) {
      setResultMessage("Please enter a vote item");
      return;
    }

    if (!voteCount) {
      setResultMessage("Please enter a vote count");
      return;
    }

    const editResult = await axios.post(
      `/admin/edit/${eventId}/${roundNumber}?pw=${
        window.location.href.split("?")?.[1]?.split("=")?.[1]
      }`,

      {
        pw: window.location.href.split("?")?.[1]?.split("=")?.[1],
        participantId: selectedParticipant?.id,
        voteItem,
        voteCount,
      }
    );

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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Participant
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedParticipant}
                label="Select Participant"
                onChange={handleParticipantChange}
              >
                {participantList.map((participant) => (
                  <MenuItem key={participant.id} value={participant}>
                    {`${participant.chineseName} ${participant.name} ${participant.participationNo}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="demo-simple-select-label">
              投票者電話/活動項目
            </InputLabel>
            <Input
              value={voteItem}
              onChange={(e) => setVoteItem(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="demo-simple-select-label">投票數</InputLabel>
            <Input
              value={voteCount}
              onChange={(e) => setVoteCount(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={onSaveClick}>
              Save
            </Button>
          </Grid>

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
