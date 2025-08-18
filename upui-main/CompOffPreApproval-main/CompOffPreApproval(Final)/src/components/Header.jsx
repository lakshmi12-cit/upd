// Header.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// === your assets ===
import nestIcon from "../assets/nesticon.svg";
import editIcon from "../assets/edit.svg";
import keyIcon from "../assets/key.svg";
import saveIcon from "../assets/save.svg";
import squareIcon from "../assets/square.svg";
import userPhoto from "../assets/man-438081_960_720.svg"; // change extension if it's png/jpg

const Header = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tab, setTab] = useState("workspace");

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 12px",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* App logo + name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box component="img" src={nestIcon} alt="Nest" sx={{ width: 20, height: 20 }} />
          <Typography sx={{ fontSize: "18px", fontWeight: 400, color: "##111827", lineHeight: 1.2 }}>
            Nest
          </Typography>
        </Box>

        {/* Toggle Tabs */}
        <ToggleButtonGroup
          value={tab}
          exclusive
          onChange={(e, v) => v && setTab(v)}
          sx={{
            borderRadius: "50px",
            overflow: "hidden",
            bgcolor: "#e5e7eb",
            ml: 1.5,
            "& .MuiToggleButton-root": {
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 500,
              px: 2.5,
              py: 0.6,
              border: "none",
              borderRadius: "50px !important",
              color: "#374151",
              flex: 1,
              whiteSpace: "nowrap",
            },
            "& .Mui-selected": {
              backgroundColor: "#0ea5e9 !important",
              color: "white !important",
            },
          }}
        >
          <ToggleButton value="workspace">My Workspace</ToggleButton>
          <ToggleButton value="manager">Manager Hub</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Right Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Search Box */}
        <Box sx={{ position: "relative", width: 220 }}>
          <SearchIcon
            sx={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b7280",
              fontSize: 20,
            }}
          />
          <InputBase
            placeholder="search…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{
              p: "8px 12px 8px 40px",
              borderBottom: "1px solid #e5e7eb",
              width: "100%",
              fontSize: "14px",
            }}
          />
        </Box>

        {/* Calendar with green tick */}
        <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
          <IconButton
            sx={{ color: "#6b7280", p: "4px", position: "relative" }}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <CalendarMonthOutlinedIcon sx={{ fontSize: 28, color: "gray" }} />
            <Box
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </Box>
          </IconButton>

          {selectedDate && (
            <Typography sx={{ ml: "6px", fontSize: "12px", color: "#6b7280" }}>
              {dayjs(selectedDate).format("DD-MMM-YYYY")}
            </Typography>
          )}

          {showDatePicker && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                zIndex: 1000,
                mt: "8px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{ textField: { size: "small", style: { display: "none" } } }}
                  open
                  onClose={() => setShowDatePicker(false)}
                />
              </LocalizationProvider>
            </Box>
          )}
        </Box>

        {/* Your asset icons */}
        <IconButton sx={{ p: 0.5 }}>
          <Box component="img" src={editIcon} alt="Edit" sx={{ width: 22, height: 22 }} />
        </IconButton>
        <IconButton sx={{ p: 0.5 }}>
          <Box component="img" src={keyIcon} alt="Key" sx={{ width: 22, height: 22 }} />
        </IconButton>
        <IconButton sx={{ p: 0.5 }}>
          <Box component="img" src={saveIcon} alt="Save" sx={{ width: 22, height: 22 }} />
        </IconButton>
        <IconButton sx={{ p: 0.5 }}>
          <Box component="img" src={squareIcon} alt="Apps" sx={{ width: 22, height: 22 }} />
        </IconButton>

        {/* Notifications with red badge */}
        <IconButton sx={{ color: "#6b7280", position: "relative" }}>
          <Badge
            badgeContent={6}
            color="error"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.65rem",
                height: 16,
                minWidth: 16,
                top: 4,
                right: 4,
              },
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Profile */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            pl: 1.5,
            borderLeft: "1px solid #e5e7eb",
          }}
        >
          <Avatar sx={{ width: 32, height: 32 }} src={userPhoto} />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>Isha Kumar</Typography>
            <Typography sx={{ fontSize: "12px", color: "#6b7280" }}>Sr. Developer</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
