import { useState, useEffect, useCallback } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Container from "@mui/material/Container";
import BannerImage from "./assets/banner.jpg";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Item from "@mui/material/ListItem";
import { InstagramEmbed } from "react-social-media-embed";
import axios from "axios";
import moment from "moment";
// import { dummyList } from "./constants";
import Countdown from "react-countdown";
axios.defaults.headers.post["Content-Type"] = "application/json";
const serverUrl = import.meta.env.VITE_API_BASE_URL;
import Avatar from "@mui/material/Avatar";
import wewaClubIcon from "./assets/wewaClub.svg";
import InstagramIcon from "./assets/ig2.webp";
import { MuiOtpInput } from "mui-one-time-password-input";
import BigBIcon from "./assets/bigb.svg";
import citywalkIcon from "./assets/citywalk.svg";
import poppingIcon from "./assets/popping.svg";
import pravoIcon from "./assets/pravo.svg";
import singIcon from "./assets/sing.svg";
import wewaIcon from "./assets/wewa.svg";
import checkedIcon from "./assets/checked.svg";
import sponsorIcon from "./assets/sponsor.png";
import voteMethodImage from "./assets/voteMethod.png";
import icmaIcon from "./assets/icma.svg";
import Dialog from "./src/components/dialog";
import YoutubeEmbed from "./src/components/youtubeEmbed";
import MuiPhoneNumber from "mui-phone-number";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import LinearProgress from "@mui/material/LinearProgress";
import Footer from "./components/footer";
import TextField from "@mui/material/TextField";
import { set } from "mongoose";

//set axios default url
axios.defaults.baseURL = serverUrl;

