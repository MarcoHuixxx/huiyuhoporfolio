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
  const [eventType, setEventType] = useState("");
  const [selectBattle, setSelectBattle] = useState({});

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

  const onEventClickHandler = (type) => {
    window.history.pushState({}, "", `/final`);
    setEventType(type);
    setVotePageIsOpenHandler(true);
  };

  const onParticipantClick = (item) => {
    setSelectedParticipant(item);
    setVoteDialogIsOpen(true);
  };

  const PkView = () => {
    return [0, 1, 2, 3, 4, 5].map((item, index) => {
      return (
        <Grid
          container
          sx={{
            marginTop: index !== 0 ? "0px" : "40px",
            paddingY: "40px",
            borderBottom: "1px solid #FFF",
          }}
        >
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "20px",
                  md: "24px",
                },
                fontWeight: "bold",
                color: "#FFF",
                fontFamily: "Hiragino Sans W8",
              }}
            >
              Battle {index + 1}
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack
              direction="row"
              spacing={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                onClick={() => onParticipantClick(rankingList[index * 2])}
              >
                <Avatar
                  alt={selectedParticipant.name}
                  src={`/event1/${rankingList[index * 2].chineseName}.jpg`}
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
                    width: { xs: "60px", sm: "80px" },
                    height: { xs: "60px", sm: "80px" },
                    boxShadow: "0px 0px 5px 0px #000000",
                    cursor: "pointer",
                    marginBottom: "4px",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: {
                      xs: "12px",
                      md: "14px",
                    },
                    fontWeight: "bold",
                    color: "#FFF",
                  }}
                >
                  {rankingList[index * 2].chineseName}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "20px",
                    md: "24px",
                  },
                  fontWeight: "bold",
                  color: "#FFF",
                }}
              >
                VS
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                onClick={() => onParticipantClick(rankingList[index * 2 + 1])}
              >
                <Avatar
                  alt={selectedParticipant.name}
                  src={`/event1/${rankingList[index * 2 + 1].chineseName}.jpg`}
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
                    width: { xs: "60px", sm: "80px" },
                    height: { xs: "60px", sm: "80px" },
                    boxShadow: "0px 0px 5px 0px #000000",
                    cursor: "pointer",
                    marginBottom: "4px",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: {
                      xs: "12px",
                      md: "14px",
                    },
                    fontWeight: "bold",
                    color: "#FFF",
                  }}
                >
                  {rankingList[index * 2 + 1].chineseName}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      );
    });
  };

  const PopView = () => {
    return rankingList.map((item, index) => {
      return (
        <Grid
          container
          sx={{
            marginTop: index !== 0 ? "0px" : "40px",
            paddingY: "20px",
            marginBottom: "2px",
            // borderBottom: "1px solid #FFF",
            backgroundColor: "rgba(255,255,255,0.1)",
            cursor: "pointer",
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack
              direction="row"
              spacing={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
                onClick={() => onParticipantClick(item)}
              >
                <Avatar
                  alt={selectedParticipant.name}
                  src={`/event1/${item.chineseName}.jpg`}
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
                    width: { xs: "60px", sm: "80px" },
                    height: { xs: "60px", sm: "80px" },
                    boxShadow: "0px 0px 5px 0px #000000",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: {
                      xs: "12px",
                      md: "14px",
                    },
                    fontWeight: "bold",
                    color: "#FFF",
                  }}
                >
                  {item.chineseName}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      );
    });
  };

  const RecView = () => {
    if (rankingList.length != 0) {
      return (
        <Box
          sx={{
            marginTop: "60px",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "20px",
                md: "24px",
              },
              fontWeight: "bold",
              color: "#FFF",
              textAlign: "center",
              fontFamily: "Noto Sans HK",
              textShadow: "0px 0px 5px #000000",
            }}
          >
            復活你心水的選手
          </Typography>
          <Typography
            sx={{
              fontSize: {
                xs: "34px",
                md: "38px",
              },
              fontWeight: "bold",
              color: "#FFF",
              textAlign: "center",
              fontFamily: "Noto Sans HK",
              textShadow: "0px 0px 5px #000000",
              marginLeft: "20px",
            }}
          >
            進入下回合！
          </Typography>

          {[0, 1, 2, 3, 4, 5].map((item, index) => {
            return (
              <Grid
                container
                sx={{
                  marginTop: index !== 0 ? "0px" : "40px",
                  paddingY: "20px",
                  // borderBottom: "1px solid #FFF",
                }}
              >
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "20px",
                        md: "24px",
                      },
                      fontWeight: "bold",
                      color: "#FFF",
                      fontFamily: "Hiragino Sans W8",
                    }}
                  >
                    Battle {index + 1}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={8}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                      onClick={() =>
                        onParticipantClick(rankingList?.[index * 2])
                      }
                    >
                      <Avatar
                        alt={rankingList?.[index * 2].name}
                        src={`/event1/${
                          rankingList?.[index * 2].chineseName
                        }.jpg`}
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
                          width: { xs: "60px", sm: "80px" },
                          height: { xs: "60px", sm: "80px" },
                          boxShadow: "0px 0px 5px 0px #000000",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "12px",
                            md: "14px",
                          },
                          fontWeight: "bold",
                          color: "#FFF",
                        }}
                      >
                        {rankingList?.[index * 2].chineseName}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            );
          })}
        </Box>
      );
    }
  };
  return (
    <Box className="finalPageContainer finalVoteBackGround">
      <Dialog
        open={votePageIsOpen}
        setOpen={setVotePageIsOpenHandler}
        // onClose={handleDialogClose}
        fullScreen
      >
        <Container maxWidth="md"></Container>
        {!isMd && (
          <Box className="finalMobileVotePageBox">
            <Container
              maxWidth="sm"
              sx={{
                paddingY: "20px",
                display: {
                  xs: "block",
                  md: "none",
                },
                position: "relative",
              }}
            >
              <Box className="finalVoteTitleBox">
                <Typography
                  className="finalVoteSectionContainerText"
                  sx={{
                    fontSize: {
                      xs: "20px",
                      md: "24px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  {eventType === "pk"
                    ? "12強PK賽"
                    : eventType === "pop"
                    ? "WeWa最強人氣大獎"
                    : "復活投票"}
                </Typography>
                <Box
                  sx={{
                    height: "1.5px",
                    width: eventType === "pop" ? "220px" : "120px",
                    background: "#e81b78",
                    marginY: "4px",
                  }}
                />
                <Box
                  className="finalVoteSectionLiveContainer"
                  sx={{
                    marginTop: "6px",
                  }}
                >
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
                    {eventType === "pk"
                      ? "現場觀眾投票佔10%"
                      : "100%由現場觀眾投票"}
                  </Typography>
                </Box>

                {/* <img src={icmaIcon} alt="icma" className="finalIcmaIcon" /> */}
              </Box>
              <Box className="finalIcmaIconMobileBox">
                <img src={icmaIcon} alt="icma" className="finalIcmaIcon" />
              </Box>
              <Container maxWidth="sm">
                {eventType === "pk" ? (
                  <PkView />
                ) : eventType === "pop" ? (
                  <PopView />
                ) : (
                  <RecView />
                )}
              </Container>
              <Footer type="votePage" isMd={isMd} isFinal={true} />
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
          <Box className="finalWebVotePageBox">
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
              <Box className="finalVoteTitleBox">
                <Typography
                  className="finalVoteSectionContainerText"
                  sx={{
                    fontSize: {
                      xs: "20px",
                      md: "24px",
                    },
                    fontWeight: "bold",
                  }}
                >
                  {eventType === "pk"
                    ? "12強PK賽"
                    : eventType === "pop"
                    ? "WeWa最強人氣大獎"
                    : "復活投票"}
                </Typography>
                <Box
                  sx={{
                    height: "1.5px",
                    width: eventType === "pop" ? "220px" : "120px",
                    background: "#e81b78",
                    marginY: "4px",
                  }}
                />
                <Box
                  className="finalVoteSectionLiveContainer"
                  sx={{
                    marginTop: "6px",
                  }}
                >
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
                    {eventType === "pk"
                      ? "現場觀眾投票佔10%"
                      : "100%由現場觀眾投票"}
                  </Typography>
                </Box>

                {/* <img src={icmaIcon} alt="icma" className="finalIcmaIcon" /> */}
              </Box>
              <Box
                sx={{
                  maxWidth: "30%",
                  maxHeight: "30%",
                }}
                className="finalIcmaIconWebBox"
              >
                <img src={icmaIcon} alt="icma" className="finalIcmaIcon" />
              </Box>

              <Container
                maxWidth="sm"
                sx={{
                  marginTop: "80px",
                }}
              >
                {eventType === "pk" ? (
                  <PkView />
                ) : eventType === "pop" ? (
                  <PopView />
                ) : (
                  <RecView />
                )}
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "-20px",
              }}
            >
              <Typography
                display={isMd ? "inline" : "block"}
                sx={{
                  fontSize: "16px",
                  color: "#e04478",
                  fontWeight: "700",
                  fontFamily: "Hiragino Sans W8",
                }}
              >
                {eventType === "pk"
                  ? "Battle " + (selectBattle?.number || 1)
                  : eventType === "pop"
                  ? "WeWa最強人氣大獎"
                  : "復活投票"}
              </Typography>
              <Box
                sx={{
                  height: "1px",
                  width: eventType === "pop" ? "220px" : "120px",
                  background: "#e81b78",
                  marginY: "4px",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
                paddingY: "10px",
                paddingX: "50px",
              }}
            >
              <Avatar
                alt={selectedParticipant.name}
                src={`/event1/${selectedParticipant.chineseName}.jpg`}
                sx={{
                  width: { xs: "100px", sm: "120px" },
                  height: { xs: "100px", sm: "120px" },
                  boxShadow: "0px 0px 5px 0px #000000",
                  cursor: "pointer",
                  marginBottom: "4px",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  marginTop: "-30px",
                  zIndex: 9999999999,
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: "20px",
                      md: "24px",
                    },
                    fontWeight: "bold",
                    color: "#FFF",
                    textShadow: "0px 0px 5px #000000",
                  }}
                >
                  {selectedParticipant.chineseName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "20px",
                      md: "24px",
                    },
                    fontWeight: "bold",
                    color: "#FFF",
                    textShadow: "0px 0px 5px #000000",
                    marginTop: "-10px",
                  }}
                >
                  {selectedParticipant.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "300",
                    color: "#e81b78",
                  }}
                >
                  {selectedParticipant.university}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                marginY: "20px",
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
                  {isWithInEventTime ? "投票" : "投票已結束"}
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
        </Dialog>
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
              <Box
                className="finalVoteSectionContainer finalVoteSectionPkContainer"
                onClick={() => {
                  onEventClickHandler("pk");
                }}
              >
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
              <Box
                className="finalVoteSectionContainer finalVoteSectionResurrectionContainer"
                onClick={() => {
                  onEventClickHandler("res");
                }}
              >
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
              <Box
                className="finalVoteSectionContainer finalVoteSectionPopularityContainer"
                onClick={() => {
                  onEventClickHandler("pop");
                }}
              >
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
