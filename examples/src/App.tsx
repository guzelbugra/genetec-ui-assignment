import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GenetecDataGrid } from "../../lib/components/GenetecDataGrid";
import { GenetecTimeline } from "../../lib/components/GenetecTimeline";
import { initialMockData, LogEvent } from "./data/mockData";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { GenetecForm } from "../../lib/components/GenetecForm";
import { TimelineItem } from "./TimelineItem";
import { getLogColumns } from "./AppColumns";
import { FORM_FIELDS } from "./formFields";

export type LogChipColor = "success" | "info" | "warning" | "error" | "default";

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

  const handleGetGroupKey = useCallback((item: LogEvent) => {
    return new Date(item.timestamp);
  }, []);

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
          getGroupKey={handleGetGroupKey}
          renderItem={(item) => (
            <TimelineItem item={item} onEdit={handleEditClick} />
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
            fields={FORM_FIELDS}
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
