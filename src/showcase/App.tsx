import React, { useEffect, useState } from "react";
import { GenetecDataGrid, BaseColumn } from "../components/GenetecDataGrid";
import { GenetecTimeline } from "../components/GenetecTimeline";
import { initialMockData, LogEvent } from "../data/mockData";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

interface TimelineItemProps {
  item: LogEvent;
}

type LogChipColor = "success" | "info" | "warning" | "error" | "default";

const statusConfig = {
  success: { color: "success", label: "SUCCESS" },
  info: { color: "info", label: "INFO" },
  warning: { color: "warning", label: "WARNING" },
  error: { color: "error", label: "ERROR" },
  verbose: { color: "default", label: "VERBOSE" },
};

const logColumns: BaseColumn<LogEvent>[] = [
  { accessor: "id", label: "ID", width: 90 },
  {
    accessor: "status",
    label: "Level",
    width: 130,
    renderCell: (value) => {
      const config = statusConfig[value as LogEvent["status"]];
      return (
        <Chip
          label={config.label}
          color={config.color as LogChipColor}
          size="small"
          variant="outlined"
          sx={{ fontWeight: "bold", minWidth: "90px" }}
        />
      );
    },
  },
  { accessor: "title", label: "Log Message", width: 320 },
  {
    accessor: "timestamp",
    label: "Timestamp",
    width: 220,
    renderCell: (_value, data) => {
      return new Date(data.timestamp).toLocaleString();
    },
  },
  {
    accessor: "description",
    label: "Description",
    width: 500,
    sortable: false,
  },
];

const GenetecTimelineItem: React.FC<TimelineItemProps> = React.memo(
  ({ item }) => {
    return (
      <Stack
        direction="row"
        spacing={2}
        sx={{
          p: 1,
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
      </Stack>
    );
  },
);

export const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLogs(initialMockData);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const onSimulateLoading = () => {
    setLogs([]);
    setIsError(false);
    setIsLoading(true);
  };
  const onSimulateError = () => {
    setLogs([]);
    setIsLoading(false);
    setIsError(true);
  };
  const onLoadData = () => {
    setLogs(initialMockData);
    setIsLoading(false);
    setIsError(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box component="header">
        <Typography variant="h4">UI Library Showcase</Typography>

        <Typography variant="body1" color="text.secondary">
          System log management dashboard built with React,TypeScript and MUI
        </Typography>
        <Divider sx={{ my: 3, borderBottomWidth: "2px" }} />
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 1.5, fontWeight: "bold" }}
        >
          Debug Controls
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={onLoadData}
            disableElevation
          >
            Load Data
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={onSimulateLoading}
          >
            Simulate Loading
          </Button>
          <Button variant="outlined" color="error" onClick={onSimulateError}>
            Simulate Error
          </Button>
        </Stack>

        <Divider sx={{ my: 3, borderBottomWidth: "2px" }} />
      </Box>

      <GenetecDataGrid<LogEvent>
        title="Genetec Data Grid Showcase"
        rows={logs}
        columns={logColumns}
        loading={isLoading}
        error={isError}
      />
      <Box component="section" sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mt: 5, mb: 1 }}>
          Event Timeline
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Chronological view of system logs grouped by day.
        </Typography>
        <GenetecTimeline<LogEvent>
          items={logs.slice(0, 105)}
          getGroupKey={(item) => new Date(item.timestamp)}
          renderItem={(item) => <GenetecTimelineItem item={item} />}
          loading={isLoading}
          error={isError}
        />
      </Box>
    </Container>
  );
};
