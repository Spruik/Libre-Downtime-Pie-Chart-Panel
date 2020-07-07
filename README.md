# Downtime Pie Chart Panel

| Libre Panel for Pie Chart Downtime Analysis

Custom Drill-Down Nested Pie Chart Plugin that visualises the Reason Codes Data showing what category and reason happened for how many times (in frequency mode) or what category and reason took how much time (in duration mode).

## Influxdb Query example

```influxdb
SELECT
  "Site"
  ,"Area"
  ,"Line"
  ,"duration"
  ,"durationInt"
  ,"execute"
  ,"held"
  ,"idle"
  ,"stopped"
  ,"complete"
  ,"category"
  ,"reason"
  ,"comment"
  ,"parentReason"
FROM "Availability"
WHERE $timeFilter
```

## Data format

Data MUST be formatted as a TABLE