function App() {
  const eventId = "664b20f7cbd11e4bca2386c8";
  const roundNumber = 1;
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventDeadlineDate, setEventDeadlineDate] = useState(
    "2024-08-30T23:59:59"
  );
  const [showVoteMethod, setShowVoteMethod] = useState(false);
  const [rankingList, setRankingList] = useState([]);
  const [thirdRankingList, setThirdRankingList] = useState([]);
  const [votePageIsOpen, setVotePageIsOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState({});
  const [voteDialogIsOpen, setVoteDialogIsOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [wewaClubId, setWewaClubId] = useState("");
  const [votes, setVotes] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [totalVotes, setTotalVotes] = useState(600);
  const [iswewaClubIdValid, setIswewaClubIdValid] = useState(true);
  const [showOptDialog, setShowOptDialog] = useState(false);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isOptValid, setIsOptValid] = useState(false);
  const [confirmVoteIsClicked, setConfirmVoteIsClicked] = useState(false);
  const [errorMessage, setErrorMesssage] = useState("");
  const [isVoteSuccess, setIsVoteSuccess] = useState(false);
  const [isOptChecked, setIsOptChecked] = useState(false);
  const [isListLoaded, setIsListLoaded] = useState(false);
  const [windowErrorMesssage, setWindowErrorMesssage] = useState("");
  const [isConfirmVoteLoading, setIsConfirmVoteLoading] = useState(false);
  const [isConfirmOptLoading, setIsConfirmOptLoading] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [firstThreeVotes, setFirstThreeVotes] = useState([]);

  useEffect(() => {
    const fetchRankingList = async () => {
      try {
        if (!isListLoaded) {
          const windowLocation = window.location.href;

          const isAdminVar = windowLocation.includes(
            "664b20f7cbd11e4bca2386c8"
          );

          setIsAdmin(isAdminVar);

          const getEventResult = await axios.get(`/event/${eventId}`);
          if (getEventResult?.data?.timeEnd) {
            setEventDeadlineDate(getEventResult.data.timeEnd);
          }
          const participantListResult = await axios.get(
            `/participant/${eventId}/${roundNumber}/100/${isAdminVar}`
          );

          const totalVotes = participantListResult.data.participants.reduce(
            (acc, item) => {
              return acc + item.votes;
            },
            0
          );
          setTotalVotes(totalVotes);

          if (participantListResult?.data?.participants?.length > 0) {
            const thirdList = participantListResult?.data.participants?.slice(
              0,
              3
            );
            setThirdRankingList(thirdList);
            setRankingList(participantListResult?.data?.participants);
            setFirstThreeVotes(
              participantListResult?.data?.firstThreeRaningPercent
            );
          }
          setIsListLoaded(true);
        }
      } catch (error) {
        setIsListLoaded(false);
        setRankingList([]);
        setThirdRankingList([]);
        setWindowErrorMesssage("獲取排名列表失敗");
      }
    };
    fetchRankingList();
  }, [isListLoaded]);

  const rankingTitleMapping = {
    0: "第一名",
    1: "第二名",
    2: "第三名",
  };

  const onParticipantClick = (item) => {
    window.history.pushState({}, "", `/voting`);
    setSelectedParticipant(item);
    setVotePageIsOpen(true);
  };

  const onVoteButonClick = (item) => {
    //console.log("item", item);
    setVoteDialogIsOpen(true);
    setShowOptDialog(false);
  };

  const onConfirmVote = async () => {
    try {
      setIsConfirmVoteLoading(true);
      //console.log("onConfirmVote");
      setConfirmVoteIsClicked(true);
      if (!isPhoneValid || votes === 0) {
        setIsConfirmVoteLoading(false);
        return;
      }
      //checking if the user is voted today
      const isVotedToday = await checkIsVotedToday();
      // const isVotedToday = false;

      if (isVotedToday) {
        setIsConfirmVoteLoading(false);
        setErrorMesssage("今天已參與投票，請明天再參與");
        return;
      }

      const isPhoneVerified = await checkIsPhoneVerified();
      //console.log("isPhoneVerified:", isPhoneVerified);
      if (isPhoneVerified.success) {
        setIsPhoneVerified(true);
        setErrorMesssage("");

        setTimeout(() => {
          setIsConfirmVoteLoading(false);
          setShowOptDialog(true);
        }, 500);
        return;
      } else if (isPhoneVerified.error) {
        setIsConfirmVoteLoading(false);
        setErrorMesssage("發送驗證碼失敗, 請重試一次");
        return;
      }
      const senOptResult = await sendOtp();
      // const senOptResult = { success: true };
      //console.log("senOptResult:", senOptResult);

      if (senOptResult.success) {
        setErrorMesssage("");
        setShowOptDialog(true);
      } else {
        setErrorMesssage("發送驗證碼失敗, 請重試一次");
      }
      setIsConfirmVoteLoading(false);
    } catch (error) {
      //console.log("error:", error);
      setIsConfirmVoteLoading(false);
      setErrorMesssage("發送驗證碼失敗, 請重試一次");
    }
  };

  const checkIsVotedToday = async () => {
    try {
      const result = await axios.get(`/check-vote/${phoneNumber}/${eventId}`);
      //console.log("checkIsVotedToday result:", result);
      return result.data.isVoted;
    } catch (error) {
      //console.log("error:", error);
      return true;
    }
  };

  const checkIsPhoneVerified = async () => {
    try {
      const result = await axios.get(
        `/check-phone-verified/${phoneNumber}/${eventId}`
      );
      //console.log("checkIsPhoneVerified result:", result);
      return { success: result.data.isPhoneVerified };
    } catch (error) {
      //console.log("error:", error);
      return { success: false, error: true };
    }
  };

  const onConfirmOptInput = async () => {
    setIsConfirmOptLoading(true);
    try {
      if (otp.length !== 6) {
        setIsOptValid(false);
        setIsOptChecked(true);
        setIsConfirmOptLoading(false);
        return;
      }
      const result = await axios.get(`/verify-otp/${phoneNumber}/${otp}`);
      // const result = { data: { success: true } };
      //console.log("verify result:", result);

      if (result.data.success) {
        setIsOptValid(true);
        setIsPhoneVerified(true);
      } else {
        setIsOptValid(false);
      }

      setIsOptChecked(true);
    } catch (error) {
      setIsOptChecked(true);
      if (error.response.status === 400) {
        if (error.response.data.message === "The round is not open") {
          setErrorMesssage("活動已經結束，投票失敗");
        } else if (
          error.response.data.message === "The participant is not found"
        ) {
          setErrorMesssage("參賽者不存在，投票失敗");
        }
      } else {
        setIsOptValid(false);
      }
      setIsConfirmOptLoading(false);
      //console.log("error:", error);
    }
  };
  //hi

  const makeVote = async () => {
    try {
      const voteData = {
        roundNumber,
        eventId,
        voterPhone: phoneNumber,
        voteCount: votes,
        wewaClubId: wewaClubId,
        participantId: selectedParticipant.id,
      };
      const voteResult = await axios.post("/vote", voteData);
      //console.log("voteResult:", voteResult);
      return {
        success: voteResult.data.success,
      };
    } catch (error) {
      //console.log("error:", error);
      setIsConfirmOptLoading(false);
      return {
        success: false,
      };
    }
  };

  const sendOtp = async () => {
    try {
      const result = await axios.get(`/send-otp/${phoneNumber}`, {
        phoneNumber: phoneNumber,
      });

      //console.log("sendOtp sendOtp result:", result);

      return {
        success: result.data.success,
      };
      //console.log("result:", result);
    } catch (error) {
      //console.log("error:", error);
      return {
        success: false,
      };
    }
  };

  useEffect(() => {
    const makeVoteHandler = async () => {
      if (isPhoneVerified) {
        const voteResult = await makeVote();

        // const voteResult = { data: { success: true } };

        //console.log("voteResult:", voteResult);

        if (voteResult.success) {
          // setVoteDialogIsOpen(false);
          setIsVoteSuccess(true);
        } else {
          setErrorMesssage("投票失敗, 請再試一次");
        }
        setIsConfirmOptLoading(false);
      }
    };

    makeVoteHandler();
  }, [isPhoneVerified]);

  useEffect(() => {
    const handlePopstate = () => {
      setVotePageIsOpen(false);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  useEffect(() => {
    //console.log("errorMessage:", errorMessage);
    if (errorMessage !== "") {
      //console.log("errorMessage   dscdsnclnsdlnjl:");
      setConfirmVoteIsClicked(false);
    }
  }, [errorMessage]);

  useEffect(() => {
    const iswewaClubIdValidHandler = () => {
      const iswewaClubIdValidVar =
        wewaClubId !== ""
          ? wewaClubId.length === 11 &&
            wewaClubId.toLocaleUpperCase().startsWith("WWC")
          : false;

      if (iswewaClubIdValidVar) {
        //console.log("setVotes 2");
        setVotes(2);
      } else {
        //console.log("setVotes 0");
        setVotes(0);
      }

      setIswewaClubIdValid(iswewaClubIdValidVar);
    };

    iswewaClubIdValidHandler();
  }, [wewaClubId]);

  useEffect(() => {
    const isPhoneValidHandler = () => {
      const isPhoneValidVar = !(
        phoneNumber === "" || phoneNumber?.length !== 14
      );
      //console.log("phoneNumber:", phoneNumber.length);
      //console.log("isPhoneValidVar:", isPhoneValidVar);
      setIsPhoneValid(isPhoneValidVar);
    };

    isPhoneValidHandler();
  }, [phoneNumber]);

  const setVotePageIsOpenHandler = (value) => {
    setVotePageIsOpen(value);
  };

  useEffect(() => {
    //console.log("votePageIsOpen:", votePageIsOpen);
    if (!votePageIsOpen || !voteDialogIsOpen) {
      //redirect to home page after vote success and close the dialog
      if (isVoteSuccess) {
        setIsListLoaded(false);
        setVoteDialogIsOpen(false);
      }

      //console.log("voteDialogIsOpen:", voteDialogIsOpen);
      setIsPhoneVerified(false);
      setErrorMesssage("");
      setIsOptChecked(false);
      setIsOptValid(false);
      setIsPhoneValid(false);
      setIsVoteSuccess(false);
      setPhoneNumber("");
      setWewaClubId("");
      setVotes(0);
      setOtp("");
      setIswewaClubIdValid(false);
      setShowOptDialog(false);
      setConfirmVoteIsClicked(false);
      if (!votePageIsOpen) {
        setSelectedParticipant({});
        setVoteDialogIsOpen(false);
      }
    }
  }, [votePageIsOpen, voteDialogIsOpen]);

  useEffect(() => {
    //reform phone to +852
    if (!phoneNumber.startsWith("+852") && phoneNumber.length > 0) {
      setPhoneNumber("+852");
    }
  }, [phoneNumber]);

  return (
    <Box className="PageContainer">
      <Dialog
        open={votePageIsOpen}
        setOpen={setVotePageIsOpenHandler}
        // onClose={handleDialogClose}
        fullScreen
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              justifyContent: {
                xs: "start",
                md: "center",
              },
              marginTop: {
                xs: "30px",
                md: "0px",
              },
            }}
          >
            <img src={icmaIcon} alt="icma" className="icmaIcon" />
          </Box>
        </Container>
        {!isMd && (
          <Box className="mobileVotePageBox">
            <Container
              maxWidth="sm"
              sx={{
                paddingY: "20px",
                display: {
                  xs: "block",
                  md: "none",
                },
              }}
            >
              <Container maxWidth="sm">
                <Grid container>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      maxHeight: "90px",
                      borderLeft: "1px solid #FFF",
                      paddingX: "10px",
                      marginY: "50px",
                    }}
                  >
                    <Stack direction="column" spacing={1}>
                      <Typography className="votePageInfoText">
                        <Typography
                          display={"inline"}
                          sx={{
                            fontSize: {
                              xs: "20px",
                              md: "24px",
                            },
                            marginRight: "5px",
                            fontFamily: "gensen font master",
                          }}
                        >
                          {selectedParticipant.chineseName}
                        </Typography>
                        <Typography
                          display={"inline"}
                          sx={{
                            fontSize: {
                              xs: "14px",
                              md: "18px",
                            },
                            fontFamily: "gensen font master",
                          }}
                        >
                          {selectedParticipant.name}
                        </Typography>
                      </Typography>
                      <Box
                        className="votePageInfoText"
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Typography
                          display={"inline"}
                          sx={{
                            fontSize: {
                              xs: "14px",
                              md: "18px",
                            },
                            fontFamily: "gensen font master",
                          }}
                        >
                          Year {selectedParticipant.studyingYear}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "end",
                            paddingLeft: "2px",
                            paddingRight: "0px",
                          }}
                        >
                          <img
                            src={InstagramIcon}
                            alt="Instagram"
                            className="igIcon"
                          />
                        </Box>
                        <Typography
                          className="votePageInfoText"
                          display={"inline"}
                          onClick={() => {
                            window.open(
                              `https://www.instagram.com/${selectedParticipant.instagram}/`,
                              "_blank"
                            );
                          }}
                          sx={{
                            cursor: "pointer",
                            fontSize: {
                              xs: "12px",
                              md: "14px",
                            },
                            fontWeight: "100",
                            textDecoration: "underline",
                            alignSelf: "center",
                            maxWidth: "30px",
                            lineHeight: "20px",
                            textUnderlinePosition: "under",
                          }}
                        >
                          @{selectedParticipant.instagram}
                        </Typography>
                      </Box>
                      <Typography
                        className="votePageInfoText"
                        sx={{
                          fontSize: {
                            xs: "14px",
                            md: "18px",
                          },
                          fontFamily: "gensen font master",
                        }}
                      >
                        {selectedParticipant.university}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    >
                      <Avatar
                        alt={selectedParticipant.name}
                        src={selectedParticipant.image}
                        sx={{
                          width: {
                            xs: "95%",
                            sm: "95%",
                          },
                          height: {
                            xs: "100%",
                            sm: "100%",
                          },
                          boxShadow: "0px 0px 5px 0px #000000",
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      borderLeft: "1px solid #FFF",
                      paddingX: "10px",
                      marginY: "50px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        className="votePageInfoText"
                        sx={{
                          fontSize: "10px",
                          fontWeight: "100",
                          marginBottom: "5px",
                        }}
                      >
                        複賽影片
                      </Typography>
                      {selectedParticipant.video && (
                        <YoutubeEmbed embedId={selectedParticipant.video} />
                      )}
                    </Box>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    sx={{
                      backgroundColor: "#FFF",
                      color: "#e04478",
                      borderRadius: "75px",
                      padding: "10px 30px",
                      boxShadow: "0px 0px 2px 0px #000000",
                    }}
                    onClick={onVoteButonClick}
                  >
                    <span className="voteButtonText">投票</span>
                  </Button>
                </Box>
              </Container>
              <Footer type="votePage" isMd={isMd} />
            </Container>
          </Box>
        )}
        <Container
          maxWidth="sm"
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          <Box className="webVotePageBox">
            <Container
              maxWidth="sm"
              sx={{
                paddingY: "20px",
                display: {
                  xs: "none",
                  md: "block",
                  position: "relative",
                },
              }}
            >
              <Box
                sx={{
                  maxWidth: "30%",
                  maxHeight: "30%",
                }}
                className="webAvatarBox"
              >
                <Avatar
                  alt={selectedParticipant.name}
                  src={selectedParticipant.image}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "100%",
                    },
                    height: {
                      xs: "100%",
                      sm: "100%",
                    },
                    boxShadow: "0px 0px 5px 0px #000000",
                  }}
                />
              </Box>

              <Container
                maxWidth="sm"
                sx={{
                  marginTop: "80px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    sx={{
                      backgroundColor: "#FFF",
                      color: "#e04478",
                      borderRadius: "75px",
                      padding: "10px 30px",
                      boxShadow: "0px 0px 2px 0px #000000",
                    }}
                    onClick={onVoteButonClick}
                  >
                    <span className="voteButtonText">投票</span>
                  </Button>
                </Box>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      paddingX: "10px",
                      marginTop: "50px",
                    }}
                  >
                    <Stack direction="column" spacing={1}>
                      <Typography
                        className="votePageInfoText"
                        sx={{
                          fontWeight: "100",
                        }}
                      >
                        參賽者
                      </Typography>
                      <Typography className="votePageInfoText">
                        <Typography
                          display={"inline"}
                          sx={{
                            fontFamily: "gensen font master",
                            fontSize: {
                              xs: "20px",
                              md: "24px",
                            },
                            marginRight: "5px",
                          }}
                        >
                          {selectedParticipant.chineseName}
                        </Typography>
                        <Typography
                          display={"inline"}
                          sx={{
                            fontFamily: "gensen font master",
                          }}
                        >
                          {selectedParticipant.name}
                        </Typography>
                      </Typography>
                      <Box
                        className="votePageInfoText"
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Typography
                          display={"inline"}
                          sx={{
                            fontFamily: "gensen font master",
                          }}
                        >
                          Year {selectedParticipant.studyingYear}
                        </Typography>
                      </Box>
                      <Typography
                        className="votePageInfoText"
                        sx={{
                          fontFamily: "gensen font master",
                        }}
                      >
                        {selectedParticipant.university}
                      </Typography>
                      <Box
                        sx={{
                          height: "20px",
                          width: "100px",
                          borderBottom: "1px solid #FFF",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "start",
                        }}
                        className="webIgBox"
                      >
                        <img
                          src={InstagramIcon}
                          alt="Instagram"
                          className="igIcon"
                        />
                        <Typography
                          className="votePageInfoText"
                          display={"inline"}
                          onClick={() => {
                            window.open(
                              `https://www.instagram.com/${selectedParticipant.instagram}/`,
                              "_blank"
                            );
                          }}
                          sx={{
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "100",
                            textDecoration: "underline",
                            alignSelf: "center",
                          }}
                        >
                          @{selectedParticipant.instagram}
                        </Typography>
                      </Box>
                      <Box style={{ display: "flex", justifyContent: "start" }}>
                        {selectedParticipant.instagram && (
                          <InstagramEmbed
                            url={
                              "https://www.instagram.com/" +
                              selectedParticipant.instagram +
                              "/"
                            }
                            // width={"320px"}
                            // height={"220px"}
                          />
                        )}
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  ></Grid>
                </Grid>

                <Grid container>
                  <Grid
                    item
                    xs={9}
                    sx={{
                      paddingX: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        height: "20px",
                        width: "100px",
                        borderBottom: "1px solid #FFF",
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "10px",
                      }}
                    >
                      <Typography
                        className="votePageInfoText"
                        sx={{
                          fontSize: "10px",
                          fontWeight: "100",
                          marginBottom: "5px",
                        }}
                      >
                        複賽影片
                      </Typography>
                      {selectedParticipant.video && (
                        <YoutubeEmbed embedId={selectedParticipant.video} />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Container>
              <Footer type="votePage" isMd={isMd} />
            </Container>
          </Box>
        </Container>
        <Dialog
          open={voteDialogIsOpen}
          setOpen={setVoteDialogIsOpen}
          direction="up"
          closeIcon
        >
          {!showOptDialog ? (
            <Box
              sx={{
                paddingX: "50px",
                paddingTop: "50px",
                paddingBottom: "20px",
              }}
            >
              {/* <FormControl> */}
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#e04478",
                  fontWeight: "500",
                }}
              >
                電話號碼 <span>*</span>
              </Typography>
              <Box
                sx={{
                  paddingY:
                    confirmVoteIsClicked && !isPhoneValid ? "10px" : "0px",
                  paddingX:
                    confirmVoteIsClicked && !isPhoneValid ? "2px" : "0px",
                  border:
                    confirmVoteIsClicked && !isPhoneValid
                      ? "2px solid red"
                      : "",
                  borderRadius: "5px",
                }}
              >
                <MuiPhoneNumber
                  sx={{
                    "& svg": { height: "1em" },
                  }}
                  defaultCountry={"hk"}
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value)}
                  onlyCountries={["hk"]}
                />
              </Box>
              {(!isPhoneValid && phoneNumber !== "") ||
              (confirmVoteIsClicked && phoneNumber === "") ? (
                <p className="inputErrorText">請輸入8位數字電話號碼</p>
              ) : (
                ""
              )}
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#e04478",
                  fontWeight: "500",
                  marginTop: "20px",
                }}
              >
                Wewa Club 會員編號 (如有)
              </Typography>
              <Input
                id="my-input"
                aria-describedby="my-helper-text"
                value={wewaClubId}
                onChange={(e) => setWewaClubId(e.target.value)}
                sx={{
                  width: "100%",
                }}
              />
              {wewaClubId !== "" ? (
                !iswewaClubIdValid ? (
                  <p className="inputErrorText">Wewa Club 會員編號無效</p>
                ) : (
                  <p className="inputSuccessText">Wewa Club 會員編號有效</p>
                )
              ) : (
                ""
              )}

              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#e04478",
                  fontWeight: "500",
                  marginTop: "20px",
                  marginBottom: "10px",
                }}
              >
                投取票數 <span>*</span>
              </Typography>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={votes}
                onChange={(e) => setVotes(e.target.value)}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      votes === 0 && confirmVoteIsClicked ? "red" : "#e04478",
                    borderWidth: votes === 0 && confirmVoteIsClicked ? 2 : 1,
                  },
                }}
                disabled={iswewaClubIdValid && wewaClubId !== ""}
              >
                <MenuItem value={0}>-請選擇-</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2} disabled={!iswewaClubIdValid}>
                  2 (Wewa Club會員)
                </MenuItem>
              </Select>
              <p className="inputErrorText">
                {votes === 0 && confirmVoteIsClicked ? "請選擇投票數" : ""}
              </p>

              <Box
                sx={{
                  marginTop: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <LoadingButton
                  sx={{
                    backgroundColor: "#e04478",
                    color: "#ffffff",
                    borderRadius: "75px",
                    padding: "10px 30px",
                    boxShadow: "0px 0px 2px 0px #000000",
                    ":hover": {
                      backgroundColor: "#e04478",
                    },
                  }}
                  loading={isConfirmVoteLoading && isPhoneValid && votes !== 0}
                  onClick={onConfirmVote}
                  className="confirmVoteButton"
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    投票
                  </Typography>
                </LoadingButton>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  // marginTop: "40px",
                }}
              >
                <p className="inputErrorText">{errorMessage}</p>
              </Box>
              {/* <MuiOtpInput value={"otp"} onChange={handleOtpChange} /> */}
              {/* <InputLabel htmlFor="my-input">驗證碼</InputLabel>
              <MuiOtpInput value={"otp"} onChange={handleOtpChange} /> */}
              {/* </FormControl> */}
            </Box>
          ) : isVoteSuccess ? (
            //console.log("isVoteSuccessXXXXXX:", isVoteSuccess),
            <Box
              sx={{
                padding: "40px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Alert variant="outlined" severity="success">
                投票成功
              </Alert>
            </Box>
          ) : (
            <Box
              sx={{
                paddingY: {
                  xs: "20px",
                  sm: "40px",
                },
                paddingX: {
                  xs: "15px",
                  sm: "40px",
                },
              }}
            >
              <InputLabel
                htmlFor="my-input"
                sx={{
                  marginBottom: "20px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    color: "#e04478",
                    fontWeight: "500",
                  }}
                >
                  請輸入6位數字的手機驗證碼
                </Typography>
              </InputLabel>
              <MuiOtpInput
                TextFieldsProps={{ size: isMd ? "large" : "small" }}
                value={otp}
                onChange={(newValue) => {
                  setOtp(newValue);
                }}
                gap={isSm ? 2 : 1}
                length={6}
                autoFocus
                // validateChar={validateChar}
              />
              <Box
                sx={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <LoadingButton
                  sx={{
                    backgroundColor: "#e04478",
                    color: "#ffffff",
                    borderRadius: "75px",
                    padding: "10px 30px",
                    boxShadow: "0px 0px 2px 0px #000000",
                    ":hover": {
                      backgroundColor: "#e04478",
                    },
                  }}
                  onClick={onConfirmOptInput}
                  className="confirmVoteButton"
                  loading={isConfirmOptLoading}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    確認
                  </Typography>
                </LoadingButton>
              </Box>
              {isOptChecked && (!isOptValid || errorMessage !== "") && (
                <Box
                  sx={{
                    paddingTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <p className="inputErrorText text-center">
                    {errorMessage ? errorMessage : "驗證碼錯誤"}
                  </p>
                </Box>
              )}
            </Box>
          )}
        </Dialog>
      </Dialog>

      <Container disableGutters={isSm === false}>
        <Box className="section">
          <Box className="columnBox">
            <img src={BannerImage} alt="Banner" className="BannerImage" />
            <Box className="navBar">
              <Grid
                container
                sx={{
                  display: "flex",
                  flexDirection: isMd ? "row" : "column",
                  // paddingX: isMd ? "10px" : "5px",
                }}
              >
                <Grid item xs={isMd ? 8 : 12}>
                  {/* <Box className="iconRowBox"> */}
                  <img src={sponsorIcon} alt="wewa" className="sponsorIcon" />
                  {/* </Box> */}
                </Grid>
                <Grid
                  item
                  xs={isMd ? 4 : 12}
                  className="voteBox"
                  sx={{
                    marginBottom: {
                      xs: "10px",
                      md: "0px",
                    },
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      md: "flex-end",
                    },
                    marginLeft: {
                      xs: "4%",
                      md: "0px",
                    },
                  }}
                >
                  <Button
                    endIcon={
                      showVoteMethod ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )
                    }
                    sx={{
                      color: "#e04478",
                      marginRight: "-5px",
                    }}
                    onClick={() => setShowVoteMethod(!showVoteMethod)}
                  >
                    <Typography
                      className="voteMethodTitleText"
                      sx={{
                        fontSize: {
                          xs: "16px",
                          md: "18px",
                        },
                        fontWeight: "bold",
                        marginRight: "-5px",
                        marginTop: "-6px",
                      }}
                    >
                      投票方法
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  display: showVoteMethod ? "block" : "none",
                  padding: "50px 0px",
                }}
              >
                <Grid item xs={12}>
                  <Container maxWidth="md">
                    <Typography
                      className="sectionTitleBold"
                      sx={{
                        fontSize: {
                          xs: "28px",
                          sm: "32px",
                          md: "36px",
                        },
                        fontWeight: "900",
                        fontFamily: "Hiragino Sans",
                      }}
                    >
                      投票方法
                    </Typography>
                    <Stack
                      direction="column"
                      spacing={isMd ? 3 : 2}
                      sx={{
                        fontFamily: "Noto Sans HK",
                      }}
                    >
                      <Item className="flexRow">
                        <img
                          src={checkedIcon}
                          alt="checked"
                          className="checkedIcon"
                        />
                        <p className="voteMethodTextP">
                          <span className="voteMethodText">投票期間，</span>
                          <span className="voteMethodTextBold">
                            每人每日皆可投選一次
                          </span>
                        </p>
                      </Item>
                      <Item
                        className="flexRow"
                        sx={{
                          position: "relative",
                        }}
                      >
                        <img
                          src={checkedIcon}
                          alt="checked"
                          className="checkedIcon"
                        />
                        <Typography
                          sx={{
                            marginLeft: "10px",
                            minWidth: {
                              xs: "25px",
                              md: "0px",
                            },
                          }}
                        >
                          <span className="voteMethodText">成為</span>
                        </Typography>

                        <Box
                          sx={{
                            display: "inline-block",
                            // verticalAlign: "center",
                            // alignItems: "center",
                          }}
                        >
                          <img
                            src={wewaClubIcon}
                            alt="wewaClub"
                            className="wewaClubIcon"
                          />
                        </Box>
                        <p>
                          <span className="voteMethodText">會員</span>
                          <span className="voteMethodTextBold">
                            每日可投選兩票
                          </span>
                          <span className="voteMethodTextDesc">
                            (只限同一名參賽者)
                          </span>
                        </p>
                        <Button
                          variant="contained"
                          sx={{
                            zIndex: 9999999,
                            backgroundColor: "#e04478",
                            color: "#ffffff",
                            borderRadius: "0px",
                            padding: "5px 10px",
                            marginLeft: "10px",
                            boxShadow: "0px 0px 10px 0px #000000",
                            position: "absolute",
                            right: {
                              xs: "10%",
                              sm: "30%",
                              md: "40%",
                            },
                            bottom: "-30px",
                            ":hover": {
                              backgroundColor: "#e04478",
                            },
                            textWrap: "nowrap",
                            fontSize: {
                              xs: "10px",
                              sm: "14px",
                              md: "16px",
                            },
                          }}
                          onClick={() => {
                            window.open("https://club.wewacard.com/", "_blank");
                          }}
                        >
                          <span className="joinMemberText">立即登記會員</span>
                        </Button>
                      </Item>
                      <Item className="flexRow">
                        <img
                          src={checkedIcon}
                          alt="checked"
                          className="checkedIcon"
                        />
                        <p className="voteMethodTextP">
                          <span className="voteMethodText">得票最高的</span>
                          <span className="voteMethodTextBold">前兩名</span>
                          <span className="voteMethodText">
                            將獲得復活資格，
                          </span>
                          <span className="voteMethodTextBold">
                            並可參加決賽
                          </span>
                        </p>
                      </Item>
                    </Stack>
                  </Container>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        {rankingList.length > 0 ? (
          <>
            <Box className="section">
              <Box className="columnBox">
                <Box
                  className="titleBox"
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      md: "start",
                    },
                  }}
                >
                  <Typography
                    className="sectionTitleBold"
                    sx={{
                      fontSize: {
                        xs: "28px",
                        sm: "32px",
                        md: "36px",
                      },
                      fontWeight: "bold",
                      fontFamily: "Hiragino Sans",
                    }}
                  >
                    投票走勢
                  </Typography>
                </Box>
                <Container>
                  <Grid container spacing={2}>
                    {thirdRankingList.map((item, index) => (
                      <Grid
                        item
                        xs={12}
                        key={item.name + item.participationNo}
                        sx={{ display: "flex", marginTop: "20px" }}
                      >
                        <Grid item className="rankingNumberBox" xs={4}>
                          <Box
                            className="rankingNumberInnerBox"
                            sx={{
                              width: 80 - index * 14 + "%",
                              fontSize: 24 - (index - 1) * 6 + "px",
                              fontFamily: "Noto Sans HK",
                            }}
                          >
                            <Typography
                              className="rankingNumberText"
                              sx={{
                                fontSize: {
                                  xs: "12px",
                                  sm: "20px",
                                  md: "28px",
                                },
                                fontWeight: "bold",
                              }}
                            >
                              {rankingTitleMapping[index]}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={8}>
                          <Box className="rankingContentBox">
                            <Box className="iconRankingBox">
                              <Avatar
                                alt={item.name}
                                src={item.image}
                                sx={{
                                  width: 50 - index * 5 + "px",
                                  height: 50 - index * 5 + "px",
                                }}
                              />
                              <Box
                                className="rankingVotesBox"
                                sx={{
                                  backgroundColor: "#dcdedd",
                                  borderRadius: "2px",
                                  height: "30px",
                                  width:
                                    firstThreeVotes[index].toFixed(2) * 70 +
                                    "%",
                                  marginLeft: "-10px",
                                }}
                              />
                            </Box>
                            <Box className="nameTextBox">
                              <Stack direction="row" spacing={0.4}>
                                <Typography
                                  className="rankingNameText"
                                  sx={{
                                    fontSize: 18 - index * 4 + "px",
                                    fontFamily: "gensen font master",
                                  }}
                                >
                                  {item.participationNo}
                                </Typography>
                                <Typography
                                  className="rankingNameText"
                                  sx={{
                                    fontSize: 18 - index * 4 + "px",
                                    fontFamily: "gensen font master",
                                  }}
                                >
                                  {item.chineseName}
                                </Typography>
                                <Typography
                                  className="rankingNameText"
                                  sx={{
                                    fontSize: 18 - index * 4 + "px",
                                    fontFamily: "gensen font master",
                                  }}
                                >
                                  {item.name}
                                </Typography>
                                {isAdmin && (
                                  <Typography
                                    className="rankingNameText"
                                    sx={{
                                      fontSize: 18 - (item.rank - 1) * 4 + "px",
                                    }}
                                  >
                                    {item.votes} 票 (
                                    {((item.votes / totalVotes) * 100).toFixed(
                                      2
                                    )}
                                    %)
                                  </Typography>
                                )}
                              </Stack>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </Container>
              </Box>
            </Box>
            <Box className="section">
              <Box className="columnBox">
                <Box
                  className="titleBox"
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "center",
                      md: "start",
                    },
                  }}
                >
                  <Typography
                    className="sectionTitle"
                    display="inline"
                    sx={{
                      fontSize: {
                        xs: "28px",
                        sm: "32px",
                        md: "36px",
                      },
                      fontFamily: "Hiragino Sans",
                      fontWeight: "100",
                    }}
                  >
                    投選
                  </Typography>
                  <Typography
                    display="inline"
                    className="sectionTitleBold"
                    sx={{
                      fontSize: {
                        xs: "28px",
                        sm: "32px",
                        md: "36px",
                      },
                      fontWeight: "bold",
                      fontFamily: "Hiragino Sans",
                    }}
                  >
                    你
                  </Typography>
                  <Typography
                    display="inline"
                    className="sectionTitle"
                    sx={{
                      fontSize: {
                        xs: "28px",
                        sm: "32px",
                        md: "36px",
                      },
                      fontFamily: "Hiragino Sans",
                      fontWeight: "100",
                    }}
                  >
                    想
                  </Typography>
                  <Typography
                    display="inline"
                    className="sectionTitleBold"
                    sx={{
                      fontSize: {
                        xs: "28px",
                        sm: "32px",
                        md: "36px",
                      },
                      fontWeight: "bold",
                      fontFamily: "Hiragino Sans",
                    }}
                  >
                    復活的選手
                  </Typography>
                </Box>
                <Box
                  className="rankingNumberInnerBox eventCountDownBox"
                  sx={{
                    marginTop: {
                      xs: "10px",
                      md: "5px",
                    },
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: {
                      xs: "center",
                      md: "start",
                    },
                  }}
                >
                  <Typography
                    className="eventCountDownText"
                    sx={{
                      fontSize: {
                        xs: "16px",
                        md: "12px",
                      },
                      fontWeight: "bold",
                    }}
                  >
                    距離投票截止還有
                  </Typography>
                  <span className="eventCountDownDateText">
                    {
                      <Countdown
                        date={eventDeadlineDate}
                        renderer={({ days, hours, minutes }) => (
                          <span>
                            {days} 天 {hours} 時 {minutes} 分
                          </span>
                        )}
                      />
                    }
                  </span>
                </Box>
                <Container>
                  <Grid
                    container
                    sx={{
                      marginTop: "10px",
                    }}
                  >
                    {rankingList.map((item, index) => (
                      <Grid
                        item
                        xs={4}
                        // sm={4}
                        md={4}
                        key={item.name + item.participationNo + index}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                          // marginY: "0px",
                        }}
                        className="avatarGridBox"
                      >
                        {/* <TextRing side={1.1}>{item.chineseName}</TextRing> */}
                        <Box
                          className="flexRow"
                          sx={{
                            cursor: "pointer",
                            paddingBottom: "10px",
                          }}
                          onClick={() => {
                            onParticipantClick(item);
                          }}
                        >
                          <Typography
                            display="inline"
                            sx={{
                              fontSize: {
                                xs: "20px",
                                sm: "22px",
                                md: "24px",
                              },
                              color: "#e04478",
                              fontWeight: "bold",
                              marginRight: "6px",
                              fontFamily: "gensen font master",
                            }}
                          >
                            {item.participationNo}
                          </Typography>
                          <Typography
                            display="inline"
                            sx={{
                              fontSize: {
                                xs: "10px",
                                sm: "12px",
                                md: "14px",
                              },
                              color: "#e04478",
                              marginRight: "2px",
                              fontFamily: "gensen font master",
                            }}
                          >
                            {item.chineseName}
                          </Typography>
                          <Typography
                            display="inline"
                            sx={{
                              fontSize: {
                                xs: "10px",
                                sm: "12px",
                                md: "14px",
                              },
                              color: "#e04478",
                              fontFamily: "gensen font master",
                            }}
                          >
                            {item.name}
                          </Typography>

                          {isAdmin && (
                            <Typography
                              className="rankingNameText"
                              sx={{
                                fontSize: 18 - (item.rank - 1) * 4 + "px",
                                marginLeft: "10px",
                              }}
                            >
                              {item.votes} 票 (
                              {((item.votes / totalVotes) * 100).toFixed(2)}
                              %)
                            </Typography>
                          )}
                        </Box>

                        <Avatar
                          alt={item.name}
                          src={item.image}
                          sx={{
                            width: { xs: 100, sm: 150, md: 200 },
                            height: { xs: 100, sm: 150, md: 200 },
                            boxShadow: "0px 0px 5px 0px #000000",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            onParticipantClick(item);
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Container>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <LinearProgress
              sx={{
                marginTop: "-20px",
              }}
              color="success"
            />
          </>
        )}
      </Container>
      <Footer type="home" isMd={isMd} />
    </Box>
  );
}

export default App;
