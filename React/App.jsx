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
import sponsorIcon from "./assets/sponsor.svg";
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
import { Skeleton } from "@mui/material";
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

  useEffect(() => {
    const fetchRankingList = async () => {
      try {
        if (!isListLoaded) {
          const getEventResult = await axios.get(`/event/${eventId}`);
          console.log("getEventResult:", getEventResult.data.timeEnd);
          if (getEventResult?.data?.timeEnd) {
            console.log("buwbdiuwebdiubweviudbvxiwviv");
            setEventDeadlineDate(getEventResult.data.timeEnd);
          }
          const participantListResult = await axios.get(
            `/participant/${eventId}/${roundNumber}/100`
          );

          console.log("participantListResult:", participantListResult);
          if (participantListResult?.data?.length > 0) {
            const thirdList = participantListResult?.data
              .sort((a, b) => b.votes - a.votes)
              .slice(0, 3);
            setThirdRankingList(thirdList);
            setRankingList(participantListResult.data);
          }
          setIsListLoaded(true);
        }
      } catch (error) {
        setIsListLoaded(false);
        setRankingList([]);
        setThirdRankingList([]);
        setWindowErrorMesssage("獲取排名列表失敗");
        console.log("error:", error);
      }
    };
    fetchRankingList();
  }, [isListLoaded]);

  const handleOtpChange = (otp) => {
    console.log(otp);
  };

  function matchIsNumeric(text) {
    const isNumber = typeof text === "number";
    const isString = matchIsString(text);
    return (isNumber || (isString && text !== "")) && !isNaN(Number(text));
  }

  const validateChar = (value, index) => {
    return matchIsNumeric(value);
  };

  const rankingTitleMapping = {
    0: "第一名",
    1: "第二名",
    2: "第三名",
  };

  const onParticipantClick = (item) => {
    console.log("item", item);
    setVotePageIsOpen(true);
    setSelectedParticipant(item);
  };

  const onVoteButonClick = (item) => {
    console.log("item", item);
    setVoteDialogIsOpen(true);
    setShowOptDialog(false);
  };

  const onConfirmVote = async () => {
    try {
      setIsConfirmVoteLoading(true);
      console.log("onConfirmVote");
      setConfirmVoteIsClicked(true);
      if (!isPhoneValid || votes === 0) {
        setIsConfirmVoteLoading(false);
        return;
      }
      //checking if the user is voted today
      const isVotedToday = await checkIsVotedToday();

      if (isVotedToday) {
        setIsConfirmVoteLoading(false);
        setErrorMesssage("今天已參與投票，請明天再參與");
        return;
      }
      const senOptResult = await sendOtp();
      console.log("senOptResult:", senOptResult);

      if (senOptResult.success) {
        setShowOptDialog(true);
      } else {
        setErrorMesssage("發送驗證碼失敗, 請再試一次");
      }
      setIsConfirmVoteLoading(false);
    } catch (error) {
      console.log("error:", error);
      setIsConfirmVoteLoading(false);
      setErrorMesssage("發送驗證碼失敗, 請再試一次");
    }
  };

  const checkIsVotedToday = async () => {
    try {
      const result = await axios.get(`/check-vote/${phoneNumber}/${eventId}`);
      console.log("checkIsVotedToday result:", result);
      return result.data.isVoted;
    } catch (error) {
      console.log("error:", error);
      return true;
    }
  };

  const onConfirmOptInput = async () => {
    try {
      if (otp.length !== 6) {
        setIsOptValid(false);
        setIsOptChecked(true);
        return;
      }
      const result = await axios.get(`/verify-otp/${phoneNumber}/${otp}`);
      console.log("verify result:", result);

      if (result.data.success) {
        setIsOptValid(true);
        const voteData = {
          roundNumber,
          eventId,
          voterPhone: phoneNumber,
          voteCount: votes,
          wewaClubId: wewaClubId,
          participantId: selectedParticipant.id,
        };
        const voteResult = await axios.post("/vote", voteData);
        // const voteResult = { data: { success: true } };

        console.log("voteResult:", voteResult);

        if (voteResult.data.success) {
          // setVoteDialogIsOpen(false);
          setIsVoteSuccess(true);
        } else {
          setErrorMesssage("投票失敗, 請再試一次");
        }
      }
      setIsOptChecked(true);
    } catch (error) {
      setIsOptValid(false);
      setIsOptChecked(true);
      console.log("error:", error);
    }
  };

  const sendOtp = async () => {
    try {
      const result = await axios.get(`/send-otp/${phoneNumber}`, {
        phoneNumber: phoneNumber,
      });

      console.log("sendOtp sendOtp result:", result);

      return {
        success: result.data.success,
      };
      console.log("result:", result);
    } catch (error) {
      console.log("error:", error);
      return {
        success: false,
      };
    }
  };

  useEffect(() => {
    console.log("errorMessage:", errorMessage);
    if (errorMessage !== "") {
      console.log("errorMessage   dscdsnclnsdlnjl:");
      setConfirmVoteIsClicked(false);
    }
  }, [errorMessage]);

  useEffect(() => {
    const iswewaClubIdValidHandler = () => {
      const iswewaClubIdValidVar = wewaClubId
        ? wewaClubId.length === 11 && wewaClubId.startsWith("WWC")
        : true;

      setIswewaClubIdValid(iswewaClubIdValidVar);
    };

    iswewaClubIdValidHandler();
  }, [wewaClubId]);

  useEffect(() => {
    const isPhoneValidHandler = () => {
      const isPhoneValidVar = !(
        phoneNumber === "" || phoneNumber?.length !== 14
      );
      console.log("phoneNumber:", phoneNumber.length);
      console.log("isPhoneValidVar:", isPhoneValidVar);
      setIsPhoneValid(isPhoneValidVar);
    };

    isPhoneValidHandler();
  }, [phoneNumber]);

  const setVotePageIsOpenHandler = (value) => {
    setVotePageIsOpen(value);
  };

  useEffect(() => {
    console.log("votePageIsOpen:", votePageIsOpen);
    if (!votePageIsOpen || !voteDialogIsOpen) {
      if (!votePageIsOpen) {
        setSelectedParticipant({});
        setVoteDialogIsOpen(false);
      }

      //redirect to home page after vote success and close the dialog
      if (isVoteSuccess) {
        setIsListLoaded(false);
        setVoteDialogIsOpen(false);
      }

      console.log("voteDialogIsOpen:", voteDialogIsOpen);
      setErrorMesssage("");
      setIsOptChecked(false);
      setIsOptValid(false);
      setIsPhoneValid(false);
      setIsVoteSuccess(false);
      setPhoneNumber("");
      setWewaClubId("");
      setVotes(0);
      setOtp("");
      setIswewaClubIdValid(true);
      setShowOptDialog(false);
      setConfirmVoteIsClicked(false);
    }
  }, [votePageIsOpen, voteDialogIsOpen]);

  const handleDialogClose = useCallback(() => setVotePageIsOpen(false), []);

  // useEffect(() => {
  //   axios
  //     .get("/ranking/3")
  //     .then((res) => {
  //       setRankingList(res.data);
  //       setTotalVotes(
  //         res.data.reduce((acc, item) => {
  //           return acc + item.votes;
  //         }, 0)
  //       );
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);

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
                              xs: "14px",
                              md: "18px",
                            },
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
                              selectedParticipant.instagram,
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
                      <YoutubeEmbed embedId={selectedParticipant.video} />
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
                    xs={8}
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
                        <Typography display={"inline"}>
                          {selectedParticipant.chineseName}
                        </Typography>
                        <Typography display={"inline"}>
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
                        <Typography display={"inline"}>
                          Year {selectedParticipant.studyingYear}
                        </Typography>
                      </Box>
                      <Typography className="votePageInfoText">
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
                              selectedParticipant.instagram,
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
                    xs={6}
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

                      <YoutubeEmbed embedId={selectedParticipant.video} />
                    </Box>
                  </Grid>
                </Grid>
              </Container>
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
                padding: "40px",
              }}
            >
              {/* <FormControl> */}
              <InputLabel htmlFor="my-input">電話號碼</InputLabel>
              <MuiPhoneNumber
                defaultCountry={"hk"}
                onChange={(value) => setPhoneNumber(value)}
                onlyCountries={["hk"]}
              />
              {(!isPhoneValid && phoneNumber !== "") ||
              (confirmVoteIsClicked && phoneNumber === "") ? (
                <p className="inputErrorText">請輸入8位數字電話號碼</p>
              ) : phoneNumber !== "" ? (
                <p className="inputSuccessText">電話號碼正確</p>
              ) : (
                ""
              )}
              <InputLabel
                htmlFor="my-input"
                sx={{
                  marginTop: "20px",
                }}
              >
                Wewa Club 會員編號 (如有)
              </InputLabel>
              <Input
                id="my-input"
                aria-describedby="my-helper-text"
                onChange={(e) => setWewaClubId(e.target.value)}
              />
              {wewaClubId !== "" && !iswewaClubIdValid ? (
                <p className="inputErrorText">
                  Wewa Club 會員編號無效 (只能投取1票)
                </p>
              ) : wewaClubId !== "" ? (
                <p className="inputSuccessText">
                  Wewa Club 會員編號有效 (現在可以投取2票)
                </p>
              ) : (
                ""
              )}

              <InputLabel
                id="demo-simple-select-label"
                sx={{
                  marginTop: "20px",
                  marginBottom: "10px",
                }}
              >
                投取票數
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={votes}
                onChange={(e) => setVotes(e.target.value)}
              >
                <MenuItem value={0}>-請選擇-</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                {wewaClubId !== "" && iswewaClubIdValid && (
                  <MenuItem value={2}>2</MenuItem>
                )}
              </Select>
              <p className="inputErrorText">
                {votes === 0 && confirmVoteIsClicked ? "請選擇投票數" : ""}
              </p>

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
                  marginTop: "20px",
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
            (console.log("isVoteSuccessXXXXXX:", isVoteSuccess),
            (
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
            ))
          ) : (
            <Box
              sx={{
                padding: "40px",
              }}
            >
              <InputLabel
                htmlFor="my-input"
                sx={{
                  marginBottom: "20px",
                }}
              >
                請輸入6位數字的手機驗證碼
              </InputLabel>
              <MuiOtpInput
                value={otp}
                onChange={(newValue) => {
                  setOtp(newValue);
                }}
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
                <Button
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
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    確認
                  </Typography>
                </Button>
              </Box>
              {!isOptValid && isOptChecked && (
                <Box
                  sx={{
                    paddingTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <p className="inputErrorText text-center">
                    {isOptChecked ? "驗證碼錯誤" : ""}
                  </p>
                </Box>
              )}
            </Box>
          )}
        </Dialog>
      </Dialog>
      <Container>
        <Box className="section">
          <Box className="columnBox">
            <img src={BannerImage} alt="Banner" className="BannerImage" />
            <Box className="navBar">
              <Grid container>
                <Grid item xs={8}>
                  <Box className="iconRowBox">
                    <img src={sponsorIcon} alt="wewa" className="sponsorIcon" />
                  </Box>
                </Grid>
                <Grid item xs={4} className="voteBox">
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
                    }}
                    onClick={() => setShowVoteMethod(!showVoteMethod)}
                  >
                    <Typography
                      className="voteMethodTitleText"
                      sx={{
                        fontSize: {
                          xs: "12px",
                          sm: "16px",
                          md: "18px",
                        },
                        fontWeight: "bold",
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
                  padding: "10px 0px",
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
                        fontWeight: "bold",
                      }}
                    >
                      投票方法
                    </Typography>
                    <Stack
                      direction="column"
                      spacing={0}
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
                              xs: "34px",
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
                            backgroundColor: "#e04478",
                            color: "#ffffff",
                            borderRadius: "0px",
                            padding: "5px 10px",
                            marginLeft: "10px",
                            boxShadow: "0px 0px 10px 0px #000000",
                            position: "absolute",
                            right: {
                              xs: "10%",
                              sm: "50%",
                              md: "50%",
                            },
                            bottom: "-20px",
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
                          <span className="voteMethodTextBold">
                            立即登記會員
                          </span>
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

        <Box className="section">
          <Box className="columnBox">
            <Box className="titleBox">
              <Typography
                className="sectionTitleBold"
                sx={{
                  fontSize: {
                    xs: "28px",
                    sm: "32px",
                    md: "36px",
                  },
                  fontWeight: "bold",
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
                                (
                                  item.votes / thirdRankingList[0]["votes"]
                                ).toFixed(2) *
                                  70 +
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
                              }}
                            >
                              {item.participationNo}
                            </Typography>
                            <Typography
                              className="rankingNameText"
                              sx={{
                                fontSize: 18 - index * 4 + "px",
                              }}
                            >
                              {item.chineseName}
                            </Typography>
                            <Typography
                              className="rankingNameText"
                              sx={{
                                fontSize: 18 - index * 4 + "px",
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
                                {((item.votes / totalVotes) * 100).toFixed(2)}
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
            <Box className="titleBox">
              <Typography
                className="sectionTitle"
                display="inline"
                sx={{
                  fontSize: {
                    xs: "28px",
                    sm: "32px",
                    md: "36px",
                  },
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
                }}
              >
                復活的選手
              </Typography>
            </Box>
            <Box
              className="rankingNumberInnerBox eventCountDownBox"
              // sx={{
              //   boxShadow: "0px 0px 10px 0px #000000",
              // }}
            >
              <Typography
                className="eventCountDownText"
                sx={{
                  fontSize: {
                    xs: "10px",
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
                    xs={6}
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
                      }}
                      onClick={() => {
                        onParticipantClick(item);
                      }}
                    >
                      <Typography
                        display="inline"
                        sx={{
                          fontSize: {
                            xs: "16px",
                            sm: "18px",
                            md: "20px",
                          },
                          color: "#e04478",
                          fontWeight: "bold",
                          marginRight: "3px",
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
                        }}
                      >
                        {item.name}
                      </Typography>
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

        <Box
          className="section"
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <img src={icmaIcon} alt="icma" className="icmaIcon" />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
