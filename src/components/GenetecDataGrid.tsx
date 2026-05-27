import React from "react";
import {
  ColumnsPanelTrigger,
  DataGrid,
  GridColDef,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { Box, Toolbar, Typography } from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

export interface BaseColumn<R> {
  accessor: keyof R;
  label: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (value: any, row: R) => React.ReactNode;
}

interface GenetecDataGridProps<R extends GridValidRowModel> {
  title?: string;
  rows: R[];
  columns: BaseColumn<R>[];
  loading?: boolean;
  error?: boolean;
  height?: number | string;
}

const CustomToolbar = ({ title }: { title?: string }) => {
  return (
    <Toolbar sx={{ p: 1, justifyContent: "space-between" }}>
      {title ? <Typography variant="h5">{title}</Typography> : <Box />}
      <ColumnsPanelTrigger startIcon={<ViewColumnIcon />}>
        Edit Column Visibility
      </ColumnsPanelTrigger>
    </Toolbar>
  );
};

export const GenetecDataGrid = <R extends GridValidRowModel>({
  title,
  rows,
  columns,
  loading = false,
  error = false,
  height = 550,
}: GenetecDataGridProps<R>) => {
  const muiColumns: GridColDef<R>[] = columns.map((col) => ({
    field: col.accessor as string,
    headerName: col.label,
    width: col.width || 150,
    sortable: col.sortable ?? true,
    filterable: col.filterable ?? true,
    ...(col.renderCell && {
      renderCell: (params) => col.renderCell!(params.value, params.row),
    }),
  }));

  return (
    <Box sx={{ height: height, width: "100%", mt: 2 }}>
      <DataGrid
        label={"label"}
        rows={error ? [] : rows}
        columns={muiColumns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        showToolbar
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: () => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {error ? (
                <Typography color="error" variant="body2">
                  {"An error occurred while loading the data."}
                </Typography>
              ) : (
                <Typography color="primary" variant="body2">
                  {"No data available to display"}
                </Typography>
              )}
            </Box>
          ),
        }}
        slotProps={{
          toolbar: { title },
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
};
