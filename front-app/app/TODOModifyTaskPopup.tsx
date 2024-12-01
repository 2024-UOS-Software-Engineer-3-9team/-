import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

const Screen = (): JSX.Element => {
  return (
    <Box display="flex" justifyContent="center" width="100%" bgcolor="white">
      <Box
        width={300}
        height={270}
        position="relative"
        overflow="hidden"
        bgcolor="white"
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2.5}
          position="absolute"
          top={10}
          left={1}
          width={300}
          height={10}
        >
          <Box width={1} height={3} bgcolor="#d9d9d9" />
          <Typography
            variant="subtitle2"
            color="textSecondary"
            fontWeight="bold"
          >
            완료 일자를 입력하세요(Ex 24/11/20)
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          gap={5}
          position="absolute"
          top={225}
          left={0}
          width={300}
          height={45}
          px={3}
        >
          <Button variant="contained" color="primary" sx={{ bgcolor: "black" }}>
            확인
          </Button>
          <Button variant="contained" color="primary" sx={{ bgcolor: "black" }}>
            취소
          </Button>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          gap={2.5}
          position="absolute"
          top={80}
          left={0}
          width={300}
          height={145}
          p={2.5}
          overflow="auto"
        >
          <List>
            {["유지호", "강민지", "구효근", "김나린", "류수화", "문윤서"].map(
              (name) => (
                <ListItem key={name} disablePadding>
                  <Checkbox />
                  <ListItemText
                    primary={name}
                    primaryTypographyProps={{ fontWeight: "bold" }}
                  />
                </ListItem>
              ),
            )}
          </List>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          gap={2.5}
          position="absolute"
          top={0}
          left={0}
          width={300}
          height={40}
          px={2.5}
          bgcolor="white"
        >
          <Typography variant="subtitle1" fontWeight="bold">
            작업 내용을 선택하세요
          </Typography>
          <IconButton>
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Screen;
