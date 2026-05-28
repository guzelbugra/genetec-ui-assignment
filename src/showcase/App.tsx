import React, { useEffect, useMemo, useState } from "react";
import { GenetecDataGrid, BaseColumn } from "../components/GenetecDataGrid";
import { GenetecTimeline } from "../components/GenetecTimeline";
import { initialMockData, LogEvent } from "../data/mockData";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { GenetecForm } from "../components/GenetecForm";
import EditIcon from "@mui/icons-material/Edit";

interface TimelineItemProps {
  item: LogEvent;
  onEdit: (item: LogEvent) => void;
}

type LogChipColor = "success" | "info" | "warning" | "error" | "default";

const statusConfig = {
  success: { color: "success", label: "SUCCESS" },
  info: { color: "info", label: "INFO" },
  warning: { color: "warning", label: "WARNING" },
  error: { color: "error", label: "ERROR" },
  verbose: { color: "default", label: "VERBOSE" },
};

const getLogColumns = (
  onEdit: (row: LogEvent) => void,
): BaseColumn<LogEvent>[] => [
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
  {
    accessor: "actions" as any,
    label: "Actions",
    width: 100,
    renderCell: (_value, row) => (
      <IconButton onClick={() => onEdit(row)} size="small">
        <EditIcon fontSize="small" />
      </IconButton>
    ),
  },
];

const GenetecTimelineItem: React.FC<TimelineItemProps> = React.memo(
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

export const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [editingLog, setEditingLog] = useState<LogEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLogs(initialMockData);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const generateNewLogId = (): string => {
    return `log-${Date.now()}`;
  };

  const handleEditClick = (row: LogEvent) => {
    setEditingLog(row);
    setIsModalOpen(true);
  };

  const logColumns = useMemo(() => getLogColumns(handleEditClick), []);

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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingLog(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box component="header">
        <Typography variant="h4">UI Library Showcase</Typography>

        <Typography variant="body1" color="text.secondary">
          System log management dashboard built with React, TypeScript and MUI
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
            Load Mock Events
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={onSimulateLoading}
          >
            Simulate Loading
          </Button>
          <Button variant="outlined" color="error" onClick={onSimulateError}>
            Simulate Error
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setEditingLog(null);
              setIsModalOpen(true);
            }}
          >
            Add Event
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
          items={logs}
          getGroupKey={(item) => new Date(item.timestamp)}
          renderItem={(item) => (
            <GenetecTimelineItem item={item} onEdit={handleEditClick} />
          )}
          loading={isLoading}
          error={isError}
        />
      </Box>

      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent dividers>
          <GenetecForm<LogEvent>
            title={editingLog ? "Edit Event" : "Add New Event"}
            fields={[
              {
                name: "title",
                label: "Log Message",
                type: "text",
                required: true,
              },
              {
                name: "timestamp",
                label: "Date",
                type: "date",
                required: true,
              },
              {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                options: [
                  { label: "Success", value: "success" },
                  { label: "Info", value: "info" },
                  { label: "Warning", value: "warning" },
                  { label: "Error", value: "error" },
                  { label: "Verbose", value: "verbose" },
                ],
              },
              { name: "description", label: "Description", type: "text" },
            ]}
            initialValues={
              editingLog || {
                id: "",
                title: "",
                timestamp: "",
                status: "info",
                description: "",
              }
            }
            onSubmit={(val) => {
              if (editingLog) {
                const updatedLogs = logs.map((item) =>
                  item.id === editingLog.id
                    ? ({ ...val, id: editingLog.id } as LogEvent)
                    : item,
                );
                setLogs(updatedLogs);
              } else {
                const generatedId = generateNewLogId();
                const newLog: LogEvent = {
                  ...val,
                  id: generatedId,
                };

                setLogs([newLog, ...logs]);
              }
            }}
            onCancel={handleModalClose}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};
