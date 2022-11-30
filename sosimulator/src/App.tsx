import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  AlgorithmType,
  edf,
  fifo,
  roundRobin,
  sjf,
} from "./algorithms/algorithms";
import { memoryPush } from "./algorithms/memory";
import "./App.css";
import Graphic from "./components/Graphic";
import ProcessCard from "./components/ProcessCard";
import convertDataToGraphic from "./utils/utils";

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

export interface IGraphicData {
  averageTurnaroundTime: number;
  result: IResult[];
}

export interface IResult {
  processNumber: number;
  result: number[];
  deadline?: number;
}

function App() {
  const [processNumber, setProcessNumber] = useState(0);
  const [quantum, setQuantum] = useState(0);
  const [overload, setOverload] = useState(0);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(AlgorithmType.fifo);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [data, setData] = useState<any>([]);
  const [graphic, setGraphic] = useState(false);
  const [animated, setAnimated] = useState(false);

  let memoria: any[] = [{processNumber: "Vazio", memoryPages: 50}]
  memoria = memoryPush({processNumber: 1, memoryPages: 10}, memoria)
  memoria = memoryPush({processNumber: 2, memoryPages: 10}, memoria)
  memoria = memoryPush({processNumber: 3, memoryPages: 10}, memoria)
  memoria = memoryPush({processNumber: 4, memoryPages: 10}, memoria)
  // memoria = memoryPush({processNumber: 5, memoryPages: 10}, memoria)
  // memoria = memoryPush({processNumber: 6, memoryPages: 10}, memoria)
  // memoria = memoryPush({processNumber: 8, memoryPages: 5}, memoria)
  // memoria = memoryPush({processNumber: 9, memoryPages: 2}, memoria)
  // memoria = memoryPush({processNumber: 10, memoryPages: 2}, memoria)
  // memoria = memoryPush({processNumber: 11, memoryPages: 2}, memoria)
  // memoria = memoryPush({processNumber: 12, memoryPages: 10}, memoria)
  // memoria = memoryPush({processNumber: 13, memoryPages: 10}, memoria)
  // memoria = memoryPush({processNumber: 14, memoryPages: 2}, memoria)
  console.log(memoria)
  console.log(processes)
  processes.map( e => memoryPush(e, memoria))

  useEffect(() => {
    if (
      processNumber > 0 &&
      (["fifo", "sjf"].includes(algorithm) || (quantum > 0 && overload > 0)) &&
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
        remainingTime: 0,
        intervals: [],
        overDeadline: false,
        timeFinished: 0,
      });
    }
    setProcesses(newProcesses);
  }, [processNumber]);

  useEffect(() => {
    if (["fifo", "sjf"].includes(algorithm)) {
      if (quantum > 0) {
        setQuantum(0);
      }
      if (overload > 0) {
        setOverload(0);
      }
    }
  }, [algorithm]);

  if (graphic) {
    return (
      <div style={{ height: "90vh", width: "50vw" }}>
        <Graphic
          data={data}
          onClose={() => setGraphic(false)}
          animated={animated}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Switch
            checked={animated}
            onChange={() => setAnimated((prev) => !prev)}
          />
          <Typography>Gráfico animado</Typography>
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="Quantum"
            value={quantum}
            onChange={(e: any) => setQuantum(e.target.value)}
            disabled={["fifo", "sjf"].includes(algorithm)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="Sobrecarga"
            value={overload}
            onChange={(e: any) => setOverload(e.target.value)}
            disabled={["fifo", "sjf"].includes(algorithm)}
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
            // @ts-ignore
            onChange={(e: any) => setAlgorithm(AlgorithmType[e.target.value])}
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
            algorithmType={algorithm}
          />
        ))}
      <Button
        disabled={btnDisabled}
        onClick={() =>
          convertDataToGraphic({
            processes,
            algorithm,
            quantum,
            overload,
            setData,
            setGraphic,
          })
        }
        style={{ margin: "5px" }}
      >
        Iniciar
      </Button>
    </div>
  );
}

export default App;
