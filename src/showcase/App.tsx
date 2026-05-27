import { useEffect, useState } from "react";
import { GenetecDataGrid, BaseColumn } from "../components/GenetecDataGrid";
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
      const config =
        statusConfig[value as LogEvent["status"]] || statusConfig.verbose;
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
  { accessor: "timestamp", label: "Timestamp", width: 220 },
  {
    accessor: "description",
    label: "Description",
    width: 500,
    sortable: false,
  },
];

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
          v9.3.
        </Typography>

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
      </Box>
    </Container>
  );
};
