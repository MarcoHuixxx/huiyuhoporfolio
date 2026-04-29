import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import icmaIcon from "../assets/ICMA2026-Footer.png";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HowToVoteIcon from "@mui/icons-material/HowToVote";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deductConfirmOpen, setDeductConfirmOpen] = useState(false);
  const [isDeducting, setIsDeducting] = useState(false);
  const [showVoteTrend, setShowVoteTrend] = useState(false);
  const [isVoteTrendLoading, setIsVoteTrendLoading] = useState(false);
  const [voteTrendMessage, setVoteTrendMessage] = useState("");

  useEffect(() => {
    const getParticipantList = async () => {
      const windowLocation = window.location.href;
      const participantListResult = await axios.get(
        `/participant/${eventId}/${roundNumber}/100/true?pw=${
          windowLocation.split("?")?.[1]?.split("=")?.[1]
        }`,
      );
      setParticipantList(participantListResult?.data?.participants);
    };
    getParticipantList();
  }, []);

  // Load the current vote-trend display setting
  useEffect(() => {
    const fetchDisplaySetting = async () => {
      try {
        const result = await axios.get(`/event-display-setting/${eventId}`);
        setShowVoteTrend(result.data?.showVoteTrend === true);
      } catch (e) {
        console.error("Failed to fetch display setting", e);
      }
    };
    fetchDisplaySetting();
  }, []);

  const onToggleVoteTrend = async (newValue) => {
    setIsVoteTrendLoading(true);
    setVoteTrendMessage("");
    try {
      const pw = window.location.href.split("?")?.[1]?.split("=")?.[1];
      const result = await axios.post(
        `/admin/event-display-setting/${eventId}?pw=${pw}`,
        { showVoteTrend: newValue },
      );
      if (result.data?.success) {
        setShowVoteTrend(result.data.showVoteTrend);
        setVoteTrendMessage(
          result.data.showVoteTrend ? "投票走勢已開啟" : "投票走勢已關閉",
        );
      } else {
        setVoteTrendMessage("更新失敗，請重試");
      }
    } catch (e) {
      console.error(e);
      setVoteTrendMessage("更新失敗，請重試");
    } finally {
      setIsVoteTrendLoading(false);
    }
  };

  const handleParticipantChange = (event) => {
    setSelectedParticipant(event.target.value);
  };

  const onSaveClick = () => {
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
    // validation passed — open confirm dialog
    setResultMessage("");
    setConfirmOpen(true);
  };

  const onConfirmSave = async () => {
    setIsSaving(true);
    try {
      const editResult = await axios.post(
        `/admin/edit/${eventId}/${roundNumber}?pw=${
          window.location.href.split("?")?.[1]?.split("=")?.[1]
        }`,
        {
          pw: window.location.href.split("?")?.[1]?.split("=")?.[1],
          participantId: selectedParticipant?.id,
          voteItem,
          voteCount,
        },
      );

      console.log(editResult);
      setConfirmOpen(false);
      if (editResult?.data?.success) {
        setResultMessage("Saved successfully");
      } else {
        setResultMessage("Save failed");
      }
    } catch (err) {
      console.error(err);
      setConfirmOpen(false);
      setResultMessage("Save failed — network error");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (voteCount <= 0 && voteCount !== "") {
      setVoteCount(1);
    }
  }, [voteCount]);

  // ── Deduct handlers ────────────────────────────────────────────────────────
  const onDeductClick = () => {
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
    setResultMessage("");
    setDeductConfirmOpen(true);
  };

  const onConfirmDeduct = async () => {
    setIsDeducting(true);
    try {
      const deductResult = await axios.post(
        `/admin/deduct/${eventId}/${roundNumber}?pw=${
          window.location.href.split("?")?.[1]?.split("=")?.[1]
        }`,
        {
          pw: window.location.href.split("?")?.[1]?.split("=")?.[1],
          participantId: selectedParticipant?.id,
          voteItem,
          voteCount,
        },
      );
      setDeductConfirmOpen(false);
      if (deductResult?.data?.success) {
        setResultMessage("Deducted successfully");
      } else {
        setResultMessage("Deduct failed");
      }
    } catch (err) {
      console.error(err);
      setDeductConfirmOpen(false);
      setResultMessage("Deduct failed — network error");
    } finally {
      setIsDeducting(false);
    }
  };

  // ── Shared style tokens ────────────────────────────────────────────────────
  const cardSx = {
    backgroundColor: "#16181f",
    border: "1px solid #2a2d3a",
    borderRadius: "12px",
    p: { xs: 2.5, md: 3 },
  };
  const labelSx = {
    color: "#8b8fa8",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    mb: 0.75,
  };
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#1e2130",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "14px",
      "& fieldset": { borderColor: "#2a2d3a" },
      "&:hover fieldset": { borderColor: "#32BF72" },
      "&.Mui-focused fieldset": { borderColor: "#32BF72" },
    },
    "& .MuiInputBase-input::placeholder": { color: "#8b8fa8", opacity: 1 },
  };
  const inputSx = fieldSx;
  const selectSx = {
    backgroundColor: "#1e2130",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a2d3a" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#32BF72" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#32BF72",
    },
    "& .MuiSvgIcon-root": { color: "#8b8fa8" },
  };
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f1117" }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <Box
        sx={{
          width: { xs: 0, md: "220px" },
          flexShrink: 0,
          backgroundColor: "#16181f",
          borderRight: "1px solid #2a2d3a",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          py: 4,
          px: 2.5,
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
          <img
            src={icmaIcon}
            alt="ICMA"
            style={{ height: 32, objectFit: "contain" }}
          />
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              letterSpacing: 0.5,
            }}
          >
            ICMA Admin
          </Typography>
        </Box>

        {[
          {
            icon: <HowToVoteIcon fontSize="small" />,
            label: "Vote Management",
          },
          {
            icon: <VisibilityIcon fontSize="small" />,
            label: "Display Settings",
          },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.5,
              py: 1,
              borderRadius: "8px",
              backgroundColor: "#1e2130",
              color: "#32BF72",
              cursor: "default",
            }}
          >
            {item.icon}
            <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── Main content ────────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          py: { xs: 3, md: 5 },
          px: { xs: 2, md: 5 },
          overflowY: "auto",
        }}
      >
        {/* Page header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "#8b8fa8",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            ICMA 2026
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: { xs: "22px", md: "28px" },
            }}
          >
            Vote Management
          </Typography>
          <Typography sx={{ color: "#8b8fa8", fontSize: "13px", mt: 0.5 }}>
            Manage participant votes and control public display settings
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* ── Display Settings card ─────────────────────────── */}
          <Grid item xs={12}>
            <Box sx={cardSx}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    {showVoteTrend ? (
                      <VisibilityIcon sx={{ color: "#32BF72", fontSize: 20 }} />
                    ) : (
                      <VisibilityOffIcon
                        sx={{ color: "#8b8fa8", fontSize: 20 }}
                      />
                    )}
                    <Typography
                      sx={{ color: "#fff", fontWeight: 600, fontSize: "15px" }}
                    >
                      投票走勢 — Vote Count Display
                    </Typography>
                  </Box>
                  <Typography
                    sx={{ color: "#8b8fa8", fontSize: "12px", mt: 0.25 }}
                  >
                    Controls whether the public voting page shows vote counts
                    beneath the trend bars
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexShrink: 0,
                  }}
                >
                  <Chip
                    size="small"
                    label={showVoteTrend ? "LIVE" : "HIDDEN"}
                    sx={{
                      backgroundColor: showVoteTrend
                        ? "rgba(50,191,114,0.15)"
                        : "rgba(139,143,168,0.15)",
                      color: showVoteTrend ? "#32BF72" : "#8b8fa8",
                      fontWeight: 700,
                      fontSize: "11px",
                      letterSpacing: 0.8,
                      border: `1px solid ${showVoteTrend ? "#32BF72" : "#2a2d3a"}`,
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    disabled={isVoteTrendLoading}
                    startIcon={
                      isVoteTrendLoading ? (
                        <CircularProgress size={13} color="inherit" />
                      ) : null
                    }
                    onClick={() => onToggleVoteTrend(!showVoteTrend)}
                    sx={{
                      backgroundColor: showVoteTrend ? "#c0392b" : "#32BF72",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "12px",
                      textTransform: "none",
                      borderRadius: "6px",
                      px: 2,
                      "&:hover": {
                        backgroundColor: showVoteTrend ? "#a93226" : "#28a360",
                      },
                    }}
                  >
                    {isVoteTrendLoading
                      ? "Updating…"
                      : showVoteTrend
                        ? "Hide Counts"
                        : "Show Counts"}
                  </Button>
                </Box>
              </Box>
              {voteTrendMessage && (
                <Typography
                  sx={{
                    mt: 1.5,
                    fontSize: "12px",
                    fontWeight: 600,
                    color: voteTrendMessage.includes("失敗")
                      ? "#e74c3c"
                      : "#32BF72",
                  }}
                >
                  {voteTrendMessage}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* ── Vote form card ────────────────────────────────── */}
          <Grid item xs={12}>
            <Box sx={cardSx}>
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "15px",
                  mb: 2.5,
                }}
              >
                Add / Deduct Votes
              </Typography>

              <Grid container spacing={2.5}>
                {/* Participant selector */}
                <Grid item xs={12}>
                  <Typography sx={labelSx}>Participant</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedParticipant ?? ""}
                      onChange={handleParticipantChange}
                      displayEmpty
                      sx={selectSx}
                      renderValue={(val) =>
                        val ? (
                          `${val.chineseName ?? ""} ${val.name ?? ""} — No. ${val.participationNo ?? ""}`
                        ) : (
                          <span style={{ color: "#8b8fa8" }}>
                            Select a participant…
                          </span>
                        )
                      }
                    >
                      {participantList.map((p) => (
                        <MenuItem key={p.id} value={p}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                          >
                            <Avatar
                              src={`/event1/${p.chineseName}.jpg`}
                              sx={{ width: 30, height: 30, fontSize: "12px" }}
                            >
                              {p.chineseName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography
                                sx={{ fontSize: "13px", fontWeight: 600 }}
                              >
                                {p.chineseName} {p.name}
                              </Typography>
                              <Typography
                                sx={{ fontSize: "11px", color: "#8b8fa8" }}
                              >
                                No. {p.participationNo}
                              </Typography>
                            </Box>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Voter phone / item */}
                <Grid item xs={12} sm={8}>
                  <Typography sx={labelSx}>Voter Phone / Event Item</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="e.g. +852 9xxx xxxx"
                    value={voteItem}
                    onChange={(e) => setVoteItem(e.target.value)}
                    sx={inputSx}
                  />
                </Grid>

                {/* Vote count */}
                <Grid item xs={12} sm={4}>
                  <Typography sx={labelSx}>Vote Count</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={voteCount}
                    onChange={(e) => setVoteCount(e.target.value)}
                    sx={inputSx}
                  />
                </Grid>

                {/* Action buttons */}
                <Grid item xs={12}>
                  <Divider sx={{ borderColor: "#2a2d3a", mb: 2.5 }} />
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={onSaveClick}
                      sx={{
                        backgroundColor: "#32BF72",
                        color: "#fff",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 2.5,
                        "&:hover": { backgroundColor: "#28a360" },
                      }}
                    >
                      Add Votes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RemoveCircleOutlineIcon />}
                      onClick={onDeductClick}
                      sx={{
                        borderColor: "#e74c3c",
                        color: "#e74c3c",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "8px",
                        px: 2.5,
                        "&:hover": {
                          backgroundColor: "rgba(231,76,60,0.08)",
                          borderColor: "#e74c3c",
                        },
                      }}
                    >
                      Deduct Votes
                    </Button>
                  </Stack>
                </Grid>

                {/* Result message */}
                {resultMessage && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: "6px",
                        backgroundColor: resultMessage.includes("successfully")
                          ? "rgba(50,191,114,0.1)"
                          : "rgba(231,76,60,0.1)",
                        border: `1px solid ${resultMessage.includes("successfully") ? "#32BF72" : "#e74c3c"}`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: resultMessage.includes("successfully")
                            ? "#32BF72"
                            : "#e74c3c",
                        }}
                      >
                        {resultMessage.includes("successfully") ? "✓ " : "✗ "}
                        {resultMessage}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ── Add votes confirm dialog ─────────────────────────── */}
      <Dialog
        open={confirmOpen}
        onClose={() => !isSaving && setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#16181f",
            border: "1px solid #2a2d3a",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", fontWeight: 700, pb: 1 }}>
          Confirm Add Votes
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Box
              sx={{
                backgroundColor: "#1e2130",
                borderRadius: "8px",
                p: 2,
                mt: 0.5,
              }}
            >
              {[
                [
                  "Participant",
                  selectedParticipant
                    ? `${selectedParticipant.chineseName ?? ""} ${selectedParticipant.name ?? ""} (No. ${selectedParticipant.participationNo ?? ""})`
                    : "—",
                ],
                ["Voter / Item", voteItem || "—"],
                ["Add Votes", `+${voteCount}`],
              ].map(([k, v]) => (
                <Box
                  key={k}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    "&:last-child": { mb: 0 },
                  }}
                >
                  <Typography sx={{ color: "#8b8fa8", fontSize: "13px" }}>
                    {k}
                  </Typography>
                  <Typography
                    sx={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}
                  >
                    {v}
                  </Typography>
                </Box>
              ))}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setConfirmOpen(false)}
            disabled={isSaving}
            sx={{
              borderColor: "#2a2d3a",
              color: "#8b8fa8",
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onConfirmSave}
            disabled={isSaving}
            startIcon={
              isSaving ? <CircularProgress size={14} color="inherit" /> : null
            }
            sx={{
              backgroundColor: "#32BF72",
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#28a360" },
            }}
          >
            {isSaving ? "Saving…" : "Confirm Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Deduct votes confirm dialog ──────────────────────── */}
      <Dialog
        open={deductConfirmOpen}
        onClose={() => !isDeducting && setDeductConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#16181f",
            border: "1px solid #2a2d3a",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#e74c3c", fontWeight: 700, pb: 1 }}>
          ⚠ Confirm Deduct Votes
        </DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Typography sx={{ color: "#e74c3c", fontSize: "12px", mb: 1.5 }}>
              This will permanently reduce the participant's vote count.
            </Typography>
            <Box
              sx={{
                backgroundColor: "#1e2130",
                border: "1px solid #3d1a1a",
                borderRadius: "8px",
                p: 2,
              }}
            >
              {[
                [
                  "Participant",
                  selectedParticipant
                    ? `${selectedParticipant.chineseName ?? ""} ${selectedParticipant.name ?? ""} (No. ${selectedParticipant.participationNo ?? ""})`
                    : "—",
                ],
                ["Voter / Item", voteItem || "—"],
                ["Deduct Votes", `-${voteCount}`],
              ].map(([k, v]) => (
                <Box
                  key={k}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    "&:last-child": { mb: 0 },
                  }}
                >
                  <Typography sx={{ color: "#8b8fa8", fontSize: "13px" }}>
                    {k}
                  </Typography>
                  <Typography
                    sx={{
                      color: k === "Deduct Votes" ? "#e74c3c" : "#fff",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {v}
                  </Typography>
                </Box>
              ))}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setDeductConfirmOpen(false)}
            disabled={isDeducting}
            sx={{
              borderColor: "#2a2d3a",
              color: "#8b8fa8",
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirmDeduct}
            disabled={isDeducting}
            startIcon={
              isDeducting ? (
                <CircularProgress size={14} color="inherit" />
              ) : null
            }
            sx={{ fontWeight: 700, textTransform: "none", borderRadius: "8px" }}
          >
            {isDeducting ? "Deducting…" : "Confirm Deduct"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminEditPage;
