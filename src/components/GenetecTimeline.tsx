import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Collapse,
  CircularProgress,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";

// Hidden styles for screen-reader friendly announcements
const screenReaderHiddenStyle = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
};

interface GenetecTimelineProps<T> {
  items: T[];
  getGroupKey: (item: T) => Date;
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  error?: boolean;
}

export const GenetecTimeline = <T,>({
  items,
  getGroupKey,
  renderItem,
  loading = false,
  error = false,
}: GenetecTimelineProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Group items by local date string
  const grouped = useMemo(() => {
    if (loading || error) return [];
    const res: Record<string, T[]> = {};
    items.forEach((item) => {
      const dateObj = getGroupKey(item);
      const key = dateObj.toLocaleDateString();
      if (!res[key]) {
        res[key] = [];
      }
      res[key].push(item);
    });
    return Object.entries(res);
  }, [items, getGroupKey, loading, error]);

  // Open the group on top by default
  useEffect(() => {
    if (grouped.length > 0) {
      setExpanded({ [grouped[0][0]]: true });
    }
  }, [grouped]);

  const toggleGroup = (key: string) => {
    const nextExpanded = { ...expanded };
    nextExpanded[key] = !nextExpanded[key];
    setExpanded(nextExpanded);
  };

  // Accessible keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const activeElement = document.activeElement as HTMLElement;
    const isHeader = activeElement?.classList.contains("group-header");
    const isItem = activeElement?.classList.contains("item-row");

    const groupKey = activeElement?.getAttribute("data-group-key");
    const parentGroupKey = activeElement?.getAttribute("data-parent-group-key");

    // 1. Controls when focus is on the group header
    if (isHeader && groupKey) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleGroup(groupKey);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setExpanded((prev) => ({ ...prev, [groupKey]: true }));
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setExpanded((prev) => ({ ...prev, [groupKey]: false }));
        return;
      }
    }

    // 2. Left arrow closes the group and moves focus back to header
    if (isItem && parentGroupKey && e.key === "ArrowLeft") {
      e.preventDefault();
      setExpanded((prev) => ({ ...prev, [parentGroupKey]: false }));

      const targetHeader = containerRef.current?.querySelector<HTMLElement>(
        `.group-header[data-group-key="${parentGroupKey}"]`,
      );
      targetHeader?.focus();
      return;
    }

    // 3. Up - Down sequential navigation
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      // Select only visible headers and expanded rows
      const focusableItems = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          ".group-header, .MuiCollapse-entered .item-row",
        ) || [],
      );

      const currentIndex = focusableItems.indexOf(activeElement);
      if (currentIndex === -1) return;

      if (e.key === "ArrowDown" && currentIndex < focusableItems.length - 1) {
        e.preventDefault();
        focusableItems[currentIndex + 1].focus();
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
        e.preventDefault();
        focusableItems[currentIndex - 1].focus();
      }
    }
  };

  // Early return for loading state
  if (loading) {
    return (
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  // Early return for error state
  if (error) {
    return (
      <Box sx={{ mt: 4, p: 2 }}>
        <Typography color="error" variant="body2">
          Failed to load timeline data. Please try again.
        </Typography>
      </Box>
    );
  }

  if (!grouped.length) return null;

  return (
    <Box ref={containerRef} onKeyDown={handleKeyDown} sx={{ mt: 4 }}>
      {grouped.map(([groupKey, groupItems]) => {
        const isExpanded = !!expanded[groupKey];

        return (
          <Paper key={groupKey} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box
              className="group-header"
              tabIndex={0}
              role="button"
              aria-expanded={isExpanded}
              // Accessible label
              aria-label={`Date group ${groupKey}, ${groupItems.length} items`}
              data-group-key={groupKey}
              onClick={() => toggleGroup(groupKey)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                outline: "none",
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon color="primary" fontSize="small" />
                <Typography variant="h6" component="span">
                  {groupKey}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  ({groupItems.length})
                </Typography>
              </Box>
              <ExpandMoreIcon
                sx={{ transform: isExpanded ? "rotate(180deg)" : "none" }}
              />
            </Box>
            <Collapse in={isExpanded} timeout={0}>
              <Divider sx={{ my: 2 }} />
              <Timeline
                sx={{
                  p: 0,
                  m: 0,
                  [`& .MuiTimelineItem-root:before`]: { flex: 0, padding: 0 },
                }}
              >
                {groupItems.map((item, index) => (
                  <TimelineItem key={index} sx={{ minHeight: "40px" }}>
                    <TimelineSeparator>
                      <TimelineDot
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 2.9, mb: 1 }}
                      />
                      {index < groupItems.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>

                    <TimelineContent>
                      <Box
                        className="item-row"
                        tabIndex={0}
                        data-parent-group-key={groupKey}
                        sx={{
                          outline: "none",
                          "&:focus-visible": {
                            outline: "2px solid",
                            outlineColor: "primary.main",
                          },
                        }}
                      >
                        <Box component="span" sx={screenReaderHiddenStyle}>
                          {`In group ${groupKey}, item ${index + 1} of ${groupItems.length}: `}
                        </Box>
                        {renderItem(item, index)}
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
};
