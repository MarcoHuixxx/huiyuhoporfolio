import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Container from "@mui/material/Container";
import BannerImage from "./assets/banner.jpg";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Item from "@mui/material/ListItem";
import axios from "axios";
import moment from "moment";
import { dummyList } from "./constants";
import Countdown from "react-countdown";
axios.defaults.headers.post["Content-Type"] = "application/json";
const serverUrl = import.meta.env.VITE_API_BASE_URL;
import Avatar from "@mui/material/Avatar";
import wewaClubIcon from "./assets/wewaClub.svg";
import BigBIcon from "./assets/bigb.svg";
import citywalkIcon from "./assets/citywalk.svg";
import poppingIcon from "./assets/popping.svg";
import pravoIcon from "./assets/pravo.svg";
import singIcon from "./assets/sing.svg";
import wewaIcon from "./assets/wewa.svg";
import checkedIcon from "./assets/checked.svg";
import sponsorIcon from "./assets/sponsor.svg";
import voteMethodImage from "./assets/voteMethod.png";
//set axios default url
axios.defaults.baseURL = serverUrl;

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventDeadlineDate, setEventDeadlineDate] = useState(
    "2024-06-30T23:59:59"
  );
  const [showVoteMethod, setShowVoteMethod] = useState(false);
  const [rankingList, setRankingList] = useState(dummyList);
  const [thirdRankingList, setThirdRankingList] = useState([]);

  useEffect(() => {
    const thirdList = dummyList.sort((a, b) => b.votes - a.votes).slice(0, 3);
    setThirdRankingList(thirdList);
  }, []);

  const rankingTitleMapping = {
    0: "第一名",
    1: "第二名",
    2: "第三名",
  };

  const TextRing = ({ children }) => {
    const CHARS = children.split("");
    const INNER_ANGLE = 180 / CHARS.length;
    return (
      <span
        className="text-ring"
        style={{
          "--total": CHARS.length,
          "--radius": 1 / Math.sin(INNER_ANGLE / (620 / Math.PI)),
        }}
      >
        {CHARS.map((char, index) => (
          <span key={char + index} style={{ "--index": index }}>
            {char}
          </span>
        ))}
      </span>
    );
  };

  const [totalVotes, setTotalVotes] = useState(600);

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
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{
                      color: "#e04478",
                    }}
                    onClick={() => setShowVoteMethod(!showVoteMethod)}
                  >
                    <span className="voteMethodTitleText">投票方法</span>
                  </Button>
                </Grid>
              </Grid>
              <Grid
                container
                sx={{
                  display: showVoteMethod ? "block" : "none",
                }}
              >
                <Grid item xs={12}>
                  <Container maxWidth="md">
                    <span className="sectionTitleBold">投票方法</span>
                    <Stack direction="column" spacing={0}>
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
                      <Item className="flexRow">
                        <img
                          src={checkedIcon}
                          alt="checked"
                          className="checkedIcon"
                        />
                        <p className="voteMethodTextP">
                          <span className="voteMethodText">成為</span>
                          <Box
                            sx={{
                              display: "inline-block",
                              verticalAlign: "bottom",
                              alignItems: "bottom",
                            }}
                          >
                            <img
                              src={wewaClubIcon}
                              alt="wewaClub"
                              className="wewaClubIcon"
                            />
                          </Box>
                          <span className="voteMethodText">會員</span>
                          <span className="voteMethodTextBold">
                            每日可投選兩票
                          </span>
                          <span className="voteMethodTextDesc">
                            (只限同一名參賽者)
                          </span>
                        </p>
                        {/* <Box
                          className="flexRow"
                          sx={{
                            marginLeft: "10px",
                          }}
                        >
                          <span className="voteMethodText">成為</span>
                          <img
                            src={wewaClubIcon}
                            alt="wewaClub"
                            className="wewaClubIcon"
                          />
                          <span className="voteMethodText">會員</span>
                          <span className="voteMethodTextBold">
                            每日可投選兩票
                          </span>
                          <span className="voteMethodTextDesc">
                            (只限同一名參賽者)
                          </span>
                          <Button
                            sx={{
                              backgroundColor: "#e04478",
                              color: "#ffffff",
                              borderRadius: "0px",
                              padding: "5px 10px",
                              marginLeft: "10px",
                              boxShadow: "0px 0px 10px 0px #000000",
                              // transform: "translate(-120px,35px)",
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
                          >
                            立即登記會員
                          </Button>
                        </Box> */}
                        {/* <Button
                          sx={{
                            backgroundColor: "#e04478",
                            color: "#ffffff",
                            borderRadius: "0px",
                            padding: "5px 10px",
                            marginLeft: "10px",
                            boxShadow: "0px 0px 10px 0px #000000",
                            transform: "translate(-120px,35px)",
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
                        >
                          立即登記會員
                        </Button> */}
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
              <span className="sectionTitleBold">投票走勢</span>
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
                        }}
                      >
                        <span className="rankingNumberText">
                          {rankingTitleMapping[index]}
                        </span>
                      </Box>
                    </Grid>
                    <Grid item xs={8}>
                      <Box className="rankingContentBox">
                        <Box className="iconRankingBox">
                          <Avatar
                            alt={item.name}
                            src={item.image}
                            sx={{
                              width: 50 - (item.rank - 1) * 10 + "px",
                              height: 50 - (item.rank - 1) * 10 + "px",
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
                                fontSize: 18 - (item.rank - 1) * 4 + "px",
                              }}
                            >
                              {item.participationNo}
                            </Typography>
                            <Typography
                              className="rankingNameText"
                              sx={{
                                fontSize: 18 - (item.rank - 1) * 4 + "px",
                              }}
                            >
                              {item.chineseName}
                            </Typography>
                            <Typography
                              className="rankingNameText"
                              sx={{
                                fontSize: 18 - (item.rank - 1) * 4 + "px",
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
                                {((item.votes / totalVotes) * 100).toFixed(2)}%)
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
              <span className="sectionTitle">投選</span>
              <span className="sectionTitleBold">你</span>
              <span className="sectionTitle">想</span>
              <span className="sectionTitleBold">復活的選手</span>
            </Box>
            <Box className="rankingNumberInnerBox eventCountDownBox">
              <span className="eventCountDownText">距離投票截止還有</span>
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
              <Grid container>
                {rankingList.map((item, index) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    key={item.name + item.participationNo}
                    className="avatarGridBox"
                  >
                    <TextRing side={1.1}>{item.chineseName}</TextRing>
                    {/* <span className="participantName">{item.name}</span> */}
                    <Avatar
                      alt={item.name}
                      src={item.image}
                      sx={{
                        width: { xs: 100, sm: 150, md: 200 },
                        height: { xs: 100, sm: 150, md: 200 },
                        boxShadow: "0px 0px 10px 0px #000000",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
