import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Fade,
} from "@mui/material";

interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type?: "text" | "date" | "select";
  options?: { label: string; value: string }[];
  required?: boolean;
}

interface GenetecFormProps<T> {
  fields: FieldConfig<T>[];
  initialValues: T;
  onSubmit: (values: T) => void;
  onCancel: () => void;
  title: string;
}

export const GenetecForm = <T extends Record<string, any>>({
  fields,
  initialValues,
  onSubmit,
  onCancel,
  title,
}: GenetecFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof T, string>> = {};

    fields.forEach((f) => {
      if (f.required && !values[f.name]) {
        newErrors[f.name] = `${f.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowSuccess(true);
    setErrors({});

    onSubmit(values);

    setTimeout(() => {
      setShowSuccess(false);
      onCancel();
    }, 2000);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {showSuccess && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="success" variant="filled">
            Operation completed successfully!
          </Alert>
        </Box>
      )}

      <Stack spacing={2}>
        {fields.map((f) =>
          f.type === "select" ? (
            <FormControl
              fullWidth
              key={String(f.name)}
              error={!!errors[f.name]}
            >
              <InputLabel>{f.label}</InputLabel>
              <Select
                value={values[f.name] || ""}
                label={f.label}
                disabled={showSuccess}
                onChange={(e) =>
                  setValues({ ...values, [f.name]: e.target.value })
                }
              >
                {f.options?.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              key={String(f.name)}
              label={f.label}
              variant="outlined"
              fullWidth
              disabled={showSuccess}
              slotProps={{ inputLabel: { shrink: true } }}
              type={f.type === "date" ? "datetime-local" : "text"}
              value={values[f.name] || ""}
              onChange={(e) =>
                setValues({ ...values, [f.name]: e.target.value })
              }
              error={!!errors[f.name]}
              helperText={errors[f.name]}
            />
          ),
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" disabled={showSuccess}>
            Save
          </Button>
          <Button onClick={onCancel} variant="outlined" disabled={showSuccess}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
