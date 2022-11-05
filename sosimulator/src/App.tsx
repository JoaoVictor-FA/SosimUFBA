import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { edf, fifo, roundRobin, sjf } from "./algorithms/algorithms";
import "./App.css";
import Graphic from "./components/Graphic";
import ProcessCard from "./components/ProcessCard";

export interface IProcess {
  processNumber: number;
  arrivalTime: number;
  executionTime: number;
  deadline: number;
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
            processNumber: i + 1,
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
            processNumber: i + 1,
            result: Array.from(Array(r.end).keys())
              .fill(0, 0, r.waitTime)
              .fill(2, r.waitTime, r.start)
              .fill(1, r.start, r.end),
          });
        });

        break;
      case "edf":
        setData(edf(processes, quantum, overload));
        break;
      case "roundRobin":
        setData(roundRobin(processes, quantum, overload));
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
      <TextField
        type="number"
        label="Quantum"
        value={quantum}
        onChange={(e: any) => setQuantum(e.target.value)}
      />
      <TextField
        type="number"
        label="Sobrecarga"
        value={overload}
        onChange={(e: any) => setOverload(e.target.value)}
      />
      <TextField
        type="number"
        label="Quantidade de processos"
        value={processNumber}
        onChange={(e: any) => setProcessNumber(e.target.value)}
      />
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
      {processes
        .sort((a, b) => a.processNumber - b.processNumber)
        .map((process, i) => (
          <ProcessCard
            process={process}
            setProcesses={setProcesses}
            index={i}
          />
        ))}
      <Button disabled={btnDisabled} onClick={handleClick}>
        Iniciar
      </Button>
    </div>
  );
}

export default App;
