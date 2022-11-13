import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { edf, fifo, roundRobin, sjf } from "./algorithms/algorithms";
import "./App.css";
import Graphic from "./components/Graphic";
import ProcessCard from "./components/ProcessCard";

export interface Interval {
  start: number | undefined;
  end: number | undefined;
}
export interface IProcess {
  processNumber: number;
  arrivalTime: number;
  executionTime: number;
  deadline: number;
  remainingTime: number;
  timeFinished: number;
  overDeadline: boolean;
  intervals: Interval[];
}

function App() {
  const [processNumber, setProcessNumber] = useState(0);
  const [quantum, setQuantum] = useState(0);
  const [overload, setOverload] = useState(0);
  const [algorithm, setAlgorithm] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [data, setData] = useState<any>([]);
  const [graphic, setGraphic] = useState(false);

  const handleClick = () => {
    let res = null;
    let arr = [];
    switch (algorithm) {
      case "fifo":
        res = fifo(processes);
        arr = [];
        res.result.forEach((r: any, i: number) => {
          arr.push({
            processNumber: r.processNumber,
            result: Array.from(Array(r.end).keys())
              .fill(0, 0, r.waitTime)
              .fill(2, r.waitTime, r.start)
              .fill(1, r.start, r.end),
          });
        });
        break;
      case "sjf":
        res = sjf(processes);
        arr = [];
        res.result.forEach((r: any, i: number) => {
          arr.push({
            processNumber: r.processNumber,
            result: Array.from(Array(r.end).keys())
              .fill(0, 0, r.waitTime)
              .fill(2, r.waitTime, r.start)
              .fill(1, r.start, r.end),
          });
        });

        break;
      case "edf":
        res = edf(processes, quantum, overload);
        res.result.forEach((r: any, i: number) => {
          const notProcessedPositions: number[] = [];
          const firstProcessedPosition = r.intervals[0].start;
          const processedPositions: number[] = [];
          const overloadPositions: number[] = [];
          const deadlinePositions: number[] = [];
          const trueDeadline = r.arrivalTime + r.deadline;

          r.intervals.forEach((interval: Interval, i: number) => {
            if (i < r.intervals.length - 1) {
              if (r.intervals[i + 1].start !== interval.end) {
                const diff = r.intervals[i + 1].start - interval.end;
                notProcessedPositions.push(
                  ...Array.from(Array(diff).keys()).map((n) => n + interval.end)
                );
              }
            }
          });
          for (
            let i = firstProcessedPosition;
            i < r.intervals[r.intervals.length - 1].end;
            i++
          ) {
            if (!notProcessedPositions.includes(i)) {
              if (i >= trueDeadline) {
                deadlinePositions.push(i);
              } else {
                processedPositions.push(i);
              }
            }
          }

          for (let interval of r.intervals) {
            if (interval.end - interval.start > quantum) {
              for (let i = +interval.start + +quantum; i < +interval.end; i++) {
                overloadPositions.push(i);
              }
            }
          }

          const result = Array.from(
            Array(r.intervals[r.intervals.length - 1].end)
          ).fill(0);

          if (r.arrivalTime < firstProcessedPosition) {
            result.fill(2, r.arrivalTime, firstProcessedPosition);
          }

          processedPositions.forEach((p: number) => {
            result[p] = 1;
          });
          notProcessedPositions.forEach((p: number) => {
            result[p] = 2;
          });
          deadlinePositions.forEach((p: number) => {
            result[p] = 3;
          });
          overloadPositions.forEach((p: number) => {
            result[p] = 4;
          });

          arr.push({
            processNumber: r.processNumber,
            result,
          });
        });
        break;
      case "rr":
        res = roundRobin(processes, quantum, overload);
        res.result.forEach((r: any, i: number) => {
          const notProcessedPositions: number[] = [];
          const firstProcessedPosition = r.intervals[0].start;
          const processedPositions: number[] = [];
          const overloadPositions: number[] = [];

          r.intervals.forEach((interval: Interval, i: number) => {
            if (i < r.intervals.length - 1) {
              if (r.intervals[i + 1].start !== interval.end) {
                const diff = r.intervals[i + 1].start - interval.end;
                notProcessedPositions.push(
                  ...Array.from(Array(diff).keys()).map((n) => n + interval.end)
                );
              }
            }
          });
          for (
            let i = firstProcessedPosition;
            i < r.intervals[r.intervals.length - 1].end;
            i++
          ) {
            if (!notProcessedPositions.includes(i)) {
              processedPositions.push(i);
            }
          }

          for (let interval of r.intervals) {
            if (interval.end - interval.start > quantum) {
              for (let i = +interval.start + +quantum; i < +interval.end; i++) {
                overloadPositions.push(i);
              }
            }
          }

          const result = Array.from(
            Array(r.intervals[r.intervals.length - 1].end)
          ).fill(0);

          if (r.arrivalTime < firstProcessedPosition) {
            result.fill(2, r.arrivalTime, firstProcessedPosition);
          }

          processedPositions.forEach((p: number) => {
            result[p] = 1;
          });
          notProcessedPositions.forEach((p: number) => {
            result[p] = 2;
          });
          overloadPositions.forEach((p: number) => {
            result[p] = 4;
          });
          arr.push({
            processNumber: r.processNumber,
            result,
          });
        });

        break;
    }
    setData({
      result: arr,
      averageTurnaroundTime: res?.averageTurnaroundTime,
    });
    setGraphic(true);
  };

  useEffect(() => {
    if (
      processNumber > 0 &&
      quantum > 0 &&
      overload > 0 &&
      algorithm !== "" &&
      processes.find((p) => p.executionTime === 0) == undefined
    ) {
      setBtnDisabled(false);
    } else if (!btnDisabled) {
      setBtnDisabled(true);
    }
  }, [processes, processNumber, quantum, overload, algorithm]);

  useEffect(() => {
    const newProcesses: IProcess[] = [];
    for (let i = 0; i < processNumber; i++) {
      newProcesses.push({
        processNumber: i + 1,
        arrivalTime: 0,
        executionTime: 0,
        deadline: 0,
      });
    }
    setProcesses(newProcesses);
  }, [processNumber]);

  if (graphic) {
    return (
      <div style={{ height: "90vh", width: "50vw" }}>
        <Graphic data={data} onClose={() => setGraphic(false)} />
      </div>
    );
  }

  return (
    <div className="App">
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="Quantum"
            value={quantum}
            onChange={(e: any) => setQuantum(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="Sobrecarga"
            value={overload}
            onChange={(e: any) => setOverload(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="Quantidade de processos"
            value={processNumber}
            onChange={(e: any) => setProcessNumber(e.target.value)}
          />
        </Grid>
        <Grid item xs={3} style={{ marginTop: "-24px" }}>
          <InputLabel>Algoritmo</InputLabel>
          <Select
            value={algorithm}
            onChange={(e: any) => setAlgorithm(e.target.value)}
            fullWidth
          >
            <MenuItem value="fifo">FIFO</MenuItem>
            <MenuItem value="sjf">SJF</MenuItem>
            <MenuItem value="rr">Round Robin</MenuItem>
            <MenuItem value="edf">EDF</MenuItem>
          </Select>
        </Grid>
      </Grid>
      {processes
        .sort((a, b) => a.processNumber - b.processNumber)
        .map((process, i) => (
          <ProcessCard
            process={process}
            setProcesses={setProcesses}
            index={i}
          />
        ))}
      <Button
        disabled={btnDisabled}
        onClick={handleClick}
        style={{ margin: "5px" }}
      >
        Iniciar
      </Button>
    </div>
  );
}

export default App;
