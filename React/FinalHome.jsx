import { useState, useEffect, useCallback } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Container from "@mui/material/Container";
import BannerImage from "./assets/finalBanner.jpg";
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
import ExPlainIcon from "./assets/finalExplain.png";
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
import { CSVLink, CSVDownload } from "react-csv";
import Footer from "./components/footer";
import TextField from "@mui/material/TextField";
import { set } from "mongoose";
import Checkbox from "@mui/material/Checkbox";
import FinalPkLogo from "./assets/finalPkLogo.png";
import FinalPopularityLogo from "./assets/finalPopularityLogo.png";
import FinalResurrectionLogo from "./assets/finalResurrection.png";
import RealtimeRankingLogo from "./assets/realtimeRankingLogo.png";

//set axios default url
axios.defaults.baseURL = serverUrl;

function App() {
  const eventId = "664b20f7cbd11e4bca2386c8";
  const roundNumber = 1;
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventDeadlineDate, setEventDeadlineDate] = useState("Invalid Date");
  const [eventReloadTime, setEventReloadTime] = useState(10000);
  const [eventStartDate, setEventStartDate] = useState("Invalid Date");
  const [isWithInEventTime, setIsWithInEventTime] = useState(false);
  const [showVoteMethod, setShowVoteMethod] = useState(true);
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
  const [errorMessage, setErrorMessage] = useState("");
  const [isVoteSuccess, setIsVoteSuccess] = useState(false);
  const [isOptChecked, setIsOptChecked] = useState(false);
  const [isListLoaded, setIsListLoaded] = useState(false);
  const [windowErrorMesssage, setWindowErrorMesssage] = useState("");
  const [isConfirmVoteLoading, setIsConfirmVoteLoading] = useState(false);
  const [isConfirmOptLoading, setIsConfirmOptLoading] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [firstThreeVotes, setFirstThreeVotes] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [isAgree, setIsAgree] = useState(false);
  const [showUserAgreement, setShowUserAgreement] = useState(false);
  const [canSendAfterSeconds, setCanSendAfterSeconds] = useState(60);

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

          if (getEventResult?.data?.timeBegin) {
            setEventStartDate(getEventResult.data.timeBegin);
            // setEventStartDate("2024-6-4");
          }

          if (getEventResult?.data?.timeReload) {
            setEventReloadTime(parseInt(getEventResult.data.timeReload));
          }

          setIsWithInEventTime(
            new Date(getEventResult?.data?.timeBegin) < new Date() &&
              // new Date("2024-6-4") < new Date() &&
              new Date(getEventResult?.data?.timeEnd) > new Date()
          );

          //if the event is not started, return
          if (new Date(getEventResult.data.timeBegin) > new Date()) {
            // if (new Date("2024-6-4") > new Date()) {
            return;
          }

          const participantListResult = await axios.get(
            `/participant/${eventId}/${roundNumber}/100/${isAdminVar}?pw=${
              windowLocation.split("?")?.[1]?.split("=")?.[1]
            }`
          );

          const totalVotes = participantListResult.data.participants.reduce(
            (acc, item) => {
              return acc + item.votes;
            },
            0
          );
          setTotalVotes(totalVotes);

          if (participantListResult?.data?.participants?.length > 0) {
            const thirdList = participantListResult?.data.firstThree || [];
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
      if (!isPhoneValid || votes === 0 || !isAgree) {
        setIsConfirmVoteLoading(false);
        return;
      }
      //checking if the user is voted today
      const isVotedToday = await checkIsVotedToday();
      // const isVotedToday = false;

      if (isVotedToday) {
        setIsConfirmVoteLoading(false);
        setErrorMessage("今天已參與投票，請明天再參與");
        return;
      }

      const iswewaClubIdUsedToday = await checkIsWewaClubIdUsedToday();

      if (iswewaClubIdUsedToday) {
        setIsConfirmVoteLoading(false);
        setWewaClubId("");
        setErrorMessage("Wewa Club 會員編號今天已經使用過，請明天再使用");
        return;
      }

      const isPhoneVerified = await checkIsPhoneVerified();
      //console.log("isPhoneVerified:", isPhoneVerified);
      if (isPhoneVerified.success) {
        setIsPhoneVerified(true);
        setErrorMessage("");

        setTimeout(() => {
          setIsConfirmVoteLoading(false);
          setShowOptDialog(true);
        }, 500);
        return;
      } else if (isPhoneVerified.error) {
        setIsConfirmVoteLoading(false);
        setErrorMessage("發送驗證碼失敗, 請重試一次");
        return;
      }
      const senOptResult = await sendOtp();
      // const senOptResult = { success: true };
      //console.log("senOptResult:", senOptResult);

      if (senOptResult.success) {
        setErrorMessage("");
        setShowOptDialog(true);
      } else {
        setErrorMessage("發送驗證碼失敗, 請重試一次");
      }
      setIsConfirmVoteLoading(false);
    } catch (error) {
      //console.log("error:", error);
      setIsConfirmVoteLoading(false);
      setErrorMessage("發送驗證碼失敗, 請重試一次");
    }
  };

  // useEffect(() => {
  //   // console.log("eventStartDate:", eventStartDate);
  //   if (new Date() > new Date(eventStartDate)) {
  //     setShowVoteMethod(false);
  //   } else if (
  //     new Date(eventStartDate) !== "Invalid Date" &&
  //     new Date() < new Date(eventStartDate)
  //   ) {
  //     setShowVoteMethod(true);
  //   }
  // }, [eventStartDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (canSendAfterSeconds > 0) {
        setCanSendAfterSeconds(canSendAfterSeconds - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [canSendAfterSeconds]);

  useEffect(() => {
    setInterval(() => {
      if (
        new Date(eventStartDate) != "Invalid Date" &&
        new Date(eventDeadlineDate) != "Invalid Date"
      ) {
        setIsWithInEventTime(
          new Date(eventStartDate) < new Date() &&
            new Date(eventDeadlineDate) > new Date()
        );
      }
    }, eventReloadTime);
  }, [eventStartDate, eventDeadlineDate]);

  useEffect(() => {
    const downloadVoteRecord = async () => {
      try {
        if (!isAdmin) {
          return;
        }
        const result = await axios.get(
          `/vote-record/${eventId}/1/9999999999999/?pw=${
            window.location.href.split("?")?.[1]?.split("=")?.[1]
          }`
        );

        let data = result.data;
        data = data.map((item) => {
          return {
            參賽者: item.participantName,
            參賽者編號: item.participantParticipationNo,
            參賽者投票前票數: item.participantVoteBofore,
            參賽者投票後票數: item.participantVoteAfter,
            投票時間: moment(item.votedAt).format("YYYY-MM-DD HH:mm:ss"),
            投票者電話: item.voterPhone,
            "投票者 WeWa Club ID":
              item.userWWCCode?.includes("WWC") &&
              item.userWWCCode?.length === 11
                ? item.userWWCCode.toUpperCase()
                : "-",
            投票數: item.voteCount,
          };
        });

        // console.log("data:", data);

        setCsvData(data);
      } catch (error) {
        // console.log("error:", error);
      }
    };
    downloadVoteRecord();
  }, [isAdmin]);

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

  const checkIsWewaClubIdUsedToday = async () => {
    try {
      const result = await axios.get(
        `/check-wewa-club-id-used/${
          wewaClubId?.trim() !== "" ? wewaClubId : "ILOVEWEWACLUB"
        }/${eventId}`
      );
      //console.log("checkIsWewaClubIdUsedToday result:", result);
      return result.data.isWewaClubIdUsed;
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
      setIsConfirmOptLoading(false);
      setIsOptChecked(true);
    } catch (error) {
      setIsOptChecked(true);
      if (error.response.status === 400) {
        if (error.response.data.message === "The round is not open") {
          setErrorMessage("活動已經結束，投票失敗");
        } else if (
          error.response.data.message === "The participant is not found"
        ) {
          setErrorMessage("參賽者不存在，投票失敗");
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
      setCanSendAfterSeconds(60);
      const result = await axios.get(`/send-otp/${phoneNumber}`, {
        phoneNumber: phoneNumber,
      });
      // const result = {
      //   data: {
      //     success: true,
      //   },
      // };

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
          setErrorMessage("投票失敗, 請再試一次");
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
        }
        setIsConfirmVoteLoading(false);
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
      setIsAgree(false);
      setIsPhoneVerified(false);
      setErrorMessage("");
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

  const CheckBoxUseCallback = useCallback(() => {
    return (
      <Checkbox
        checked={isAgree}
        onChange={() => setIsAgree(!isAgree)}
        sx={{
          color: "#e04478",
          padding: "0px",
          paddingRight: "5px",
        }}
      />
    );
  }, [isAgree]);

  return (
    <Box className="finalPageContainer finalVoteBackGround">
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
                        src={`/event1/${selectedParticipant.chineseName}.jpg`}
                        // sx={{
                        //   width: {
                        //     xs: "95%",
                        //     sm: "95%",
                        //   },
                        //   height: {
                        //     xs: "100%",
                        //     sm: "100%",
                        //   },
                        //   boxShadow: "0px 0px 5px 0px #000000",
                        // }}
                        sx={{
                          width: { xs: 150, sm: 180 },
                          height: { xs: 150, sm: 180 },
                          boxShadow: "0px 0px 5px 0px #000000",
                          cursor: "pointer",
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
                    disabled={!isWithInEventTime}
                  >
                    <span className="voteButtonText">
                      {new Date() < new Date(eventStartDate)
                        ? "投票即將開始"
                        : new Date() > new Date(eventDeadlineDate)
                        ? "投票已結束"
                        : "投票"}
                    </span>
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
                  src={`/event1/${selectedParticipant.chineseName}.jpg`}
                  sx={{
                    width: 170,
                    height: 170,
                    boxShadow: "0px 0px 5px 0px #000000",
                    cursor: "pointer",
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
                    disabled={!isWithInEventTime}
                  >
                    <span className="voteButtonText">
                      {" "}
                      {new Date() < new Date(eventStartDate)
                        ? "投票即將開始"
                        : new Date() > new Date(eventDeadlineDate)
                        ? "投票已結束"
                        : "投票"}
                    </span>
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
                    // padding: "0px",
                    width: "100%",
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
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                  border:
                    confirmVoteIsClicked && !isAgree ? "2px solid red" : "",
                  borderRadius: "5px",
                }}
              >
                {/* <Checkbox
                  //need rerender

                  // key={Math.random()}
                  Checked={isAgree}
                  onChange={() => setIsAgree(!isAgree)}
                  sx={{
                    color: "#e04478",
                    padding: "0px",
                    paddingRight: "5px",
                  }}
                /> */}
                <CheckBoxUseCallback />

                <Typography
                  display={"inline"}
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "16px",
                    },
                    color: "#e04478",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setIsAgree(!isAgree);
                  }}
                >
                  本人已細閱並同意
                </Typography>
                <Typography
                  display={"inline"}
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "16px",
                    },
                    color: "#e04478",
                    fontWeight: "800",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    setShowUserAgreement(true);
                  }}
                >
                  本條款細則的所有內容{" "}
                </Typography>
                <Typography
                  sx={{
                    color: "#e04478",
                  }}
                >
                  *
                </Typography>
              </Box>
              <p className="inputErrorText">
                {!isAgree && confirmVoteIsClicked ? "請同意條款細則" : ""}
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
                  disabled={!isWithInEventTime}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {new Date() < new Date(eventStartDate)
                      ? "投票即將開始"
                      : new Date() > new Date(eventDeadlineDate)
                      ? "活動已結束"
                      : "投票"}
                  </Typography>
                </LoadingButton>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "40px",
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
                  display={isMd ? "inline" : "block"}
                  sx={{
                    fontSize: "16px",
                    color: "#e04478",
                    fontWeight: "500",
                  }}
                >
                  請輸入6位數字的手機驗證碼
                </Typography>
                <Typography
                  display={"inline"}
                  sx={{
                    marginLeft: {
                      xs: "0px",
                      md: "20px",
                    },
                  }}
                >
                  <Typography
                    display={"inline"}
                    sx={{
                      fontSize: "10px",
                      color: "#e04478",
                      fontWeight: "300",
                    }}
                  >
                    沒有收到驗證碼?
                    {canSendAfterSeconds > 0 ? (
                      `${canSendAfterSeconds}秒後可重新發送`
                    ) : (
                      <span
                        style={{
                          marginLeft: "5px",
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontSize: "12px",
                          fontWeight: "800",
                        }}
                        onClick={sendOtp}
                      >
                        重新發送
                      </span>
                    )}
                  </Typography>
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
                  disabled={otp.length !== 6 || !isWithInEventTime}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    {isWithInEventTime ? "確認投票" : "投票已結束"}
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

      <Dialog
        open={showUserAgreement}
        setOpen={setShowUserAgreement}
        direction="up"
        closeIcon
        zIndex={100000000}
      >
        <Box
          sx={{
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              color: "#e04478",
              fontWeight: "500",
              marginBottom: {
                xs: "100px",
                md: "0px",
              },
            }}
          >
            個人資料收集及用途 <br />
            1.1投選者在參與復活賽投票時需提供的個人資料包括但不限於電話號碼、WeWa
            Club會員編號等。這些資料將用於管理和組織投票活動，確保活動順利進行。
            <br />
            <br />
            1.2 投選者明白並同意其提供的個人資料可能會用於以下用途：
            <br />
            <br />
            比賽宣傳：投選者同意其名字等資料可能在比賽節目及宣傳活動中使用，包括但不限於官方網站、社交媒體、新聞稿等。
            <br />
            商業贊助宣傳：投選者同意其個人資料可能用於冠名贊助商的商業宣傳活動，包括但不限於冠名贊助商的廣告、促銷材料等。
            <br />
            <br />
            資料安全及保密 <br />
            2.1ICMA將採取合理的技術和組織措施，確保投選者的個人資料得到妥善保存並防止未經授權的訪問、披露、使用、修改或損失。
            <br />
            <br />
            2.2
            ICMA僅在舉辦歌唱比賽和相關活動的必要範圍內使用投選者的個人資料，除非事先獲得投選者的明確同意。
            <br /> <br />
            第三方分享 3.1
            <br />
            投選者的個人資料可能會與冠名贊助商以及比賽相關的第三方合作夥伴分享，但僅限於比賽宣傳和商業宣傳的合理範圍內。
            <br />
            <br />
            3.2
            ICMA將謹慎地選擇合作夥伴，確保他們也遵守相關的私隱條例和資料保護規定。
            <br />
            <br />
            投選者的權利 <br /> 4.1
            投選者有權隨時查閱、更正或刪除其提供的個人資料，只需提前通知ICMA。
            <br />
            <br />
            4.2
            投選者有權隨時撤回其對個人資料的使用同意，但這可能影響其投票資格。
            <br />
            <br />
            法規遵從 <br />
            5.1本條款細則將嚴格遵守香港個人資料（私隱）條例，並確保其符合當地和國際的相關法規。
            <br />
            <br />
            5.2
            ICMA將與法律專業人士合作，以確保條款細則在法律框架內得到適當的解釋和遵守。
            <br />
            <br />
            同意及確認 <br />
            6.1
            投選者在提交並確認投票時，即表示已經細閱並同意本條款細則的所有內容。
            <br />
            <br />
            6.2
            ICMA保留隨時修改本條款細則的權利，修改將通過官方網站公佈，並於生效前通知投選者。
            <br />
            <br />
            6.3
            如投選者未能遵守本條款或未符合參加資格之要求，ICMA有權即時取消其投票資格而不需另行通知。
            <br />
            <br />
            6.4
            投選者保證其參與本活動及所提供之資料並沒有(i)違反任何法律;(ii)侵犯任何第三方權利(包括但不限於著作權、專利權、商標權、商業機密或其他知識產權);及/或(iii)違反與任何第三方的協議或安排。
            <br />
            <br />
            聯絡方式
            <br /> 7.1
            如有任何有關個人資料使用的疑問或疑慮，請聯繫ICMA的同事，聯絡方式如下：
            <br />
            <br />
            聯絡人電話：（+852）55310262 (WhatsApp only)
            <br />
            以上條款細則由ICMA編製，目的是確保所有投選者的權益得到適當保護，同時符合相關的法規和標準。
            <br></br>
            <br></br>
            <br></br>
          </Typography>
        </Box>
      </Dialog>

      <Container disableGutters={isSm === false}>
        <Box>
          <Box className="columnBox">
            <img src={BannerImage} alt="Banner" className="BannerImage" />
          </Box>
        </Box>

        <Box
          className="realtimeRankingContainer"
          sx={{
            marginBottom: "40px",
          }}
        >
          <img
            src={RealtimeRankingLogo}
            alt="RealtimeRankingLogo"
            className="realtimeRankingLogo"
          />
          <Box className="realtimeRankingScrollableBox">
            {isListLoaded &&
              rankingList.map((item, index) => {
                return (
                  <Box
                    key={"rankingList" + index}
                    className="realtimeRankingBox"
                  >
                    <Typography
                      className="realtimeRankingText"
                      sx={{
                        fontSize: {
                          xs: "18px",
                          sm: "20px",
                          md: "22px",
                        },
                        fontWeight: "800",
                        fontFamily: "Noto Sans HK",
                        marginRight: "3px",
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Avatar
                      src={`/event1/${item.chineseName}.jpg`}
                      sx={{
                        width: { xs: 30, sm: 40 },
                        height: { xs: 30, sm: 40 },
                        boxShadow: "0px 0px 5px 0px #000000",
                      }}
                    />
                    <Typography
                      className="realtimeRankingText"
                      sx={{
                        fontSize: {
                          xs: "18px",
                          sm: "20px",
                          md: "22px",
                        },
                        fontWeight: "800",
                        fontFamily: "Noto Sans HK",
                        marginLeft: "3px",
                      }}
                    >
                      {item.chineseName}
                    </Typography>
                    <Typography
                      className="realtimeRankingText"
                      sx={{
                        fontSize: {
                          xs: "14px",
                          sm: "16px",
                          md: "18px",
                        },
                        fontWeight: "400",
                        fontFamily: "Noto Sans HK",
                        marginLeft: "4px",
                      }}
                    >
                      (300)
                    </Typography>
                  </Box>
                );
              })}
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
                marginBottom: "30px",
              }}
            >
              <Typography
                className="finalSectionTitleBold"
                sx={{
                  fontSize: {
                    xs: "40px",
                    sm: "42px",
                    md: "46px",
                  },
                  fontWeight: "bold",
                  fontFamily: "Noto Sans HK",
                }}
              >
                賽制及現場投票
              </Typography>
            </Box>
            <Container>
              <img src={ExPlainIcon} alt="Banner" className="BannerImage" />
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
                className="finalSectionTitleBold"
                sx={{
                  fontSize: {
                    xs: "40px",
                    sm: "42px",
                    md: "46px",
                  },
                  fontWeight: "bold",
                  fontFamily: "Noto Sans HK",
                }}
              >
                觀眾投票
              </Typography>
            </Box>
            <Container>
              <Box className="finalVoteSectionContainer finalVoteSectionPkContainer">
                <Typography
                  className="finalVoteSectionContainerText"
                  sx={{
                    fontSize: {
                      xs: "26px",
                      sm: "30px",
                      md: "36px",
                    },
                    fontWeight: "900",
                    fontFamily: "Noto Sans HK",
                  }}
                >
                  12強PK賽
                </Typography>
                <img
                  src={FinalPkLogo}
                  alt="FinalPkLogo"
                  className="finalVoteSectionContainerPkIcon"
                />
              </Box>
              <Box className="finalVoteSectionContainer finalVoteSectionResurrectionContainer">
                <Box>
                  <Box className="finalVoteSectionLiveContainer">
                    <Typography
                      className="finalVoteSectionLiveText"
                      sx={{
                        fontSize: {
                          xs: "12px",
                          sm: "14px",
                          md: "16px",
                        },
                        fontWeight: "400",
                        fontFamily: "Noto Sans HK",
                        color: "#FFF",
                      }}
                    >
                      現場觀眾投票佔100%
                    </Typography>
                  </Box>
                  <Typography
                    className="finalVoteSectionContainerText"
                    sx={{
                      fontSize: {
                        xs: "28px",
                        sm: "30px",
                        md: "36px",
                      },
                      fontWeight: "900",
                      fontFamily: "Noto Sans HK",
                    }}
                  >
                    復活投票
                  </Typography>
                </Box>
                <img
                  src={FinalResurrectionLogo}
                  alt="FinalVoteLogo"
                  className="finalVoteSectionContainerResurrectionIcon"
                />
              </Box>
              <Box className="finalVoteSectionContainer finalVoteSectionPopularityContainer">
                <Typography
                  className="finalVoteSectionContainerText"
                  sx={{
                    fontSize: {
                      xs: "24px",
                      sm: "30px",
                      md: "36px",
                    },
                    fontWeight: "900",
                    fontFamily: "Noto Sans HK",
                  }}
                >
                  Wewa最強人氣大獎
                </Typography>
                <img
                  src={FinalPopularityLogo}
                  alt="FinalVoteLogo"
                  className="finalVoteSectionContainerPopularityIcon"
                />
              </Box>
            </Container>
          </Box>
        </Box>
      </Container>
      <Footer type="home" isMd={isMd} isInheritBackground={true} />
    </Box>
  );
}

export default App;
