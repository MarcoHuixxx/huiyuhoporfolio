import { useState, useEffect } from "react";
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
import { dummyList } from "./constants";
import Countdown from "react-countdown";
axios.defaults.headers.post["Content-Type"] = "application/json";
const serverUrl = import.meta.env.VITE_API_BASE_URL;
import Avatar from "@mui/material/Avatar";
import wewaClubIcon from "./assets/wewaClub.svg";
import InstagramIcon from "./assets/ig2.webp";
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
  const [votePageIsOpen, setVotePageIsOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState({});

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

  const onParticipantClick = (item) => {
    console.log("item", item);
    setVotePageIsOpen(true);
    setSelectedParticipant(item);
  };

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

  const Screen = () => {
    return votePageIsOpen ? (
      <>
        <Dialog open={votePageIsOpen} setOpen={setVotePageIsOpen} fullScreen>
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
          <Box class="mobileVotePageBox">
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
                      borderLeft: "1px solid #FFF",
                      paddingX: "10px",
                      marginY: "50px",
                    }}
                  >
                    <Stack direction="column" spacing={1}>
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
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "end",
                            paddingLeft: "6px",
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
                            fontSize: "13px",
                            fontWeight: "100",
                            textDecoration: "underline",
                            alignSelf: "center",
                          }}
                        >
                          @{selectedParticipant.instagram}
                        </Typography>
                      </Box>
                      <Typography className="votePageInfoText">
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
                    onClick={() => {
                      onVoteButonClick(selectedParticipant);
                    }}
                  >
                    <span className="voteButtonText">投票</span>
                  </Button>
                </Box>
              </Container>
            </Container>
          </Box>
          <Container
            maxWidth="sm"
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <Box class="webVotePageBox">
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
                      onClick={() => {
                        onVoteButonClick(selectedParticipant);
                      }}
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
        </Dialog>
      </>
    ) : (
      <Box className="PageContainer">
        <Container>
          <Box className="section">
            <Box className="columnBox">
              <img src={BannerImage} alt="Banner" className="BannerImage" />
              <Box className="navBar">
                <Grid container>
                  <Grid item xs={8}>
                    <Box className="iconRowBox">
                      <img
                        src={sponsorIcon}
                        alt="wewa"
                        className="sponsorIcon"
                      />
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
                              window.open(
                                "https://club.wewacard.com/",
                                "_blank"
                              );
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
                      sm={4}
                      md={3}
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
  };

  return <Screen />;
}

export default App;
