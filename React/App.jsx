import { useState, useEffect, useCallback, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Container from "@mui/material/Container";
import BannerImage from "./assets/ICMA復活賽投票.png";
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
import InstagramIcon from "./assets/IG-Subpage參賽者IG.svg";
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
import icmaIcon from "./assets/ICMA2026-Footer.png";
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
import huashengIcon from "./assets/huansheng.svg";
import sponsor2Icon from "./assets/sponsor2.svg";

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
  const [isMember, setIsMember] = useState(false);
  const [isMemberChecked, setIsMemberChecked] = useState(false);
  const [isMemberLoading, setIsMemberLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const recaptchaResendRef = useRef(null);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  useEffect(() => {
    const fetchRankingList = async () => {
      try {
        if (!isListLoaded) {
          const windowLocation = window.location.href;

          const isAdminVar = windowLocation.includes(
            "664b20f7cbd11e4bca2386c8",
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
              new Date(getEventResult?.data?.timeEnd) > new Date(),
          );

          //if the event is not started, return
          if (new Date(getEventResult.data.timeBegin) > new Date()) {
            // if (new Date("2024-6-4") > new Date()) {
            return;
          }

          const participantListResult = await axios.get(
            `/participant/${eventId}/${roundNumber}/100/${isAdminVar}?pw=${
              windowLocation.split("?")?.[1]?.split("=")?.[1]
            }`,
          );

          const totalVotes = participantListResult.data.participants.reduce(
            (acc, item) => {
              return acc + item.votes;
            },
            0,
          );
          setTotalVotes(totalVotes);

          if (participantListResult?.data?.participants?.length > 0) {
            const thirdList = participantListResult?.data.firstThree || [];
            setThirdRankingList(thirdList);
            setRankingList(participantListResult?.data?.participants);
            setFirstThreeVotes(
              participantListResult?.data?.firstThreeRaningPercent,
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
    0: "#1",
    1: "#2",
    2: "#3",
  };

  const onParticipantClick = (item) => {
    window.history.pushState({}, "", `/voting-2026`);
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

      // reCAPTCHA check
      const captchaToken = recaptchaRef.current?.getValue();
      if (!captchaToken) {
        setIsConfirmVoteLoading(false);
        setErrorMessage("請先完成 reCAPTCHA 驗證");
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
        setErrorMessage("華盛証券會員編號今天已經使用過，請明天再使用");
        return;
      }

      const isPhoneVerified = await checkIsPhoneVerified();
      //console.log("isPhoneVerified:", isPhoneVerified);
      if (isPhoneVerified.success) {
        setIsPhoneVerified(true);
        setErrorMessage("");
        setIsConfirmVoteLoading(false);
        return;
      } else if (isPhoneVerified.error) {
        setIsConfirmVoteLoading(false);
        setErrorMessage("發送驗證碼失敗, 請重試一次");
        return;
      }
      const senOptResult = await sendOtp(captchaToken);
      // reset reCAPTCHA so the next send requires a new check
      recaptchaRef.current?.reset();
      setRecaptchaToken("");
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
            new Date(eventDeadlineDate) > new Date(),
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
          }`,
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
            "投票者 華盛証券會員編號":
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
        }/${eventId}`,
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
        `/check-phone-verified/${phoneNumber}/${eventId}`,
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

  const sendOtp = async (captchaToken) => {
    try {
      setCanSendAfterSeconds(60);
      const result = await axios.get(`/send-otp/${phoneNumber}`, {
        params: { captchaToken },
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
          setVoteDialogIsOpen(false);
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

      setIswewaClubIdValid(iswewaClubIdValidVar);
    };

    iswewaClubIdValidHandler();
  }, [wewaClubId]);

  // When phone becomes valid, call check-member-number and set vote count accordingly
  useEffect(() => {
    const checkMember = async () => {
      if (!isPhoneValid) {
        setIsMember(false);
        setIsMemberChecked(false);
        setVotes(0);
        return;
      }
      if (phoneNumber.length !== 14) {
        return;
      }

      try {
        setIsMemberLoading(true);
        const result = await axios.post("/check-member-number", {
          phone: phoneNumber,
        });
        const memberStatus = result.data.success === true;
        setIsMember(memberStatus);
        setIsMemberChecked(true);
        setVotes(memberStatus ? 2 : 1);
      } catch {
        setIsMember(false);
        setIsMemberChecked(true);
        setVotes(1);
      } finally {
        setIsMemberLoading(false);
      }
    };
    checkMember();
  }, [isPhoneValid, phoneNumber]);

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
      //console.log("voteDialogIsOpen:", voteDialogIsOpen);
      setIsAgree(false);
      setIsPhoneVerified(false);
      setErrorMessage("");
      setIsOptChecked(false);
      setIsOptValid(false);
      setIsPhoneValid(false);
      // only reset vote success when the whole vote page closes, not just the dialog
      if (!votePageIsOpen) {
        setIsVoteSuccess(false);
      }
      setPhoneNumber("");
      setWewaClubId("");
      setVotes(0);
      setOtp("");
      setIswewaClubIdValid(false);
      setShowOptDialog(false);
      setConfirmVoteIsClicked(false);
      setIsMember(false);
      setIsMemberChecked(false);
      setIsMemberLoading(false);
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
          color: "#32BF72",
          padding: "0px",
          paddingRight: "5px",
        }}
      />
    );
  }, [isAgree]);

  // format start/end dates from server for display
  const startDateObj = eventStartDate ? new Date(eventStartDate) : null;
  const endDateObj = eventDeadlineDate ? new Date(eventDeadlineDate) : null;

  const formatDateLabel = (d) => {
    if (!d || isNaN(d)) return "--.-- (---)";
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    // force English short weekday abbreviations (Sun, Mon, ...)
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    return `${month}.${day} (${weekday})`;
  };

  const formatTime = (d) => {
    if (!d || isNaN(d)) return "--:--";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  return (
    <Box className="PageContainer">
      {/* Fixed Top Bar */}
      {/* Fixed Top Bar */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: { xs: "80px", md: "60px" },
          backgroundColor: "#fff",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "space-between", md: "center" },
            gap: { xs: "15px", sm: "30px", md: "40px" },
            width: "100%",
            px: { xs: "50px", md: 0 },
            maxWidth: { md: "900px" },
          }}
        >
          {/* Sponsor 1 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: { xs: "10px", sm: "12px", md: "14px" },
                fontWeight: "500",
                color: "#333",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                mb: { xs: "4px", md: 0 },
                fontFamily: "MStiffHei HK",
              }}
            >
              全力贊助
            </Typography>
            <Box
              component="img"
              src={huashengIcon}
              alt="huasheng"
              sx={{
                height: { xs: "16px", sm: "20px", md: "24px" },
                width: "auto",
                display: "block",
              }}
            />
          </Box>

          {/* Separator */}
          <Box
            component="span"
            sx={{
              display: { xs: "none", md: "flex" }, // hide on mobile so sponsors sit left/right
              alignItems: "center",
              justifyContent: "center",
              height: "60px",
              fontSize: { xs: "20px", sm: "24px", md: "28px" },
              color: "#ccc",
              fontWeight: 300,
              lineHeight: 1,
            }}
          >
            |
          </Box>

          {/* Sponsor 2 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: { xs: "10px", sm: "12px", md: "14px" },
                fontWeight: "500",
                color: "#333",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                mb: { xs: "4px", md: 0 },
                fontFamily: "MStiffHei HK",
              }}
            >
              合作媒體
            </Typography>
            <Box
              component="img"
              src={sponsor2Icon}
              alt="sponsor2"
              sx={{
                height: { xs: "24px", sm: "25px", md: "30px" },
                width: "auto",
                display: "block",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Dialog
        open={votePageIsOpen}
        setOpen={setVotePageIsOpenHandler}
        // onClose={handleDialogClose}
        fullScreen
      >
        {true && (
          <Box className="mobileVotePageBox">
            {/* use home banner on vote page (mobile) */}
            <Box
              component="img"
              src={BannerImage}
              alt="Banner"
              className="BannerImage"
              sx={{ width: "100%", height: "auto", display: "block" }}
            />
            <Container
              // maxWidth="sm"
              sx={{
                paddingY: "20px",
                display: "block",
              }}
            >
              <Container>
                {/* Back to home button above the participant card */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Button
                    sx={{
                      backgroundColor: "#fff",
                      color: "#32BF72",
                      borderRadius: "24px",
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      fontWeight: 700,
                      fontFamily: "MStiffHei HK",
                    }}
                    onClick={() => {
                      // redirect to home
                      setVotePageIsOpen(false);
                    }}
                  >
                    回到首頁
                  </Button>
                </Box>
                {/* Centered black card like home boxes */}
                <Box
                  sx={{
                    backgroundColor: "#000",
                    borderRadius: "24px",
                    color: "#fff",
                    boxShadow:
                      "0 0 30px rgba(51, 164, 102, 1), 0 10px 30px rgba(0, 0, 0, 0.3)",
                    width: { xs: "92%", md: "40%" },
                    mx: "auto",
                    // increase padding by 5px: theme spacing 2 -> 16px, 4 -> 32px; add 5px => 21px / 37px
                    px: { xs: "21px", md: "37px" },
                    py: { xs: "21px", md: "37px" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 1,
                  }}
                >
                  {/* Vote success banner */}
                  {isVoteSuccess && (
                    <Box
                      sx={{
                        border: "1px solid rgba(255,255,255,0.9)",
                        px: { xs: 3, md: 5 },
                        py: { xs: 1, md: 1.5 },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#fff",
                          fontFamily: "Mantou Sans",
                          fontSize: { xs: "24px", md: "28px" },
                        }}
                      >
                        投票成功
                      </Typography>
                    </Box>
                  )}

                  {/* First line: participant no */}
                  <Typography
                    sx={{
                      color: "#32BF72",

                      fontFamily: "Mantou Sans",
                      fontSize: { xs: "28px", md: "28px" },
                    }}
                  >
                    {String(selectedParticipant.participationNo).padStart(
                      2,
                      "0",
                    )}
                  </Typography>

                  {/* Second line: 參賽者 */}
                  <Typography
                    sx={{
                      color: "#32BF72",
                      fontFamily: "Mantou Sans",
                      fontSize: { xs: "28px", md: "28px" },
                    }}
                  >
                    {selectedParticipant.chineseName}
                  </Typography>

                  {/* Third line: university | studying year | IG icon | IG handle */}
                  <Stack
                    direction="column"
                    spacing={0.5}
                    alignItems="center"
                    className="participantInfoStack"
                    sx={{ mt: 1, width: "100%" }}
                  >
                    {/* Row 1: University + Study Year */}
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography
                        sx={{
                          color: "#fff",
                          fontFamily: "MStiffHei HK",
                          fontSize: "inherit",
                          "@media (min-width:1400px)": { fontSize: "20px" },
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedParticipant.university}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontFamily: "Caviar Dreams Bold",
                          fontSize: "inherit",
                          "@media (min-width:1400px)": { fontSize: "20px" },
                          whiteSpace: "nowrap",
                        }}
                      >
                        Year {selectedParticipant.studyingYear}
                      </Typography>
                    </Stack>

                    {/* Row 2: IG icon + IG handle */}
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box
                        component="img"
                        src={InstagramIcon}
                        alt="ig"
                        sx={{
                          width: "1em",
                          height: "1em",
                          filter: "brightness(0) invert(1)",
                          flexShrink: 0,
                        }}
                      />
                      <Box
                        component="a"
                        href={
                          selectedParticipant.instagram
                            ? `https://www.instagram.com/${selectedParticipant.instagram.replace(/^@/, "")}`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Typography
                          title={selectedParticipant.instagram}
                          sx={{
                            color: "#fff",
                            fontFamily: "Caviar Dreams Bold",
                            fontSize: "inherit",
                            "@media (min-width:1400px)": { fontSize: "20px" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                            cursor: "pointer",
                          }}
                        >
                          {selectedParticipant.instagram}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>

                  {/* Participant avatar */}
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Avatar
                      alt={selectedParticipant.name}
                      src={`/event1/${selectedParticipant.chineseName}.jpg`}
                      sx={{
                        width: { xs: 150, sm: 180 },
                        height: { xs: 150, sm: 180 },
                        boxShadow: "0px 0px 5px 0px #000000",
                      }}
                    />
                  </Box>

                  {/* Vote button centered (moved to just under avatar) */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      mt: 2,
                    }}
                  >
                    <Button
                      sx={{
                        backgroundColor: "#32BF72",
                        color: "#ffffff",
                        borderRadius: "75px",
                        padding: "6px 30px",
                        boxShadow: "0px 0px 2px 0px #000000",
                        fontFamily: "MStiffHei HK",
                        ":hover": { backgroundColor: "#2fb960" },
                      }}
                      onClick={onVoteButonClick}
                      disabled={!isWithInEventTime}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "14px",

                          color: "inherit",
                          fontFamily: "MStiffHei HK",
                        }}
                      >
                        {new Date() < new Date(eventStartDate)
                          ? "投票即將開始"
                          : new Date() > new Date(eventDeadlineDate)
                            ? "投票已結束"
                            : "投票"}
                      </Typography>
                    </Button>
                  </Box>

                  {/* 複賽影片 left aligned then video */}
                  <Box sx={{ width: "100%", mt: 2 }}>
                    <Typography
                      sx={{
                        color: "#fff",
                        textAlign: { xs: "center", md: "left" },
                        mb: 1,
                        fontFamily: "MStiffHei HK",
                      }}
                    >
                      複賽影片
                    </Typography>
                    {selectedParticipant.video && (
                      <YoutubeEmbed embedId={selectedParticipant.video} />
                    )}
                  </Box>
                </Box>
              </Container>
            </Container>
            <Footer type="home" isMd={isMd} />
          </Box>
        )}

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
                  color: "#32BF72",
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
                  color: "#32BF72",
                  fontWeight: "500",
                  marginTop: "20px",
                  marginBottom: "10px",
                }}
              >
                投取票數
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #32BF72",
                  borderRadius: "5px",
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isMemberLoading ? (
                  <Typography sx={{ color: "#888", fontSize: "14px" }}>
                    查詢會員資格中…
                  </Typography>
                ) : isMemberChecked ? (
                  <Typography
                    sx={{
                      color: "#32BF72",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    {votes} {isMember ? "（華盛証券會員）" : "（非會員）"}
                  </Typography>
                ) : (
                  <Typography sx={{ color: "#888", fontSize: "14px" }}>
                    請先輸入電話號碼
                  </Typography>
                )}
              </Box>

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
                    color: "#32BF72",
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
                    color: "#32BF72",
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
                    color: "#32BF72",
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
                    color: "#32BF72",
                  }}
                >
                  *
                </Typography>
              </Box>
              <p className="inputErrorText">
                {!isAgree && confirmVoteIsClicked ? "請同意條款細則" : ""}
              </p>

              {/* reCAPTCHA widget — must be checked before sending OTP */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token || "")}
                  onExpired={() => setRecaptchaToken("")}
                />
              </Box>
              {confirmVoteIsClicked && !recaptchaToken && (
                <p className="inputErrorText" style={{ textAlign: "center" }}>
                  請先完成 reCAPTCHA 驗證
                </p>
              )}

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
                    backgroundColor: "#32BF72",
                    color: "#ffffff",
                    borderRadius: "75px",
                    padding: "10px 30px",
                    boxShadow: "0px 0px 2px 0px #000000",
                    ":hover": {
                      backgroundColor: "#32BF72",
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
          ) : isVoteSuccess ? null : (
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
                    color: "#32BF72",
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
                      color: "#32BF72",
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
                        onClick={async () => {
                          const resendToken =
                            recaptchaResendRef.current?.getValue();
                          if (!resendToken) {
                            setErrorMessage("請先完成 reCAPTCHA 驗證");
                            return;
                          }
                          setErrorMessage("");
                          await sendOtp(resendToken);
                          recaptchaResendRef.current?.reset();
                        }}
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
              {/* reCAPTCHA for resend — only shows when resend is available */}
              {canSendAfterSeconds <= 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "12px",
                  }}
                >
                  <ReCAPTCHA
                    ref={recaptchaResendRef}
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={() => {}}
                    onExpired={() => {}}
                    size="normal"
                  />
                </Box>
              )}
              <Box
                sx={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <LoadingButton
                  sx={{
                    backgroundColor: "#32BF72",
                    color: "#ffffff",
                    borderRadius: "75px",
                    padding: "10px 30px",
                    boxShadow: "0px 0px 2px 0px #000000",
                    ":hover": {
                      backgroundColor: "#32BF72",
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
              color: "#32BF72",
              fontWeight: "500",
              marginBottom: {
                xs: "100px",
                md: "0px",
              },
            }}
          >
            個人資料收集及用途 <br />
            1.1投選者在參與復活賽投票時需提供的個人資料包括但不限於電話號碼、華盛証券會員編號等。這些資料將用於管理和組織投票活動，確保活動順利進行。
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
        <Box
          className="section"
          sx={{
            width: { xs: "90%", md: "40%" },
            mx: "auto",
          }}
        >
          <Box className="columnBox">
            {/* Banner image */}
            <Box
              component="img"
              src={BannerImage}
              alt="Banner"
              className="BannerImage"
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />

            {/* Voting date section (centered, white text) */}
            <Box sx={{ textAlign: "center", color: "#fff", mt: 1 }}>
              <Typography
                sx={{
                  fontSize: { xs: "28px", md: "40px" },
                  // fontWeight: 400,
                  fontFamily: "Mantou Sans",
                  color: "#FFFFFF",
                  textShadow: "0 2px 6px rgba(0,0,0,0.45)",
                  mb: 1.5,
                  lineHeight: 1.1,
                }}
              >
                投票日期
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Box
                  sx={{
                    border: "1px solid rgba(255,255,255,0.9)",
                    px: { xs: 2, md: 4 },
                    py: { xs: 1, md: 2 },
                    display: "flex",
                    gap: { xs: 2, md: 6 },
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", md: "16px" },
                        fontWeight: 500,
                        fontFamily: "Caviar Dreams",
                        whiteSpace: { xs: "normal", md: "nowrap" },
                        display: { xs: "block", md: "inline-flex" },
                        alignItems: "center",
                      }}
                    >
                      {formatDateLabel(startDateObj)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "24px", md: "28px" },
                        fontWeight: 400,
                        fontFamily: "Caviar Dreams",
                        whiteSpace: { xs: "normal", md: "nowrap" },
                        display: { xs: "block", md: "inline-flex" },
                        alignItems: "center",
                      }}
                    >
                      {formatTime(startDateObj)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 26, md: 100 },
                        borderBottom: "1px solid rgba(255,255,255,0.9)",
                      }}
                    />
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", md: "16px" },
                        fontWeight: 400,
                        fontFamily: "Caviar Dreams",
                        whiteSpace: { xs: "normal", md: "nowrap" },
                        display: { xs: "block", md: "inline-flex" },
                        alignItems: "center",
                      }}
                    >
                      {formatDateLabel(endDateObj)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "24px", md: "28px" },
                        fontWeight: 500,
                        fontFamily: "Caviar Dreams",
                        whiteSpace: { xs: "normal", md: "nowrap" },
                        display: { xs: "block", md: "inline-flex" },
                        alignItems: "center",
                      }}
                    >
                      {formatTime(endDateObj)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* concise 投票方法 under 投票日期 */}
            <Box sx={{ textAlign: "center", color: "#fff", mt: 3, px: 2 }}>
              <Typography
                sx={{
                  fontSize: { xs: "28px", md: "40px" },
                  // fontWeight: 400,
                  fontFamily: "Mantou Sans",
                  color: "#FFFFFF",
                  textShadow: "0 2px 6px rgba(0,0,0,0.45)",
                  mb: 1.5,
                  lineHeight: 1.1,
                }}
              >
                投票方法
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "start", sm: "center" },
                  ml: "10px",
                }}
              >
                <Stack
                  direction={{ md: "column" }}
                  spacing={{ xs: 2, md: 3 }}
                  justifyContent="center"
                  alignItems="flex-start"
                  // sx={{ width: "fit-content", maxWidth: "100%", mx: "auto" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        minWidth: 20,
                        height: 20,
                        minHeight: 20,
                        flexShrink: 0,
                        aspectRatio: "1 / 1",
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontFamily: "Caviar Dreams",
                      }}
                    >
                      1
                    </Box>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: { xs: "13px", md: "15px" },
                        fontFamily: "MStiffHei HK",
                        textAlign: "left",
                        lineHeight: 1.4,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      投票期間，每人每日皆可投選一次
                    </Typography>
                  </Box>

                  {/* item 2 + button grouped vertically so button sits under item 2 */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          minWidth: 20,
                          height: 20,
                          minHeight: 20,
                          flexShrink: 0,
                          aspectRatio: "1 / 1",
                          borderRadius: "50%",
                          border: "1px solid rgba(255,255,255,0.9)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontFamily: "Caviar Dreams",
                        }}
                      >
                        2
                      </Box>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontSize: { xs: "13px", md: "15px" },
                          fontFamily: "MStiffHei HK",
                          textAlign: "left",
                          lineHeight: 1.4,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        註冊成為華盛証券會員可額外獲得一票，即每日可投選兩票（只限同一名參賽者）
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        marginTop: 0,
                        marginBottom: 1,
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#fff",
                          color: "#32BF72",
                          borderRadius: "24px",
                          textTransform: "none",
                          px: 3,
                          py: 1,
                        }}
                        onClick={() => {
                          //open a new tab to the registration page without the base url

                          const href =
                            "https://www.vbkr.com/hd/account-open-promotion/scnl/ZPCQ/index";
                          window.open(href, "_blank", "noopener,noreferrer");
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "14px", md: "16px" },
                            color: "inherit",
                            fontFamily: "MStiffHei HK",
                          }}
                        >
                          立即登記會員
                        </Typography>
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        minWidth: 20,
                        height: 20,
                        minHeight: 20,
                        flexShrink: 0,
                        aspectRatio: "1 / 1",
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontFamily: "Caviar Dreams",
                      }}
                    >
                      3
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        minHeight: 32,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#fff",
                          fontSize: { xs: "13px", md: "15px" },
                          fontFamily: "MStiffHei HK",
                          textAlign: "left",
                          lineHeight: 1.4,
                        }}
                      >
                        總得票最高的前兩名將獲得復活資格
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>

        {rankingList.length > 0 && new Date(eventStartDate) < new Date() ? (
          <>
            <Box
              className="columnBox"
              sx={{
                backgroundColor: "#1a1a1a",
                borderRadius: "24px",
                width: { xs: "80%", md: "60%" },
                mx: "auto",
                padding: { xs: 2, md: 4 },
                mt: 4,
                boxShadow:
                  "0 0 30px rgba(51, 164, 102, 1), 0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box className="section" sx={{ border: "none", marginBottom: 2 }}>
                <Box className="columnBox">
                  <Box
                    className="titleBox"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      className="sectionTitleBold"
                      sx={{
                        fontSize: { xs: "28px", md: "40px" },
                        // fontWeight: 400,
                        fontFamily: "Mantou Sans",
                        color: "#32BF72",
                        textShadow: "none",
                        mb: 1.5,
                        lineHeight: 1.1,
                      }}
                    >
                      投票走勢
                    </Typography>
                  </Box>
                  <Container sx={{ px: { xs: 1, md: 2 } }}>
                    <Grid container spacing={1}>
                      {thirdRankingList.map((item, index) => (
                        <Grid
                          item
                          xs={12}
                          key={item.name + item.participationNo}
                          sx={{ display: "flex", marginTop: "6px" }}
                        >
                          <Grid item className="rankingNumberBox" xs={3}>
                            <Box
                              className="rankingNumberInnerBox"
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                className="rankingNumberText"
                                sx={{
                                  fontSize: {
                                    xs: "28px",
                                    sm: "32px",
                                    md: "36px",
                                  },
                                  // fontWeight: "800",
                                  fontFamily: "Mantou Sans",
                                  color: "#32BF72",
                                }}
                              >
                                {rankingTitleMapping[index]}
                              </Typography>
                              <Typography
                                className="rankingNumberText"
                                sx={{
                                  fontSize: {
                                    xs: "12px",
                                    sm: "14px",
                                    md: "18px",
                                  },
                                  // fontWeight: "800",
                                  fontFamily: "MStiffHei HK",
                                  color: "#FFFFFF",
                                }}
                              >
                                {item.chineseName}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={9}>
                            <Box className="rankingContentBox">
                              <Box className="iconRankingBox">
                                <Avatar
                                  alt={item.name}
                                  src={`/event1/${item.chineseName}.jpg`}
                                  sx={{
                                    width: "44px",
                                    height: "44px",
                                  }}
                                />
                                <Box
                                  className="rankingVotesBox"
                                  sx={{
                                    backgroundColor: "#32BF72",
                                    borderRadius: "2px",
                                    height: "26px",
                                    width:
                                      firstThreeVotes[index].toFixed(2) * 80 +
                                      "%",
                                    marginLeft: "-10px",
                                  }}
                                />
                              </Box>
                              {/* <Box className="nameTextBox">
                                <Stack direction="row" spacing={0.4}>
                                  <Typography
                                    className="rankingNameText"
                                    sx={{
                                      fontSize: 18 - index * 4 + "px",
                                      fontFamily: "gensen font master",
                                      color: "#32BF72",
                                    }}
                                  >
                                    {item.participationNo}
                                  </Typography>
                                  <Typography
                                    className="rankingNameText"
                                    sx={{
                                      fontSize: 18 - index * 4 + "px",
                                      fontFamily: "gensen font master",
                                      color: "#32BF72",
                                    }}
                                  >
                                    {item.chineseName}
                                  </Typography>
                                  <Typography
                                    className="rankingNameText"
                                    sx={{
                                      fontSize: 18 - index * 4 + "px",
                                      fontFamily: "gensen font master",
                                      color: "#32BF72",
                                    }}
                                  >
                                    {item.name}
                                  </Typography>
                                  {isAdmin && (
                                    <Typography
                                      className="rankingNameText"
                                      sx={{
                                        fontSize:
                                          18 - (item.rank - 1) * 4 + "px",
                                        color: "#32BF72",
                                      }}
                                    >
                                      {item.votes} 票 (
                                      {(
                                        (item.votes / totalVotes) *
                                        100
                                      ).toFixed(2)}
                                      %)
                                    </Typography>
                                  )}
                                </Stack>
                              </Box> */}
                            </Box>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Container>
                </Box>
              </Box>
            </Box>

            <Box className="section">
              <Box
                className="columnBox"
                sx={{
                  backgroundColor: "#1a1a1a",
                  borderRadius: "24px",
                  width: { xs: "80%", md: "60%" },
                  mx: "auto",
                  padding: { xs: 2, md: 4 },
                  mt: 4,
                  boxShadow:
                    "0 0 30px rgba(51, 164, 102, 1), 0 10px 30px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Box
                  className="titleBox"
                  sx={{
                    display: "flex",
                    justifyContent: {
                      md: "center",
                    },
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: "100%",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "80%",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      className="sectionTitleBold"
                      sx={{
                        fontSize: { xs: "28px", md: "40px" },
                        // fontWeight: 400,
                        fontFamily: "Mantou Sans",
                        color: "#32BF72",
                        textShadow: "none",
                        mb: 1.5,
                        lineHeight: 1.1,
                        textAlign: "center",
                      }}
                    >
                      投選你想復活的選手
                    </Typography>
                  </Box>

                  <Typography
                    className="sectionTitleBold"
                    sx={{
                      fontSize: { xs: "14px", md: "18px" },
                      // fontWeight: 400,
                      fontFamily: "MStiffHei HK",
                      color: "#32BF72",
                      textShadow: "none",
                      mb: 1.5,
                      lineHeight: 1.1,
                    }}
                  >
                    (點選參賽者相片)
                  </Typography>
                </Box>
                <Box
                  className="rankingNumberInnerBox"
                  sx={{
                    marginTop: {
                      xs: "10px",
                      md: "5px",
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "center",
                    alignItems: "center",
                    border: "1.5px solid rgba(255,255,255,0.9)",
                    px: { xs: 2, md: 4 },
                    py: { xs: 1, md: 2 },

                    // gap: { xs: 0, md: 1 },
                  }}
                >
                  {new Date(eventDeadlineDate) > new Date() ? (
                    <>
                      <Typography
                        className="eventCountDownText"
                        sx={{
                          fontSize: {
                            xs: "16px",
                            md: "16px",
                          },
                          fontWeight: "bold",
                          fontFamily: "MStiffHei HK",
                        }}
                      >
                        距離投票截止還有
                      </Typography>

                      <Countdown
                        date={eventDeadlineDate}
                        renderer={({ days, hours, minutes }) => (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              justifyContent: "center",
                            }}
                          >
                            <Typography className="eventCountDownText2">
                              {days}
                            </Typography>
                            <Typography className="eventCountDownText3">
                              天
                            </Typography>
                            <Typography className="eventCountDownText2">
                              {hours}
                            </Typography>
                            <Typography className="eventCountDownText3">
                              時
                            </Typography>
                            <Typography className="eventCountDownText2">
                              {minutes}
                            </Typography>
                            <Typography className="eventCountDownText3">
                              分
                            </Typography>
                          </Box>
                        )}
                      />
                    </>
                  ) : (
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
                      投票已截止
                    </Typography>
                  )}
                </Box>

                <Grid
                  container
                  sx={{
                    marginTop: "10px",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  {rankingList.map((item, index) => (
                    <Grid
                      item
                      xs={3.6}
                      sm={3.2}
                      md={2.4}
                      key={item.name + item.participationNo + index}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "5px !important",
                      }}
                      className="avatarGridBox"
                    >
                      <Avatar
                        alt={item.name}
                        src={`/event1/${item.chineseName}.jpg`}
                        sx={{
                          width: "100%",
                          height: "auto",
                          aspectRatio: "1/1",
                          maxWidth: { xs: 120, sm: 120, md: 100 },
                          boxShadow: "0px 0px 5px 0px #000000",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          onParticipantClick(item);
                        }}
                      />

                      <Box
                        sx={{
                          cursor: "pointer",
                          paddingTop: "10px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                        onClick={() => {
                          onParticipantClick(item);
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "10px",
                              sm: "12px",
                              md: "12px",
                            },
                            color: "#FFFFFF",

                            fontFamily: "Caviar Dreams Bold",
                            lineHeight: 1.2,
                          }}
                        >
                          {String(item.participationNo).padStart(2, "0")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "10px",
                              sm: "12px",
                              md: "12px",
                            },
                            color: "#FFFFFF",
                            fontFamily: "MStiffHei HK",
                            lineHeight: 1.2,
                          }}
                        >
                          {item.chineseName}
                        </Typography>

                        {isAdmin && (
                          <Typography
                            className="rankingNameText"
                            sx={{
                              fontSize: "12px",
                              color: "#32BF72",
                              marginTop: "5px",
                            }}
                          >
                            {item.votes} 票 (
                            {((item.votes / totalVotes) * 100).toFixed(2)}
                            %)
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </>
        ) : new Date(eventStartDate) < new Date() ||
          new Date(eventStartDate) == "Invalid Date" ? (
          <LinearProgress
            sx={{
              marginTop: "-20px",
            }}
            color="success"
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "10vh",
              marginBottom: "100px",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "16px",
                  md: "20px",
                },
                color: "#FFFF ",
                fontWeight: "bold",
              }}
            >
              活動即將開始
            </Typography>
            <Box
              className="rankingNumberInnerBox eventCountDownBox"
              sx={{
                marginTop: {
                  xs: "10px",
                  md: "5px",
                },
                display: "flex",
                flexDirection: "row",
                alignSelf: "center",
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
                距離投票開始還有
              </Typography>
              <span className="eventCountDownDateText">
                {
                  <Countdown
                    date={eventStartDate}
                    renderer={({ days, hours, minutes }) => (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        <Typography className="eventCountDownText2">
                          {days}
                        </Typography>
                        <Typography className="eventCountDownText3">
                          天
                        </Typography>
                        <Typography className="eventCountDownText2">
                          {hours}
                        </Typography>
                        <Typography className="eventCountDownText3">
                          時
                        </Typography>
                        <Typography className="eventCountDownText2">
                          {minutes}
                        </Typography>
                        <Typography className="eventCountDownText3">
                          分
                        </Typography>
                      </Box>
                    )}
                  />
                }
              </span>
            </Box>
          </Box>
        )}
      </Container>
      <Footer type="home" isMd={isMd} />
    </Box>
  );
}

export default App;
