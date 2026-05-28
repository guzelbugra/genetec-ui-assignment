import React from "react";
import { Stack, Typography, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { LogEvent } from "./data/mockData";
import { LogChipColor } from "./App";

interface TimelineItemProps {
  item: LogEvent;
  onEdit: (item: LogEvent) => void;
}

export const TimelineItem: React.FC<TimelineItemProps> = React.memo(
  ({ item, onEdit }) => {
    return (
      <Stack
        direction="row"
        spacing={2}
        sx={{
          p: 1,
          alignItems: "center",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {new Date(item.timestamp).toLocaleTimeString()}
        </Typography>

        <Chip
          label={item.status.toUpperCase()}
          variant="outlined"
          size="small"
          color={item.status as LogChipColor}
          sx={{ fontWeight: "bold", minWidth: "90px" }}
        />

        <Typography variant="body2">{item.title}</Typography>

        <IconButton onClick={() => onEdit(item)} size="small" color="default">
          <EditIcon fontSize="small" />
        </IconButton>
      </Stack>
    );
  },
);
