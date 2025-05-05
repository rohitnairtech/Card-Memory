import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { getGameHistory } from "../../services/axios";
import background from "../../assets/images/mode1.gif";
import bgMusic from "../../assets/audio/memory-bg.mp3";

const StyledGameContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundImage: `url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  padding: "20px",
}));

const PixelTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "32px",
  color: "#fff",
  textShadow: "0 0 10px #00d9ff, 0 0 20px #00d9ff",
  marginTop: "40px",
  marginBottom: "40px",
  textAlign: "center",
}));

const PixelButton = styled(Box)(({ theme }) => ({
  display: "inline-block",
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const TableContainer = styled(Box)(({ theme }) => ({
  width: "80%",
  maxWidth: "900px",
  margin: "0 auto",
  backgroundColor: "rgba(44, 44, 84, 0.85)",
  borderRadius: "12px",
  border: "3px solid #00d9ff",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  overflow: "hidden",
  padding: "5px",
}));

const StyledTable = styled('table')(({ theme }) => ({
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0",
  fontFamily: '"Press Start 2P", cursive',
  color: "white",
  fontSize: "12px",
}));

const TableHeader = styled('th')(({ theme }) => ({
  padding: "15px",
  backgroundColor: "#1a1a38", 
  borderBottom: "2px solid #00d9ff",
  textAlign: "center",
  color: "#00d9ff",
  fontSize: "14px",
}));

const TableRow = styled('tr')(({ theme, isCompleted }) => ({
  backgroundColor: isCompleted ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: isCompleted ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)",
    transform: "scale(1.01)",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
  },
}));

const TableCell = styled('td')(({ theme }) => ({
  padding: "12px",
  textAlign: "center",
  borderBottom: "1px solid rgba(0, 217, 255, 0.3)",
}));

const EmptyMessage = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "16px",
  color: "#fff",
  textAlign: "center",
  margin: "30px 0",
  padding: "20px",
  backgroundColor: "rgba(44, 44, 84, 0.7)",
  borderRadius: "8px",
  border: "2px solid #00d9ff",
}));

const LoadingMessage = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "16px",
  color: "#fff",
  textAlign: "center",
  margin: "30px 0",
  animation: "pulse 1.5s infinite",
  "@keyframes pulse": {
    "0%, 100%": {
      opacity: 1,
    },
    "50%": {
      opacity: 0.5,
    },
  },
}));


const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "20px",
  gap: "10px",
}));

const PageButton = styled(Box)(({ theme, active }) => ({
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: active ? "#00d9ff" : "#2c2c54",
  color: active ? "#1a1a38" : "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  width: "30px",
  height: "30px",
  border: "2px solid #00d9ff",
  borderRadius: "6px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  transition: "transform 0.2s, background-color 0.2s",
  "&:hover": {
    backgroundColor: active ? "#00d9ff" : "#40407a",
    transform: "scale(1.05)",
  },
}));

const History = () => {
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bgVolume, setBgVolume] = useState(
    parseInt(localStorage.getItem("bgVolume"), 10) || 0
  );
  
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const recordsPerPage = 10;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = gameHistory.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(gameHistory.length / recordsPerPage);


  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    audioRef.current = new Audio(bgMusic);
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = bgVolume / 100;

    const handleClick = () => {
      audio.play().catch((error) =>
        console.error("Background music playback failed:", error)
      );
      document.removeEventListener("click", handleClick);
    };

    document.addEventListener("click", handleClick);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      document.removeEventListener("click", handleClick);
    };
  }, [bgVolume]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getGameHistory();
        setGameHistory(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []); 

  const handleBackButton = () => {
    navigate("/play");
  };

  // Pagination handlers
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <StyledGameContainer>
      <audio ref={audioRef} src={bgMusic} loop />
      
      <PixelButton 
        onClick={handleBackButton} 
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px"
        }}
      >
        Back
      </PixelButton>

      <PixelTitle>Game History</PixelTitle>

      {loading ? (
        <LoadingMessage>Loading game history...</LoadingMessage>
      ) : error ? (
        <EmptyMessage>{error}</EmptyMessage>
      ) : gameHistory.length === 0 ? (
        <EmptyMessage>No game history found. Start playing to create records!</EmptyMessage>
      ) : (
        <>
          <TableContainer>
            <StyledTable>
              <thead>
                <tr>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Difficulty</TableHeader>
                  <TableHeader>Failed Attempts</TableHeader>
                  <TableHeader>Time Taken</TableHeader>
                  <TableHeader>Completed</TableHeader>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => (
                  <TableRow key={index} isCompleted={record.completed === 1}>
                    <TableCell>{formatDate(record.gameDate)}</TableCell>
                    <TableCell>{record.difficulty}</TableCell>
                    <TableCell>{record.failed}</TableCell>
                    <TableCell>{formatTime(record.timeTaken)}</TableCell>
                    <TableCell>{record.completed === 1 ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </StyledTable>
          </TableContainer>
          {totalPages > 1 && (
            <PaginationContainer>
              <PageButton onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                &lt;
              </PageButton>
              
              {[...Array(totalPages)].map((_, i) => (
                <PageButton
                  key={i}
                  active={i + 1 === currentPage}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </PageButton>
              ))}
              
              <PageButton onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                &gt;
              </PageButton>
            </PaginationContainer>
          )}
        </>
      )}
    </StyledGameContainer>
  );
};

export default History;