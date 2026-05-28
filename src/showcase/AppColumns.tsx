import { Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { BaseColumn } from "../components/GenetecDataGrid";
import { LogEvent } from "../data/mockData";
import { LogChipColor } from "./App";

const statusConfig = {
  success: { color: "success", label: "SUCCESS" },
  info: { color: "info", label: "INFO" },
  warning: { color: "warning", label: "WARNING" },
  error: { color: "error", label: "ERROR" },
  verbose: { color: "default", label: "VERBOSE" },
};

export const getLogColumns = (
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
