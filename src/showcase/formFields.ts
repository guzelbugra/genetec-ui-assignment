import { FieldConfig } from "../components/GenetecForm";
import { LogEvent } from "../data/mockData";

export const FORM_FIELDS: FieldConfig<LogEvent>[] = [
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
] ;
